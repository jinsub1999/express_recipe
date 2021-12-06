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
  {
    path: "/signup",
    name: "signupPage",
    component: () => import("@/components/SignupPage"),
  },
  {
    path: "/userinfo",
    name: "userinfo",
    component: () => import("@/components/UserInfo"),
  },
  {
    path: "/modify/:recipeID",
    name: "recipeModify",
    component: () => import("@/components/RecipeModify"),
  },
  {
    path: "/recipe/:recipeID",
    name: "recipeItem",
    component: () => import("@/components/RecipeItem"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});
export default router;
