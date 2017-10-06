// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack

var webpackConfig = require('../../build/webpack.test.conf')

module.exports = function (config) {
  config.set({
    // to run in additional browsers:
    // 1. install corresponding karma launcher
    //    http://karma-runner.github.io/0.13/config/browsers.html
    // 2. add it to the `browsers` array below.
    // browsers: ['PhantomJS'],
    browsers: ['Chrome'],
    frameworks: ['mocha', 'sinon-chai', 'phantomjs-shim'],
    reporters: ['spec', 'coverage'],
    files: ['./index.js'],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },
    // ** ADD THIS IN ** (vue-cli's webpack template doesn't add it by default)
    plugins: [
      // Launchers
      'karma-chrome-launcher',

      // Test Libraries
      'karma-mocha',
      'karma-sinon-chai',

      // Preprocessors
      'karma-webpack',
      'karma-sourcemap-loader',

      // Reporters
      'karma-spec-reporter',
      'karma-coverage'
    ],
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    },
    // logLevel: 'debug',
    // Concurrency level
    // how many browser should be started simultaneous
    // concurrency: 1,
    //
    // browserNoActivityTimeout: 60000,
    // browserDisconnectTimeout: 30000,
    // captureTimeout: 60000,
  })
}
