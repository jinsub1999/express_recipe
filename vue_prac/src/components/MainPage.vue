<template>
  <div class="mywrapper">
    <nav-vue />
    <!-- <item-list-vue></item-list-vue> -->
    <!-- <item-form-vue></item-form-vue> -->
    <recipe-list-vue></recipe-list-vue>
    <recipe-vue></recipe-vue>
  </div>
</template>

<script>
// import TestVue from "./TestMyVue";
// import UserVue from "./User";
// import ItemListVue from "./ItemList";
// import ItemFormVue from "./ItemForm";
import NavVue from "./Navbar";
import RecipeVue from "./RecipeForm.vue";
import RecipeListVue from "./RecipeList.vue";
import "../assets/myComponents.css";
// import BtnVue from "./Buttons";
export default {
  name: "MainPage",
  components: {
    // TestVue,
    // UserVue,
    NavVue,
    RecipeVue,
    RecipeListVue,
    // BtnVue,
    // ItemListVue,
    // ItemFormVue,
  },
};
</script>
