var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

const env = require('dotenv').config()

// console.log('env', env, prodEnv)

let envParsed = {}
if (env.parsed) {
    Object.keys(env.parsed).forEach(key => envParsed[key] = `"${env.parsed[key]}"`)
}

// console.log('merged', merge({}, envParsed, {NODE_ENV: '"development"'}))

module.exports = merge({}, envParsed, {NODE_ENV: '"development"'})