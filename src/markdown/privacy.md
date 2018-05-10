Privacy notice
==========================

This privacy notice will describe how the web app hosted at **www.drawviz.com** will handle your data. Here we're using the word **graph** which means the entered dot text data and not the rendered graph.

## Identity of the controllers
- [AWolf81](https://www.github.com/awolf81) is maintaining this app and responsible to ensure your data privacy.
- [Cosmic JS](https://cosmicjs.com) for data storage
- [Google Analytics](https://analytics.google.com) for user tracking (can be disabled)

## Stored data
There are two options to store your data:
- Cloud stored at [Cosmic JS](https://cosmicjs.com). Your Github login name is stored with your graph - so it's possible to show your graphs in the dashboard. The graph is stored encrypted (see section security for details)
- Locally in brower's local storage (also with-out login possible). Only you and any user that has access to your operating system user account can view your stored graphs. Be careful if you're at a public accessible machine (e.g. internet cafe).

## Data storage period
Your stored graphs will be stored with-out expiry date as long as the web app is online. If this service will be stopped in the future all users will get the option to download their complete data with a notification e-mail about the termination (two weeks before going offline).

You can always download your stored data from your dashboard.

## Visibility
- Saved locally: Anyone with access to your OS account will have full access.
- Saved in cloud: 
  - By default your graphs are private and only you (the creator/owner) can view, edit or delete the graph. 
  - By clicking on share and changing visibility settings it can be made available to other users. This setting can be changed later in your dashboard.
  - During share you can select permissions:
    - Public & read-only: Only reading allowed --> editing will automatically create a new graph.
    - <del>Public & read+write: Editing allowed (deleting not possible)</del> (future feature)
    - <del>Specific users: Read & write can be assigned to individual users.</del> (future feature)

## Security
### Data encryption
Your entered dot text will be AES encrypted with a 256-bit AES key. It uses [Crypto-js](https://github.com/brix/crypto-js) for encryption. So if the database would be compromised the data would be not readable by the attacker because of the encryption.
The encryption/decryption is handled by an AWS Lambda function so the secrect key will never be visible to the client side.

### Data transfer
Every request is performed with a secure https connection. Encryption details TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, 128-bin key, TLS.

## Glossar
- full-access: Read & write access.
- dot: Text that will be rendered with Graphviz and follows the dot syntax.