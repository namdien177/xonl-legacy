import Vuex from "vuex";
import Vue from "vue";
import GameModule from "@/state/game-module";

Vue.use(Vuex);

export const STATE_MODULE = {
  GAME: "playingGame",
} as const;

const GLOBAL_STATE = new Vuex.Store({
  modules: {
    [STATE_MODULE.GAME]: GameModule,
  },
  strict: true,
});

export default GLOBAL_STATE;
