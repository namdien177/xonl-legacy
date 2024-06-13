import Vuex from "vuex";
import {
  GAME_MUTATIONS,
  type MakeWinnerProps,
  updateMove,
} from "@/state/game.mutation";
import type { Game, GameMove } from "@/lib/types/game-state";
import Vue from "vue";

Vue.use(Vuex);

const GLOBAL_STATE = new Vuex.Store({
  state: {
    playingGame: null as Game | null,
  },
  mutations: {
    [GAME_MUTATIONS.create](state, game: Game) {
      state.playingGame = {
        ...game,
        status: "waiting",
      };
    },
    [GAME_MUTATIONS.startPlaying](state) {
      if (!state.playingGame) {
        return;
      }
      if (state.playingGame.players.length !== 2) {
        return;
      }

      Vue.set(state.playingGame, "status", "playing");
      // Set the first player as the current turn
      Vue.set(state.playingGame, "currentTurn", state.playingGame.players[0]);
    },
    [GAME_MUTATIONS.setMove](state, { owner_id, coordinate }: GameMove) {
      if (!state.playingGame) {
        return;
      }
      const updateStates = updateMove(
        { owner_id, coordinate },
        state.playingGame
      );
      console.log(updateStates);

      if (!updateStates) {
        return;
      }

      for (const key in updateStates) {
        const value = updateStates[key as keyof Game];
        Vue.set(state.playingGame, key, value);
      }
    },
    [GAME_MUTATIONS.end](
      state,
      { winner_id, winCombination }: MakeWinnerProps
    ) {
      if (!state.playingGame) {
        return;
      }
      const player = state.playingGame.players.find(
        (player) => player.id === winner_id
      );
      if (!player) {
        return;
      }
      Vue.set(state.playingGame, "status", "finished");
      Vue.set(state.playingGame, "winner", player);
      Vue.set(state.playingGame, "winCombination", winCombination);
    },
  },
});

export default GLOBAL_STATE;
