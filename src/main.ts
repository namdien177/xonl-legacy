import Vue from "vue";
import Vuex from "vuex";

import App from "./App.vue";
import router from "./router";

import "./assets/index.css";
import GLOBAL_STATE from "@/state";

new Vue({
  router,
  store: GLOBAL_STATE,
  render: (h) => h(App),
}).$mount("#app");
