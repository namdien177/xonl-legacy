import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import { GameDB } from "@/lib/_db/game.db";
import { execQuery } from "@/lib/http/exec-query";

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
            await execQuery({
              queryFn: () => GameDB.getGame(id),
              onResolve(result) {
                console.log(result);
                if (!result || !result.data) {
                  return next({ name: "game-list" });
                }

                return next();
              },
              onReject(error) {
                console.error("Error fetching game", error);
                return next({ name: "game-list" });
              },
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
