import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", name: "Home", component: () => import("../pages/Home.vue") },
  { path: "/search", name: "Search", component: () => import("../pages/Search.vue") },
  { path: "/messages", name: "Messages", component: () => import("../pages/Messages.vue") },
  { path: "/likes", name: "Likes", component: () => import("../pages/Likes.vue") },
  { path: "/post", name: "Post", component: () => import("../pages/Post.vue") },
  { path: "/profile", name: "Profile", component: () => import("../pages/Profile.vue") },
  { path: "/login", name: "Login", component: () => import("../pages/Login.vue") },
  { path: "/register", name: "Register", component: () => import("../pages/Register.vue") },
  { path: "/statistics", name: "Statistics", component: () => import("../pages/Statistics.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
