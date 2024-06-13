import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";

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
          path: "",
          name: "game-list",
          component: () => import("../views/game/GameView.vue"),
        },
        {
          path: "room",
          redirect: {
            name: "game-list",
            path: "",
          },
        },
        {
          path: "room/:id",
          name: "game-room-detail",
          component: () => import("../views/game/detail/GameDetailView.vue"),
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
