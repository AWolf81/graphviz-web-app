var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
var childProcess = require('child_process')

const commitCount = childProcess.execSync('git rev-list HEAD --count').toString()
const versionString = childProcess.execSync('git describe --abbrev=0 --tags')[0].toString()

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  version: '"0.1.1"' // + commitCount + '"' // fix later
})
