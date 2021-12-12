<template>
  <div class="mywrapper">
    <nav-vue />
    <div class="m-3 p-2 flex items-center justify-center text-green-500 bg-gray-200 rounded text-3xl">환영합니다!</div>
    <div class="flex">
      <router-link
        to="/recipe"
        class="bg-blue-300 hover:bg-blue-400 p-3 m-1 w-32 h-20 rounded flex items-center justify-center text-lg"
        >레시피 조회</router-link
      >
      <router-link
        to="/products"
        class="bg-blue-300 hover:bg-blue-400 p-3 m-1 w-32 h-20 rounded flex items-center justify-center text-lg"
        >제품 조회</router-link
      >
    </div>
  </div>
</template>

<script>
import NavVue from "./Navbar";
import "../assets/myComponents.css";
export default {
  name: "MainPage",
  components: {
    NavVue,
  },
};
</script>
