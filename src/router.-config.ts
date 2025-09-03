import { createRouter, createWebHistory } from "vue-router";
import PostList from "./views/PostList.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: PostList,
  },
  {
    path: "/post/:id",
    name: "PostDetail",
    component: () => import("./views/PostDetail.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
