import { createWebHistory, createRouter } from "vue-router";
const routes = [
  {
    path: "/",
    name: "mainPage",
    component: () => import("@/components/MainPage"),
  },
  {
    path: "/login",
    name: "loginPage",
    component: () => import("@/components/LoginPage"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});
export default router;
