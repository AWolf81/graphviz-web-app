const childProcess = require('child_process')
const path = require('path');

module.exports = function() {
    const srcPath = '../src/lambda'
    childProcess.execSync(`ls -lah ${srcPath}`) // just to see the directory
    childProcess.execSync(`netlify-lambda build ${srcPath}`)
}