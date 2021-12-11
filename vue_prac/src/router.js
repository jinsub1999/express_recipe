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
  {
    path: "/recipe",
    name: "recipeList",
    component: () => import("@/components/RecipeList"),
  },
  {
    path: "/recipe/form",
    name: "recipeForm",
    component: () => import("@/components/RecipeForm"),
  },
  {
    path: "/products",
    name: "productPage",
    component: () => import("@/components/ProductPage"),
  },
  {
    path: "/productsForm",
    name: "productForm",
    component: () => import("@/components/ProductForm"),
  },
  {
    path: "/products/:productID",
    name: "productItem",
    component: () => import("@/components/ProductItem"),
  },
  {
    path: "/kinds/:kindID",
    name: "kinds",
    component: () => import("@/components/ProductKind"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});
export default router;
