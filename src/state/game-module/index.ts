import type {
  Game,
  GameMove,
  GamePlayer,
  MakeGameWinner,
} from "@/lib/types/game-state";
import Vue from "vue";
import type { Module } from "vuex";
import { updateMove } from "@/state/game-module/move.strategy";
import { GameActions } from "@/state/game-module/actions";
import { createGamePlaceholder } from "@/state/game-module/factory";
import { GameDB } from "@/lib/_db/game.db";

type GameModuleState = {
  activeGame: Game | null;
  activeGameLoading: boolean;
};

type GameModuleMutations = {
  setGame: (state: GameModuleState, game: Game) => void;
  setPlayer: (state: GameModuleState, player: GamePlayer) => void;
  setPlaying: (state: GameModuleState) => void;
  setMove: (state: GameModuleState, move: GameMove) => void;
  setEnd: (state: GameModuleState, props: MakeGameWinner) => void;
};

const GameModule: Module<GameModuleState, GameModuleMutations> = {
  state: () => ({
    activeGame: null as Game | null,
    activeGameLoading: false,
  }),
  mutations: {
    isFetchingGame(state) {
      state.activeGameLoading = true;
    },
    fetchGameSuccess(state, game: Game) {
      state.activeGame = game;
      state.activeGameLoading = false;
    },
    fetchGameError(state) {
      state.activeGame = null;
      state.activeGameLoading = false;
    },
    setGame(state, game: Game) {
      state.activeGame = {
        ...game,
        status: "waiting",
      };
    },
    setPlayer(state, player: GamePlayer) {
      if (!state.activeGame) {
        return;
      }
      // set the joined player as the second player
      Vue.set(state.activeGame.players, 1, player);
    },
    setPlaying(state) {
      if (!state.activeGame) {
        return;
      }
      // the game must have 2 players to start
      if (state.activeGame.players.length < 2) {
        return;
      }

      Vue.set(state.activeGame, "status", "playing");
      // Set the first player as the current turn
      Vue.set(state.activeGame, "currentTurn", state.activeGame.players[0]);
    },
    setMove(state, move: GameMove) {
      if (!state.activeGame) {
        return;
      }
      const updateStates = updateMove(move, state.activeGame);
      if (!updateStates) {
        return;
      }

      for (const key in updateStates) {
        const value = updateStates[key as keyof Game];
        Vue.set(state.activeGame, key, value);
      }
    },
    setEnd(state, { winner_id, winCombination }: MakeGameWinner) {
      if (!state.activeGame) {
        return;
      }
      const player = state.activeGame.players.find(
        (player) => player?.id === winner_id
      );
      if (!player) {
        return;
      }
      Vue.set(state.activeGame, "status", "finished");
      Vue.set(state.activeGame, "winner", player);
      Vue.set(state.activeGame, "winCombination", winCombination);
    },
  },
  actions: {
    async [GameActions.fetchGame](context, gameId: string) {
      context.commit("isFetchingGame");
      const gameFromDB = await GameDB.getGame(gameId);
      if (!gameFromDB) {
        context.commit("fetchGameError");
        return;
      }
      context.commit("fetchGameSuccess", gameFromDB);
    },
    [GameActions.create](context, game: Game) {
      context.commit("setGame", game);
    },
    [GameActions.invitePlayer](context, player: GamePlayer) {
      // TODO: implement the logic to invite the player
      context.commit("setPlayer", player);
    },
    [GameActions.joinGame](context, player: GamePlayer) {
      // TODO: implement the logic to join the game
      context.commit("setPlayer", player);
    },
    [GameActions.startPlaying](context) {
      context.commit("setPlaying");
    },
    [GameActions.firstPlayerMove](context, move: GameMove) {
      context.commit("setMove", move);
    },
    [GameActions.secondPlayerMove](context, move: GameMove) {
      context.commit("setMove", move);
    },
    [GameActions.gameIsDecided](context, props: MakeGameWinner) {
      context.commit("setEnd", props);
    },
    [GameActions.restartGame](context) {
      const currentGame = context.state.activeGame;
      if (!currentGame) {
        // create new game
        const newGame = createGamePlaceholder();
        context.commit("setGame", newGame);
        return;
      }

      // clone the current game
      const newGame = { ...currentGame };
      // reset the board state
      newGame.boardState = [];
      // reset the moves
      newGame.moves = [];
      // reset the logs
      newGame.logs = [];
      // reset the winner
      newGame.winner = undefined;
      newGame.winCombination = undefined;
      // reset the current turn
      newGame.currentTurn = undefined;

      context.commit("setGame", newGame);
    },
  },
};

export default GameModule;
