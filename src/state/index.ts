import Vuex from "vuex";
import Vue from "vue";
import GameModule from "@/state/game-module";

Vue.use(Vuex);

const GLOBAL_STATE = new Vuex.Store({
  modules: {
    playingGame: GameModule,
  },
  strict: true,
});

export default GLOBAL_STATE;
