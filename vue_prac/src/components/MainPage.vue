<template>
  <div class="mywrapper">
    <nav-vue />
    <div class="flex flex-row justify-center p-2">
      <recipe-list-vue></recipe-list-vue>
      <recipe-form-vue></recipe-form-vue>
    </div>
  </div>
</template>

<script>
import NavVue from "./Navbar";
import RecipeFormVue from "./RecipeForm.vue";
import RecipeListVue from "./RecipeList.vue";
import "../assets/myComponents.css";
export default {
  name: "MainPage",
  components: {
    NavVue,
    RecipeFormVue,
    RecipeListVue,
  },
};
</script>
