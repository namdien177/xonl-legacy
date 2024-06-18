<template>
  <ValidationObserver
    class="container mx-auto p-8 flex flex-col"
    v-slot="{ handleSubmit, invalid }"
  >
    <form
      class="w-full md:max-w-96 flex flex-col border p-8 gap-4 rounded-lg"
      @submit.prevent="handleSubmit(onSubmit)"
    >
      <h1 class="text-xl">Room information</h1>
      <hr />

      <ValidationProvider
        rules="required|min:3"
        v-slot="v"
        class="flex flex-col gap-1"
      >
        <label for="name">Room name</label>
        <input
          type="text"
          v-model="name"
          :class="
            cn(inputVariants(), {
              'border-red-500': v.errors.length,
            })
          "
          id="name"
          placeholder="Room name"
        />
        <span class="text-xs text-red-500">{{ v.errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider
        rules="required|min:3"
        v-slot="v"
        class="flex flex-col gap-1"
      >
        <label for="playerOne">Room owner</label>
        <input
          type="text"
          v-model="playerOne"
          :class="
            cn(inputVariants(), {
              'border-red-500': v.errors.length,
            })
          "
          id="playerOne"
          name="playerOne"
          placeholder="Room owner"
        />
        <span class="text-xs text-red-500">{{ v.errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider
        rules="min:3|different_from:@playerOne"
        v-slot="v"
        class="flex flex-col gap-1"
        v-if="hasSecondPlayer"
      >
        <label for="playerTwo">Second player</label>
        <input
          type="text"
          v-model="playerTwo"
          :class="
            cn(inputVariants(), {
              'border-red-500': v.errors.length,
            })
          "
          id="playerTwo"
          name="playerTwo"
          placeholder="Second player"
        />
        <span class="text-xs text-red-500">{{ v.errors[0] }}</span>
      </ValidationProvider>

      <button
        type="button"
        :class="buttonVariants({ variant: 'outline' })"
        @click="toggleSecondPlayer(!hasSecondPlayer)"
      >
        {{ hasSecondPlayer ? "Remove" : "Add" }} second player
      </button>

      <button
        :class="buttonVariants({ variant: 'default' })"
        type="submit"
        :disabled="invalid || isCreatingGame"
      >
        <span class="flex items-center gap-2" v-if="isCreatingGame">
          <Icon icon="line-md:loading-loop" />
          <span>Creating...</span>
        </span>
        <span v-else>Create room</span>
      </button>

      <span class="text-red-500">{{ isCreateError }}</span>
    </form>
  </ValidationObserver>
</template>

<script lang="ts">
import { inputVariants } from "@/components/ui/input";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type {
  Game,
  GameCreatePayload,
  GamePlayer,
} from "@/lib/types/game-state";
import { defineComponent } from "vue";
import { Icon } from "@iconify/vue2";
import { STATE_MODULE } from "@/state";
import type { GameCreateState } from "@/state/game-module";
import { GameActions } from "@/state/game-module/actions";

export default defineComponent({
  components: { ValidationProvider, ValidationObserver, Icon },
  data() {
    return {
      hasSecondPlayer: false,
      // form data
      name: "",
      playerOne: "",
      playerTwo: "",
      colMode: 3,
      winMode: "until-win" as Game["winMode"],
    };
  },
  methods: {
    buttonVariants,
    cn,
    inputVariants,
    toggleSecondPlayer(value: boolean) {
      this.hasSecondPlayer = value;
    },
    async onSubmit() {
      let playerOne: GamePlayer | null = null;
      let playerTwo: GamePlayer | null = null;
      if (!this.playerOneId || !this.playerOne) {
        return;
      }
      playerOne = {
        id: this.playerOneId,
        name: this.playerOne,
      };

      if (this.playerTwoId && this.playerTwo) {
        playerTwo = {
          id: this.playerTwoId,
          name: this.playerTwo,
        };
      }
      const formData: GameCreatePayload = {
        name: this.name,
        players: [playerOne, playerTwo].filter(Boolean) as [
          GamePlayer,
          GamePlayer | null
        ],
        colMode: this.colMode,
        status: "waiting",
        winMode: this.winMode,
      };
      await this.$store.dispatch(
        `${STATE_MODULE.GAME}/${GameActions.createGame}`,
        formData
      );
    },
  },
  computed: {
    creationState(): GameCreateState {
      return this.$store.state[STATE_MODULE.GAME].createState;
    },
    isCreatingGame(): boolean {
      return !!this.creationState?.isSubmitting;
    },
    isCreateError(): string | null {
      return this.creationState?.error ?? null;
    },
    playerOneId() {
      const playerOne = this.playerOne;
      if (!playerOne) {
        return null;
      }
      // return a user id from the owner name, with a random number(4) behind
      return `${playerOne}-${Math.floor(Math.random() * 10000)}`;
    },
    playerTwoId() {
      const playerTwo = this.playerTwo;
      if (!playerTwo) {
        return null;
      }
      // return a user id from the owner name, with a random number(4) behind
      return `${playerTwo}-${Math.floor(Math.random() * 10000)}`;
    },
  },
  watch: {
    inputValue(value: string) {
      console.log(value);
    },
  },
});
</script>
