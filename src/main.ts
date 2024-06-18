import "./lib/validations";

import Vue from "vue";

import App from "./App.vue";
import router from "./router";

import "./assets/index.css";
import GLOBAL_STATE from "@/state";
import { inject } from "@vercel/analytics";

new Vue({
  router,
  store: GLOBAL_STATE,
  render: (h) => h(App),
}).$mount("#app");

// import some helper that is exposed by your current framework to determine the right mode manually

const isProd = import.meta.env.PROD;

inject({
  mode: isProd ? "production" : "development",
  framework: "vue",
});
