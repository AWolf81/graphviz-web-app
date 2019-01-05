// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import VueLs from "vue-ls";
import store from "./store";
import "./ie-fix.js";

// load spinner css
require("../node_modules/spinkit/css/spinners/8-circle.css");
require("./assets/main.css"); // load styling before Vue bootstrapped

Vue.config.productionTip = false;

Vue.use(VueLs);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  store,
  router,
  template: "<App/>",
  components: { App }
});
