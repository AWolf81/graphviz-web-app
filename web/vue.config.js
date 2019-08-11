const env = require("dotenv").config();
const packageJson = require("./package.json");

// only expose uncritical env here as it's accessbile in browser
// !!!no API keys!!!
process.env = {
  VUE_APP_VERSION: packageJson.version,
  VUE_APP_NETLIFY_SITE_ID: env.parsed["NETLIFY_SITE_ID"]
};

module.exports = {
  chainWebpack: config => {
    config.module
      .rule("md")
      .test(/\.md/)
      .use("vue-loader")
      .loader("vue-loader")
      .end()
      .use("vue-markdown-loader")
      .loader("vue-markdown-loader/lib/markdown-compiler")
      .options({
        raw: true
      });

    config.module
      .rule("txt")
      .test(/\.txt/)
      .use("raw-loader")
      .loader("raw-loader")
      .end();
  },
  devServer: {
    proxy: {
      "/.netlify": {
        target: "http://localhost:9000",
        changeOrigin: true,
        pathRewrite: { "^/.netlify/functions": "" }
      }
    }
  },
  runtimeCompiler: true,
  lintOnSave: process.env.NODE_ENV !== "production",
  pwa: {
    name: "DrawViz"
  }
};