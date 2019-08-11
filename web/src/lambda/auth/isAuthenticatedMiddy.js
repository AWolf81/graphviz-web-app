import AuthService from ".";
import createError from "http-errors";

export let auth;
export const isAuthenticated = () => ({
  before: async (handler, next) => {
    auth = new AuthService(handler.event.headers);

    const authenticated = await auth.isAuthenticated().catch(({ error }) => {
      console.log("aut fail", error);
      if (error.code === "ENOTFOUND") {
        console.log("throw", createError.NotFound());
        // throw new createError.NotFound(error.message);
        throw new createError.NotFound(error.message);
      } else {
        // return next(createError.InternalServerError(error.message));
        //throw new createError.InternalServerError(error.message);
        throw new createError.InternalServerError(error.message);
      }
    });

    // we could set user data on event, but I've added it to exported auth variable
    // handler.event.user = auth.user

    // We have the user, trigger next middleware if authenticated
    if (authenticated) {
      return next();
    } else {
      // todo add authRequired check
      //next(createError.Unauthorized());
      throw new createError.Unauthorized();
    }
  }
});
