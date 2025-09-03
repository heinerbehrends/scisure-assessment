import { createRouter, createWebHistory } from "vue-router";
import PostList from "./views/PostList/PostList.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: PostList,
  },
  {
    path: "/post/:id",
    name: "PostDetail",
    component: () => import("./views/PostDetail/PostDetail.vue"),
  },
  {
    path: "/post/create",
    name: "PostCreate",
    component: () => import("./views/PostList/PostCreate.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
