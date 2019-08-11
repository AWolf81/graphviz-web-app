import createError from "http-errors";
import { applyMiddleware } from "./utils";

const subdirHandler = async (event, context, callback) => {
  // Get the command from path (skip first as it is an empty string)
  const [, dirName, commandStr] = event.path.split("/");

  console.log("subdir", event.path.split("/"));
  // console.log("user", context);
  // Load the script
  try {
    const command = require(`./${dirName}/${commandStr}`);
    console.log("command", command.handler);
    return command.handler(event, context, callback);
  } catch (e) {
    throw createError.NotFound();
  }
};

export const handler = applyMiddleware(subdirHandler);
