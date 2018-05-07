const childProcess = require('child_process')
const path = require('path');

module.exports = function() {
    const srcPath = path.join(__dirname, '../src/lambda')
    childProcess.execSync(`netlify-lambda build ${srcPath}`)
}