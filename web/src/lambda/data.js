import pathToRegex from "path-to-regexp";
import CryptoJS from "crypto-js";
import request from "request-promise";

// import slug from "slug";

// import vandium from 'vandium'
// const vandium = require( 'vandium' );

require("dotenv").config();

function createMetaFieldsArray(user, body, visibility) {
  // console.log('metafields', user, body, visibility)
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

/* refactoring info
// 1. Pre-check - check if token is available -> yes, load user info (every check later possible)
                                              -> no, check if queryUser & slug is avaliable and graph is public (limited access!!)
// 2. Check http Method and handle request

Notes:
- Use errorHandler callback
- Use successHandler callback
- Work with closures to avoid passing event & callback around
*/

// consts here can be re-used by multiple lambda invokations

/*
 bug:
 2nd callback with undefined triggered and throwing an error message 'UnhandledPromiseRejectionWarning:'
 Exception in serve.js because lambdaResponse.statusCode is undefinded
 - why is it triggered?

*/
export async function handler(event, context, callback) {
  // console.log('lambda start', event);
  context.callbackWaitsForEmptyEventLoop = false;
  console.log("lambda start", context, event);

  const httpMethod = event.httpMethod;
  let user;
  let token;
  // let callbackCalled = false // just a test -> UnhandledPromiseRejectionWarning in console even with callbackOnce

  // ==================== default callbacks ====================================
  // function callbackOnce(error, statusCode) {
  //   // just one callback per handler allowed
  //   if (!callbackCalled) {
  //     console.log('call callback');
  //     callback(error, statusCode);
  //     callbackCalled = true;
  //   }
  // }

  function errorHandler(error, statusCode) {
    // console.log('error', error);
    error = error || new Error("Internal error");
    statusCode = statusCode || 500;

    callback(null, {
      headers: {
        "content-type": "application/json"
      },
      statusCode: statusCode,
      body: JSON.stringify(error)
    });
  }

  function successHandler(body) {
    // console.log('success')
    callback(null, {
      headers: {
        "content-type": "application/json"
      },
      statusCode: 200,
      body: JSON.stringify(body)
    });
  }

  // ==========================================

  // =============helper methods ==============
  async function getUser() {
    try {
      user = await request("https://api.github.com/user", {
        headers: {
          "user-agent": "awolf81-drawviz-app",
          authorization: token
        },
        json: true
      }); // get auth user,

      return user;
      // console.log('user response', response, event)
    } catch (error) {
      // console.log("error github req", error);
      // errorHandler(error);
      return error;
    }
  }

  // function filterDotfiles(data) {
  //   let foundObj;
  //   console.log("filterdotfiles", data);
  //   if (slug) {
  //     foundObj =
  //       data.objects && data.objects.filter(object => object.slug === slug)[0];
  //     if (queryUser && queryUser !== (user && user.login)) {
  //       // query for not owned dotfile:
  //       // visibility = [username]  // future feature
  //       // or visibility = public
  //       // console.log('found', foundObj);
  //       // console.log('queryUser != login', queryUser, user && user.login, foundObj.metadata && foundObj.metadata.visibility );
  //       if (
  //         foundObj.metadata &&
  //         foundObj.metadata.visibility &&
  //         foundObj.metadata.visibility === "private"
  //       ) {
  //         // console.log('error!', new Error('Access denied!'));
  //         errorHandler({ error: { message: "Access denied!" } }, 401); // new Error('Access denied!'));
  //         return;
  //       }
  //     }

  //     if (foundObj === undefined) {
  //       errorHandler({ error: { message: "Url not found" } }, 404);
  //       return;
  //     }

  //     // Decrypt
  //     try {
  //       console.log("found obj before decrypt", foundObj);
  //       const bytes = CryptoJS.AES.decrypt(
  //         foundObj.metadata.body,
  //         process.env.CRYPTO_PASSPHRASE
  //       );
  //       const plaintext = bytes.toString(CryptoJS.enc.Utf8);
  //       foundObj.metadata.body = plaintext; // replace body with decrypted
  //       // console.log('decrypt', plaintext);
  //       // replace in metafields as well --> removed from query
  //       // let metaFieldBody = foundObj.metafields.find(obj => obj.key === 'body');
  //       // if (metaFieldBody) {
  //       //   metaFieldBody.value = plaintext;
  //       // }
  //     } catch (err) {
  //       // malformed utf-8 error --> returns encrypted plaintext
  //       // happens if CRYPTO_PASSPHRASE is incorrect
  //       errorHandler({ error: { message: "Decryption failed" } }, 500);
  //       return;
  //     }
  //   } else {
  //     // all data -> return list of entries (with-out body value)
  //     // --> needed so we're not exposing encrypted data
  //     foundObj = data.objects.filter(obj => {
  //       // remove body from metadata and metafields --> not needed in list view
  //       let newObj = obj;

  //       // delete newObj.metafields;
  //       delete newObj.metadata.body;

  //       // console.log('newobj', newObj);

  //       return newObj;
  //     });
  //   }
  //   return foundObj;
  // }

  async function preCheck() {
    token = event.headers.authorization;
    if (token) {
      user = await getUser();
      if (user && user.error) {
        errorHandler(user.error); // error in getUser
        return;
      }
    }

    return true;
  }
  // ================================================

  // ====== pre-check & preparation of request ======
  const checkResult = await preCheck();
  if (!checkResult) {
    return callback(null);
  }

  const pathParams = getPathValues();
  queryUser = pathParams && pathParams.queryUser;
  slug = pathParams && pathParams.slug;
  // ================================================

  // ========== Main lambda handlers ================
  const handlers = {
    GET: async () => {
      // const data = await readBucket.getObjects({
      //   type: "dotfiles",
      //   // slug: slug, // --> not supported
      //   hide_metafields: true,
      //   metafield_key: "ghUser",
      //   metafield_value: queryUser || (user && user.login),
      //   sort: "-modified_at"
      // });

      // let foundObj = filterDotfiles(data); // also handles decrypt --> check if it's better to separate (OK, for now as we're having it only here)
      // if (foundObj === undefined) {
      //   return;
      // }
      successHandler({ dotfiles: [] /*foundObj*/ });
    }
    // POST: async () => {
    //   let body;
    //   const eventBody = JSON.parse(event.body);
    //   // Encrypt
    //   if (eventBody.body) {
    //     const ciphertext = CryptoJS.AES.encrypt(
    //       eventBody.body,
    //       process.env.CRYPTO_PASSPHRASE
    //     );
    //     body = ciphertext.toString();
    //   }
    //   const title = eventBody.title;
    //   const visibility = eventBody.visibility;
    //   slug = eventBody.params.slug;

    //   console.log("parsed", body, title, slug, user.login);
    //   // edit or new graph
    //   try {
    //     let data = { objects: [] };

    //     if (slug) {
    //       // data = await readBucket.getObjects({
    //       //   type_slug: "dotfiles",
    //       //   // slug: slug, // --> not supported - would be a great feature for cosmic.js as combined query slug with metafield
    //       //   metafield_key: "ghUser",
    //       //   metafield_value: user.login
    //       // });
    //       // data.objects = data.objects.filter(obj => obj.slug === slug);
    //     }

    //     // console.log("edit", slug, body, event.body, data.objects.length, user && user.login);
    //     // console.log('objects', data.objects);
    //     const foundTitle =
    //       data.objects.length === 1 ? data.objects[0].title : "";

    //     if (
    //       data.objects.length === 0 ||
    //       (title !== undefined && title !== foundTitle)
    //     ) {
    //       // add new graph - not found or title changed - saveAs
    //       const params = {
    //         title,
    //         content: "", // add description later
    //         metafields: createMetaFieldsArray(user.login, body, visibility),
    //         type_slug: "dotfiles",
    //         options: {
    //           slug_fields: false
    //         }
    //       };
    //       const { object: newObject } = await writeBucket.addObject(params);

    //       // console.log('Added object', newObject, newObject.slug);
    //       successHandler({
    //         msg: "Successfully created",
    //         redirect: `/${user.login}/${newObject.slug}`
    //       });
    //     } else if (data.objects.length === 1) {
    //       // owner of dotfile
    //       // one object with slug & user available --> would be great if it would be possible to add user to editObject as well
    //       // slug is unique for all users that's why it is working
    //       const metadata = data.objects[0].metadata; // just if we're not changing the data --> default value

    //       await writeBucket.editObject({
    //         // possible improvement for Cosmic.js --> just edit the fields that are passed & not replace the whole object
    //         slug: slug,
    //         title: title || data.objects[0].title,
    //         options: {
    //           slug_fields: false
    //         },
    //         metafields: createMetaFieldsArray(
    //           eventBody.params.user,
    //           body || metadata.body,
    //           visibility || metadata.visibility
    //         )
    //       });

    //       // console.log("updated", response);
    //       successHandler({
    //         msg: "Successfully updated"
    //       });
    //     }
    //   } catch ({ error }) {
    //     errorHandler(error);
    //   }
    // },
    // DELETE: async () => {
    //   // console.log('delete', event.body);
    //   // const eventBody = JSON.parse(event.body);
    //   // slug = eventBody.slug;

    //   console.log("delete", slug);
    //   if (user.login !== queryUser) {
    //     errorHandler({ error: "Only owner can delete" }, 401);
    //     return;
    //   }

    //   try {
    //     await writeBucket.deleteObject({
    //       slug
    //     });
    //     successHandler({ msg: "Object deleted", slug });
    //   } catch (error) {
    //     errorHandler(error);
    //   }
    // }
  };

  // console.log('about to handle httpMethod', httpMethod);
  if (Object.keys(handlers).indexOf(httpMethod) !== -1) {
    await handlers[httpMethod]();
  } else {
    errorHandler({ error: "Not handled: " + httpMethod }, 404);
  }

  console.log("exiting");
  // callback(null)
}
