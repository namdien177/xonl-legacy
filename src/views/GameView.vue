<template>
  <div class="w-full h-[calc(100vh-3.5rem-1px)] flex gap-4">
    <div class="flex-1 flex flex-col p-4 gap-4 overflow-auto relative">
      <div class="flex flex-col sticky top-0 bg-background inset-x-0 pb-4">
        <div
          :class="
            cn('flex w-full rounded-lg p-4', {
              'from-red-600 bg-gradient-to-r to-blue-600':
                !activeGame?.winner?.id,
              'bg-red-600': activeGame?.winner?.id === 'red',
              'bg-blue-600': activeGame?.winner?.id === 'blue',
            })
          "
        >
          <div
            v-if="!winningState?.winner_id || winningState?.winner_id === 'red'"
            :class="
              cn(
                'flex-1 relative flex items-center text-white font-bold',
                winningState?.winner_id === 'red'
                  ? 'justify-center'
                  : 'justify-start'
              )
            "
          >
            RED {{ winningState?.winner_id === "red" ? "WON" : "" }}
          </div>
          <div
            v-if="
              !winningState?.winner_id || winningState?.winner_id === 'blue'
            "
            :class="
              cn(
                'flex-1 relative flex items-center text-white font-bold',
                winningState?.winner_id === 'blue'
                  ? 'justify-center'
                  : 'justify-end'
              )
            "
          >
            BLUE {{ winningState?.winner_id === "blue" ? "WON" : "" }}
          </div>
        </div>
      </div>

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

    <div class="w-1/4 min-w-[256px] max-w-[360px] bg-gray-300">Game Info</div>
  </div>
</template>

<script lang="ts">
import { cn, generateWinCombinations, isWinningWithMoves } from "@/lib/utils";
import type {
  Game,
  GameMove,
  GamePlayer,
  GameState,
  MoveCoordinate,
  WinningCombination,
} from "@/lib/types/game-state";
import GameBoard from "@/components/game/GameBoard.vue";
import { execQuery } from "@/lib/http/exec-query";
import ky from "ky";
import { GAME_MUTATIONS } from "@/state/game.mutation";

type User = {
  id: number;
  name: string;
  email: string;
};

export default {
  components: { GameBoard },
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
      };
      console.log(gameMove);
      // update the game logs
      this.$store.commit(GAME_MUTATIONS.setMove, gameMove);
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
    const users: [GamePlayer, GamePlayer] = [
      { id: "red", name: "Red Player" },
      { id: "blue", name: "Blue Player" },
    ];
    const game: Game = {
      name: "new game!",
      colMode: 3,
      moves: [],
      logs: [],
      winMode: "until-win",
      status: "waiting",
      players: users,
      boardState: [],
    };
    this.$store.commit(GAME_MUTATIONS.create, game);
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

    this.$store.commit(GAME_MUTATIONS.startPlaying);
  },
};
</script>
