import createError from "http-errors";
import dotfileSvc from "../../services/dotfile.service";
import {auth} from "../auth/isAuthenticatedMiddy";

export async function handler(
  event,
  context,
  callback
) {
  // console.log(queryStringParameters, getPathValues(path));
  console.log("auth", event)
  const queryKeys = getPathValues(event.path);
  // if (Object.keys(queryKeys).every(key => !queryKeys[key])) {
  //   throw new createError.NotFound(
  //     `Dotfile not found - you need to pass a slug & username to read command.`
  //   );
  // }

  const dotfiles = await dotfileSvc.get(queryKeys, auth.user.login);

  return callback(null, {
    statusCode: 200,
    body: {
      dotfiles
    }
  });
  // return callback(null, {
  //   headers: {
  //     "content-type": "application/json"
  //   },
  //   statusCode: 200,
  //   body: JSON.stringify(dotfiles)
  // });
}
