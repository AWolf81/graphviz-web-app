import pathToRegex from "path-to-regexp";
// const middyExtractor = require("middy-extractor");
import jsonapi from "middy-jsonapi";
import middy from "middy";
import httpResponseSerializer from "@sharecover-co/middy-http-response-serializer";
import httpErrorHandler from "@middy/http-error-handler";
import { isAuthenticated } from "../auth/isAuthenticatedMiddy";
// const { deserialise } = require('kitsu-core/node')
const {
  doNotWaitForEmptyEventLoop,
  urlEncodeBodyParser,
  jsonBodyParser,
  cors,
  httpEventNormalizer,
  httpContentNegotiation,
  httpHeaderNormalizer,
  httpSecurityHeaders,
  validator
} = require("middy/middlewares");

const ajvOptions = {
  v5: true,
  format: "full",
  coerceTypes: "array",
  allErrors: true,
  useDefaults: true,
  $data: true
};

const meta = require("../../../package.json");
const response = {
  jsonapi: { version: "1.0" },
  meta: {
    version: `v${meta.version}`,
    copyright: meta.copyright,
    authors: meta.authors,
    now: new Date().toISOString()
  }
};

export function getPathValues(path) {
  let queryUser, slug;
  const re = pathToRegex("/dotfiles/read/:user/:dot"); // <<<<<<<<< todo make it more reusable
  const tokens = re.exec(path);

  if (tokens) {
    // user & slug in url
    queryUser = tokens[1];
    slug = tokens[2];
  }

  return {
    queryUser,
    slug
  };
}

// const jsonapiDeserialise = body => {
//   deserialise(body)
//   return body
// }
const errorMiddleware = () => ({
  onError: (handler, next) => {
    const { error } = handler;
    console.log("error handler", error.statusCode);
    if (error) {
      return handler.callback(null, {
        statusCode: error.statusCode,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          errors: [
            {
              id: Date.now(),
              status: error.statusCode.toString(),
              details: error.message
            }
          ]
        }),
        json: true
      });
    }

    next();
  }
});

// const catchAllMiddleware = () => {
//   before: (handler, next) => {};
// };

export function applyMiddleware(handler) {
  return (
    middy(handler)
      .use(doNotWaitForEmptyEventLoop())
      .use(httpEventNormalizer())
      .use(httpHeaderNormalizer())
      .use(urlEncodeBodyParser()) // needed for form submission
      .use(jsonBodyParser()) // parses body so it is an object in event.body
      .use(cors())
      .use(
        httpContentNegotiation({
          availableLanguages: ["en-US"], // , "de-de"],
          availableMediaTypes: ["application/vnd.api+json"]
        })
      )
      //.use(httpErrorHandler())
      // .use(httpSecurityHeaders())
      .use(
        jsonapi({
          response,
          logger: (id, err) => {
            console.log("error handled", id, err);
          }
        })
      ) // Replaces: httpErrorHandler
      //.use(errorMiddleware())
      .use(isAuthenticated())
    // .use(validator({ ajvOptions }))
  );

  //.use(authorization())
}
