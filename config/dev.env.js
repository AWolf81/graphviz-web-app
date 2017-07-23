var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
var childProcess = require('child_process')

const versionString = childProcess.execSync('git rev-list HEAD --count').toString()

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  version: `"${versionString}"`
})
