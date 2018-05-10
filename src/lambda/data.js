import Cosmic from "cosmicjs";
import pathToRegex from 'path-to-regexp'; 
import CryptoJS from 'crypto-js';
import request from 'request-promise';

// import vandium from 'vandium'

// const vandium = require( 'vandium' );
require('dotenv').config()

function createMetaFieldsArray(user, body, visibility) {
  return [
    {
      title: "Github user",
      key: "ghUser",
      value: user,
      type: "text",
      required: true
    },
    {
      title: "Body",
      key: "body",
      value: body,
      type: "textarea",
      required: true
    },
    {
      title: "Visibility",
      key: "visibility",
      value: visibility,
      type: "text",
      required: true
    }
  ];
}

function errorHandler(callback, error = new Error('Internal error'), statusCode = 200) {
  console.log('error', error);
  callback(null, {
    headers: {
      "content-type": "application/json"
    },
    statusCode,
    body: JSON.stringify(error)
  });
}

export async function handler(event, context, callback) {
  // console.log('event info', event, context)
  console.log('event src domain', event.referer)
  let user;
  const token = event.headers.authorization;

  if (!token) {
    callback(null, {
      headers: {
        "content-type": "application/json"
      },
      statusCode: 200,
      body: JSON.stringify({
        error: "Token required!"
      })
    });
    return;
  }

  try {
    user = await request("https://api.github.com/user", {
      headers: {
        "user-agent": "awolf81-drawviz-app",
        authorization: token
      },
      json: true
    }); // get auth user,

    // console.log('user response', response, event)
  } catch ({error}) {
    console.log("error", error);
    errorHandler(callback, error);
    return;
  }

  if (event.httpMethod === "GET") {
    const api = Cosmic();
    const bucket = api.bucket({
      slug: process.env.COSMIC_SLUG,
      read_key: process.env.COSMIC_READ_KEY
    });
    // const data = await bucket.getObjectsByType({type_slug: 'dotfiles'})
    let queryUser, slug;
    const re = pathToRegex('(.*)/data/:user/:dot');
    const tokens = re.exec(event.path);

    if (tokens && tokens.length >= 4) {
      // user & slug in url
      queryUser = tokens[2];
      slug = tokens[3];
    }

    console.log('path parts', event.path, tokens, queryUser, slug);
    try {
      const data = await bucket.getObjects({
        type: "dotfiles",
        // slug: slug, // --> not supported
        hide_metafields: true, // --> seems removed
        metafield_key: "ghUser",
        metafield_value: queryUser || user.login,
        sort: '-modified_at'
      });

      let foundObj;
      if (slug) {
        foundObj = data.objects && data.objects.filter(object => object.slug === slug)[0];
        if (queryUser && queryUser !== user.login) {
          // query for not owned dotfile:
          // visibility = [username]  // future feature
          // or visibility = public
          console.log('queryUser != login', queryUser, user.login, foundObj.metadata.visibility );
          if (foundObj.metadata.visibility && foundObj.metadata.visibility === 'private') { 
            // console.log('error!', new Error('Access denied!'));
            errorHandler(callback, {error: { message: 'Access denied!'}}, 401); // new Error('Access denied!'));
            return;
          }
        }

        if (foundObj === undefined) {
          errorHandler(callback, {error: { message: 'Url not found'}}, 404);
          return;
        }

        // Decrypt
        try {
          const bytes  = CryptoJS.AES.decrypt(foundObj.metadata.body, process.env.CRYPTO_PASSPHRASE);
          const plaintext = bytes.toString(CryptoJS.enc.Utf8);
          foundObj.metadata.body = plaintext; // replace body with decrypted
          console.log('decrypt', plaintext);
          // replace in metafields as well --> removed from query
          // let metaFieldBody = foundObj.metafields.find(obj => obj.key === 'body');
          // if (metaFieldBody) {
          //   metaFieldBody.value = plaintext;
          // }
        }
        catch(err) {
          // malformed utf-8 error --> returns encrypted plaintext
          // happens if CRYPTO_PASSPHRASE is incorrect
          errorHandler(callback, {error: { message: 'Decryption failed'}}, 500);
          return;
        }
      }
      else {
        // return list of entries (with-out body value)
        // --> needed so we're not exposing encrypted data
        foundObj = data.objects.filter(obj => {
          // remove body from metadata and metafields --> not needed in list view
          let newObj = obj;

          // delete newObj.metafields;
          delete newObj.metadata.body 

          // console.log('newobj', newObj);

          return newObj;
        });
      }

      
      // console.log('metafield query', queryUser || user.login);
      // todo check if visibility is set to public --> restriction if not owner
      console.log('data', foundObj, slug);

      callback(null, {
        headers: {
          "content-type": "application/json"
        },
        statusCode: 200,
        body: JSON.stringify({ dotfiles: foundObj})
      });
    } catch (error) {
      console.log("error", error);
      errorHandler(callback, error, 500);
      return;
    }
  }

  if (event.httpMethod === "POST") {
    console.log("post", event.body);
    const api = Cosmic();
    const bucket = api.bucket({
      slug: process.env.COSMIC_SLUG,
      read_key: process.env.COSMIC_READ_KEY,
      write_key: process.env.COSMIC_WRITE_KEY
    });
    const eventBody = JSON.parse(event.body);
    // Encrypt
    var ciphertext = CryptoJS.AES.encrypt(eventBody.body, process.env.CRYPTO_PASSPHRASE);
    
    // Decrypt
    // var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
    // var plaintext = bytes.toString(CryptoJS.enc.Utf8);

    const body = ciphertext.toString();
    const title = eventBody.title;
    const visibility = eventBody.visibility;
    const slug = eventBody.params.slug;

    console.log('parsed', body, title, slug, user.login)
    // edit or new graph
    try {
      let data = {objects: []};

      if (slug) {
        data = await bucket.searchObjectType({
          type_slug: "dotfiles",
          // slug: slug, // --> not supported
          metafield_key: "ghUser",
          metafield_value: user.login
        });
        
        data.objects = data.objects.filter(obj => obj.slug === slug);
      }

      console.log("edit", slug, body, event.body, data.objects.length, user.login);

      console.log('objects', data.objects);

      if (data.objects.length === 0) {
        // add new graph
        const params = {
          title,
          content: "", // add description later
          metafields: createMetaFieldsArray(user.login, body, visibility),
          type_slug: 'dotfiles',
          options: {
            slug_fields: false
          }
        };
        const {object: newObject} = await bucket.addObject(params);

        console.log('Added object', newObject, newObject.slug);
        callback(null, {
          headers: {
            "content-type": "application/json"
          },
          statusCode: 200,
          body: JSON.stringify({
            msg: "Successfully created",
            redirect: `/${user.login}/${newObject.slug}`
          })
        });
      } else if (data.objects.length === 1) {
        // owner of dotfile
        // one object with slug & user available --> would be great if it would be possible to add user to editObject as well
        // slug is unique for all users that's why it is working
        const response = await bucket.editObject({
          slug: slug,
          metafields: createMetaFieldsArray(eventBody.params.user, body, visibility)
        });

        console.log("updated", response);
        callback(null, {
          headers: {
            "content-type": "application/json"
          },
          statusCode: 200,
          body: JSON.stringify({
            msg: "Successfully updated"
          })
        });
      }
    } catch ({error}) {
      errorHandler(callback, error);
      return;
    }
  }

  if (event.httpMethod === "DELETE") {
    // todo --> reuse post & delete bucket const
    const api = Cosmic();
    const bucket = api.bucket({
      slug: process.env.COSMIC_SLUG,
      read_key: process.env.COSMIC_READ_KEY,
      write_key: process.env.COSMIC_WRITE_KEY
    });
    console.log('delete', event.body);
    const eventBody = JSON.parse(event.body);

    if (user.login !== eventBody.user) {
      errorHandler(callback, {error: 'Only owner can delete'}, 401);
      return;
    }

    try {
      await bucket.deleteObject({
        slug: eventBody.slug
      })
    } catch(error) {
      errorHandler(callback, error);
      return;
    }
  }
}
