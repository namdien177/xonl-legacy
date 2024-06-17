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
  MakeGameWinner,
  MoveCoordinate,
  WinningCombination,
} from "@/lib/types/game-state";
import GameBoard from "@/views/game/detail/_components/GameBoard.vue";
import GameHeader from "@/views/game/detail/_components/GameHeader.vue";
import GameLogs from "@/views/game/detail/_components/GameLogs.vue";
import GameControl from "@/views/game/detail/_components/GameControl.vue";
import { GameActions } from "@/state/game-module/actions";

export default {
  components: { GameControl, GameLogs, GameHeader, GameBoard },
  methods: {
    cn,
    onCellCheck([rowIndex, cellIndex]: MoveCoordinate): void {
      const activeGame = this.activeGame;
      if (
        !activeGame ||
        activeGame.status !== "playing" ||
        !activeGame.currentTurn
      ) {
        return;
      }
      const currentUser = activeGame.currentTurn;
      const gameMove: GameMove = {
        owner_id: currentUser.id,
        coordinate: [rowIndex, cellIndex],
        timestamp: new Date().toISOString(),
      };
      const isFirstPlayer =
        activeGame.players.findIndex(
          (player) => player.id === currentUser.id
        ) === 0;
      if (isFirstPlayer) {
        // update the game logs
        this.$store.dispatch(GameActions.firstPlayerMove, gameMove);
        return;
      }
      // update the game logs
      this.$store.dispatch(GameActions.secondPlayerMove, gameMove);
    },
    onStartGame() {
      console.log("start game!");
      this.$store.dispatch(GameActions.startPlaying);
    },
    onRestartGame() {
      console.log("restart game!");
      this.$store.dispatch(GameActions.restartGame);
    },
    fetchGame(roomId: string) {
      this.$store.dispatch(GameActions.fetchGame, roomId);
    },
  },
  computed: {
    activeGame(): Game | null {
      return this.$store.state.playingGame.activeGame ?? null;
    },
    boardState(): GameState {
      return this.activeGame?.boardState ?? [];
    },
    winCombinations(): Array<WinningCombination> {
      if (!this.activeGame) {
        return [];
      }
      return generateWinCombinations(this.activeGame.colMode);
    },
    winningState(): MakeGameWinner | null {
      const moves = this.boardState;
      const combinations = this.winCombinations;
      return isWinningWithMoves(moves, combinations);
    },
  },
  watch: {
    winningState(state: ReturnType<typeof isWinningWithMoves>): void {
      if (!state) {
        return;
      }
      console.log("winning state", state);
      this.$store.dispatch(GameActions.gameIsDecided, state);
    },
  },
};
</script>
