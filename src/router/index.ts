import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import { GameDB } from "@/lib/_db/game.db";
import { GameActions } from "@/state/game-module/actions";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/game",
      name: "game",
      component: () => import("../views/game/GameRouteContainer.vue"),
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      children: [
        {
          path: "/",
          name: "game-list",
          component: () => import("../views/game/GameView.vue"),
        },
        {
          path: "room",
          redirect: {
            name: "game-list",
          },
        },
        {
          path: "room/:id",
          name: "game-room-detail",
          component: () => import("../views/game/detail/GameDetailView.vue"),
          beforeEnter: async (to, from, next) => {
            const { id } = to.params;

            // fetch game data
            const game = await GameDB.getGame(id);
            if (!game || !game.data) {
              next({ name: "game-list" });
              return;
            }
            return next((vm) => {
              vm.$store.dispatch(
                `playingGame/${GameActions.create}`,
                game.data
              );
            });
          },
        },
        {
          path: "create",
          name: "create-game",
          component: () => import("../views/game/create/GameCreateView.vue"),
        },
      ],
    },
  ],
});

export default router;
