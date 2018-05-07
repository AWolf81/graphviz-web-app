export function handler(event, context, callback) {
    console.log(event)
    callback(null, {
      headers: {
        'content-type': 'application/json'
      },
      statusCode: 200,
      body: JSON.stringify({msg: "Hello, World!"})
    })
  }
  