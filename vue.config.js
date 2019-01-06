process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = {
  runtimeCompiler: true,
  lintOnSave: process.env.NODE_ENV !== "production",
  pwa: {
    name: "DrawViz"
  }
};
