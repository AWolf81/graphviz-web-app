import dotfileSvc from "../../services/dotfile.service";
import { auth } from "../auth/isAuthenticatedMiddy";

export async function handler(event, context, callback) {
  console.log("read-all", auth);
  const dotfiles = await dotfileSvc.getAll(auth.user.login);

  return callback(null, {
    statusCode: 200,
    body: { dotfiles }
  });
}
