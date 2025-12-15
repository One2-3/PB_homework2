import { createRouter, createWebHashHistory } from "vue-router";
import { lsGet } from "@/composables/useLocalStorage";

const routes = [
  { path: "/signin", component: () => import("@/pages/SigninPage.vue") },
  { path: "/", component: () => import("@/pages/HomePage.vue"), meta: { auth: true } },
  { path: "/popular", component: () => import("@/pages/PopularPage.vue"), meta: { auth: true } },
  { path: "/search", component: () => import("@/pages/SearchPage.vue"), meta: { auth: true } },
  { path: "/wishlist", component: () => import("@/pages/WishlistPage.vue"), meta: { auth: true } },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = lsGet("auth", { isLoggedIn: false });
  if (to.meta.auth && !auth.isLoggedIn) return "/signin";
});
