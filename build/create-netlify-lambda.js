var childProcess = require('child_process')

module.exports = function() {
    childProcess.execSync('netlify-lambda build src/lambda')
}