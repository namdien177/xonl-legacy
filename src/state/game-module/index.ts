import type {
  Game,
  GameCreatePayload,
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
import { GameMutations } from "@/state/game-module/mutations";
import router from "@/router";

export type GameCreateState =
  | null
  | {
      message: string;
      data: Game;
      error: undefined;
      isSubmitting: false;
    }
  | {
      message: undefined;
      data: undefined;
      error: string;
      isSubmitting: false;
    }
  | {
      message: undefined;
      data: undefined;
      error: undefined;
      isSubmitting: true;
    };

export type GameModuleState = {
  activeGame: Game | null;
  activeGameLoading: boolean;

  createState: GameCreateState;
};

type GameModuleMutations = {
  // API mutations
  [GameMutations.setIsFetchingGame]: (state: GameModuleState) => void;
  [GameMutations.setFetchingSuccess]: (
    state: GameModuleState,
    game: Game
  ) => void;
  [GameMutations.setFetchingError]: (state: GameModuleState) => void;
  // app mutations
  [GameMutations.setGame]: (state: GameModuleState, game: Game) => void;
  [GameMutations.addSecondPlayer]: (
    state: GameModuleState,
    player: GamePlayer
  ) => void;
  [GameMutations.setPlaying]: (state: GameModuleState) => void;
  [GameMutations.doMove]: (state: GameModuleState, move: GameMove) => void;
  [GameMutations.setGameWinner]: (
    state: GameModuleState,
    props: MakeGameWinner
  ) => void;
};

const GameModule: Module<GameModuleState, GameModuleMutations> = {
  namespaced: true,
  state: (): GameModuleState => ({
    activeGame: null as Game | null,
    activeGameLoading: false,
    createState: null,
  }),
  mutations: {
    [GameMutations.resetCreateState](state) {
      state.createState = null;
    },
    [GameMutations.createGameLoading](state) {
      state.createState = {
        message: undefined,
        data: undefined,
        error: undefined,
        isSubmitting: true,
      };
    },
    [GameMutations.createGameSuccess](
      state,
      response: {
        data: Game;
        message: string;
      }
    ) {
      state.createState = {
        message: response.message,
        data: response.data,
        error: undefined,
        isSubmitting: false,
      };
    },
    [GameMutations.createGameError](state, error: string) {
      state.createState = {
        message: undefined,
        data: undefined,
        error,
        isSubmitting: false,
      };
    },
    [GameMutations.setIsFetchingGame](state) {
      state.activeGameLoading = true;
    },
    [GameMutations.setFetchingSuccess](state, game: Game) {
      console.log(game);
      state.activeGame = game;
      state.activeGameLoading = false;
    },
    [GameMutations.setFetchingError](state) {
      state.activeGame = null;
      state.activeGameLoading = false;
    },
    [GameMutations.setGame](state, game: Game) {
      state.activeGame = game;
    },
    [GameMutations.addSecondPlayer](state, player: GamePlayer) {
      if (!state.activeGame) {
        return;
      }
      // set the joined player as the second player
      Vue.set(state.activeGame.players, 1, player);
    },
    [GameMutations.setPlaying](state) {
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
    [GameMutations.doMove](state, move: GameMove) {
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
    [GameMutations.setGameWinner](
      state,
      { winner_id, winCombination }: MakeGameWinner
    ) {
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
    async [GameActions.createGame](context, payload: GameCreatePayload) {
      context.commit(GameMutations.createGameLoading);
      const game = await new Promise<Game>((resolve) =>
        setTimeout(async () => {
          const result = await GameDB.setGame(payload);
          resolve(result);
        }, 1000)
      );
      if (!game) {
        context.commit(GameMutations.createGameError, "Failed to create game");
        return;
      }
      context.commit(GameMutations.createGameSuccess, {
        data: game,
        message: "Game created successfully",
      });
      void router.push({
        name: "game-room-detail",
        params: { id: game.id },
      });
    },
    async [GameActions.fetchGame](context, gameId: string) {
      context.commit(GameMutations.setIsFetchingGame);
      const gameFromDB = await GameDB.getGame(gameId);
      if (!gameFromDB) {
        context.commit(GameMutations.setFetchingError);
        return;
      }
      context.commit(GameMutations.setFetchingSuccess, gameFromDB.data);
    },
    [GameActions.invitePlayer](context, player: GamePlayer) {
      // TODO: implement the logic to invite the player
      context.commit(GameMutations.addSecondPlayer, player);
    },
    [GameActions.joinGame](context, player: GamePlayer) {
      // TODO: implement the logic to join the game
      context.commit(GameMutations.addSecondPlayer, player);
    },
    [GameActions.startPlaying](context) {
      context.commit(GameMutations.setPlaying);
    },
    [GameActions.playerMove](context, move: GameMove) {
      context.commit(GameMutations.doMove, move);
    },
    [GameActions.gameIsDecided](context, props: MakeGameWinner) {
      context.commit(GameMutations.setGameWinner, props);
    },
    async [GameActions.restartGame](context) {
      const currentGame = context.state.activeGame;
      let payload: GameCreatePayload;
      if (!currentGame) {
        // create new game
        await router.push({ name: "create-game" });
        return;
      } else {
        payload = {
          winMode: currentGame.winMode,
          colMode: currentGame.colMode,
          players: currentGame.players,
          name: currentGame.name,
          status: "waiting",
        };
      }

      await context.dispatch(GameActions.createGame, payload);
    },
  },
};

export default GameModule;
