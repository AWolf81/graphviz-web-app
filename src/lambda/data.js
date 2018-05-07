import Cosmic from "cosmicjs";
import request from "request-promise-native";
// import vandium from 'vandium'

// const vandium = require( 'vandium' );
const env = require("dotenv").config();

function createMetaFieldsArray(user, body) {
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
    }
  ];
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
  } catch (err) {
    console.log("error", err);
    return err;
  }

  if (event.httpMethod === "GET") {
    const api = Cosmic();
    const bucket = api.bucket({
      slug: env.parsed.COSMIC_SLUG,
      read_key: env.parsed.COSMIC_READ_KEY
    });
    // const data = await bucket.getObjectsByType({type_slug: 'dotfiles'})
    let urlParts = event.path.split('/');
    const slug = urlParts.pop();
    const queryUser = urlParts.pop();

    console.log('get slug', event, slug);
    try {
      const data = await bucket.searchObjectType({
        type_slug: "dotfiles",
        // slug: slug, // --> not supported
        metafield_key: "ghUser",
        metafield_value: queryUser || user.login
      });

      // todo check map with-out query in path
      const foundObj = data.objects.filter(object => object.slug === slug)[0];
      
      // todo check if visibility is set to public --> restriction if not owner
      // console.log('data', data, user);

      callback(null, {
        headers: {
          "content-type": "application/json"
        },
        statusCode: 200,
        body: JSON.stringify({ dotfiles: foundObj || data.objects})
      });
    } catch (err) {
      console.log("error", err);
      return err;
    }
  }

  if (event.httpMethod === "POST") {
    console.log("post", event.body);
    const api = Cosmic();
    const bucket = api.bucket({
      slug: env.parsed.COSMIC_SLUG,
      read_key: env.parsed.COSMIC_READ_KEY,
      write_key: env.parsed.COSMIC_WRITE_KEY
    });
    const eventBody = JSON.parse(event.body);
    const body = eventBody.body;
    const title = eventBody.title;
    const slug = eventBody.params.slug;

    // edit or new graph
    try {
      let data = {objects: []};

      if (slug) {
        data = await bucket.searchObjectType({
          type_slug: "dotfiles",
          slug: slug,
          metafield_key: "ghuser",
          metafield_value: user.login
        });
      }

      console.log("edit", slug, body, event.body, data.objects.length);

      if (data.objects.length === 0) {
        // add new graph
        const params = {
          title,
          content: "", // add description later
          metafields: createMetaFieldsArray(user.login, body),
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
        // todo check user === eventBody.params.user
        // one object with slug & user available --> would be great if it would be possible to add user to editObject as well
        // slug is unique for all users that's why it is working
        const response = await bucket.editObject({
          slug: slug,
          metafields: createMetaFieldsArray(eventBody.params.user, body)
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
    } catch (err) {
      return err;
    }
  }
}
