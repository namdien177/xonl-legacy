<template>
  <div
    class="w-full h-[calc(100vh-3.5rem-1px)] flex flex-col md:flex-row gap-4"
  >
    <div class="flex-1 flex flex-col p-4 gap-4 overflow-auto relative">
      <GameHeader />

      <div class="flex-1 flex flex-col">
        <h1 class="text-xl">Board</h1>
        {{ winningState }}
        <GameBoard
          v-if="activeGame"
          :col-number="activeGame.colMode"
          :game-state="activeGame.boardState"
          @cell-selected="onCellCheck"
        ></GameBoard>
        <p v-if="usersLoading">Loading...</p>
        <ul v-else>
          <li v-for="user in users" :key="user.id">
            {{ user.name }}
          </li>
        </ul>
      </div>
    </div>

    <div
      class="w-full md:w-1/4 md:min-w-[256px] md:max-w-[360px] p-4 flex flex-col gap-4"
    >
      <GameLogs :logs="activeGame?.logs" />

      <GameControl
        v-on:start-game="onStartGame"
        @restart-game="onRestartGame"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { cn, generateWinCombinations, isWinningWithMoves } from "@/lib/utils";
import type {
  Game,
  GameMove,
  GameState,
  MoveCoordinate,
  WinningCombination,
} from "@/lib/types/game-state";
import GameBoard from "@/components/game/GameBoard.vue";
import { execQuery } from "@/lib/http/exec-query";
import ky from "ky";
import { createGamePlaceholder, GAME_MUTATIONS } from "@/state/game.module";
import GameHeader from "@/components/game/GameHeader.vue";
import GameLogs from "@/components/game/GameLogs.vue";
import GameControl from "@/components/game/GameControl.vue";

type User = {
  id: number;
  name: string;
  email: string;
};

export default {
  components: { GameControl, GameLogs, GameHeader, GameBoard },
  methods: {
    cn,
    onCellCheck([rowIndex, cellIndex]: MoveCoordinate): void {
      if (
        !this.activeGame ||
        this.activeGame.status !== "playing" ||
        !this.activeGame.currentTurn
      ) {
        return;
      }
      const currentUser = this.activeGame.currentTurn;
      const gameMove: GameMove = {
        owner_id: currentUser.id,
        coordinate: [rowIndex, cellIndex],
        timestamp: new Date().toISOString(),
      };
      // update the game logs
      this.$store.commit(GAME_MUTATIONS.setMove, gameMove);
    },
    onStartGame() {
      console.log("start game!");
      this.$store.commit(GAME_MUTATIONS.startPlaying);
    },
    onRestartGame() {
      this.$store.commit(GAME_MUTATIONS.restart);
    },
  },
  data() {
    return {
      users: [] as User[],
      usersLoading: false,
    };
  },
  computed: {
    activeGame(): Game | null {
      return this.$store.state.playingGame;
    },
    boardState(): GameState {
      if (!this.$store.state.playingGame) {
        return [];
      }
      return this.$store.state.playingGame.boardState;
    },
    winCombinations(): Array<WinningCombination> {
      if (!this.$store.state.playingGame) {
        return [];
      }
      return generateWinCombinations(this.$store.state.playingGame.colMode);
    },
    winningState() {
      const moves = this.boardState;
      const combinations = this.winCombinations;
      return isWinningWithMoves(moves, combinations);
    },
  },
  watch: {
    winningState(state: ReturnType<typeof isWinningWithMoves>) {
      if (!state) {
        return;
      }
      this.$store.commit(GAME_MUTATIONS.end, state);
    },
  },
  beforeCreate(this) {
    this.$store.commit(GAME_MUTATIONS.create, createGamePlaceholder());
  },
  mounted() {
    execQuery({
      queryFn: () =>
        ky
          .get("https://jsonplaceholder.typicode.com/users")
          .json<Array<User>>(),
      onLoading: (isLoading) => {
        this.usersLoading = isLoading;
      },
      onResolve: (users) => {
        this.users = users;
      },
    });
  },
};
</script>
