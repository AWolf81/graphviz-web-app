export const errorHandler = (callback, statusCode, error) => {
  error = error || new Error("Internal error");
  statusCode = statusCode || 500;
  callback(null, {
    headers: {
      "content-type": "application/json"
    },
    statusCode,
    body: JSON.stringify({
      errors: [
        {
          status: statusCode,
          detail: error.message,
          ...(process.env.NODE_ENV === "development" && { source: error.stack })
        }
      ]
    })
  });
};

export const successHandler = (callback, body) => {
  callback(null, {
    headers: {
      "content-type": "application/json"
    },
    statusCode: 200,
    body: JSON.stringify(body)
  });
};
