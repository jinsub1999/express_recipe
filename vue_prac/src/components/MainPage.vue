<template>
  <!-- <TestVue /> -->
  <nav-vue />
  <item-list-vue></item-list-vue>
  <item-form-vue></item-form-vue>
  <router-link to="login">
    <btn-vue btn-name="login" btn-color="green"></btn-vue>
  </router-link>
</template>

<script>
// import TestVue from "./TestMyVue";
// import UserVue from "./User";
import ItemListVue from "./ItemList";
import ItemFormVue from "./ItemForm";
import NavVue from "./Navbar";
import BtnVue from "./Buttons";
export default {
  name: "MainPage",
  components: {
    // TestVue,
    // UserVue,
    NavVue,
    BtnVue,
    ItemListVue,
    ItemFormVue,
  },
};
</script>
