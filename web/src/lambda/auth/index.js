import request from "request-promise";
import { errorHandler } from "../utils/defaultHandlers";
import createError from "http-errors";

export default class AuthService {
  user;
  _headers;

  constructor(headers) {
    this._headers = headers;
  }

  getUser(token) {
    return request("https://api.github.com/user", {
      headers: {
        "user-agent": "awolf81-drawviz-app",
        authorization: token
      },
      json: true
    }); // get auth user,
  }

  // todo: Check if we need to store token in auth object
  async isAuthenticated() {
    if (!this._headers) {
      return false
    }
    
    const { Authorization: token } = this._headers;
    console.log("check auth", this._headers, token);
    if (token) {
      this.user = await this.getUser(token);

      return true;
    }
    return false;
  }
}
