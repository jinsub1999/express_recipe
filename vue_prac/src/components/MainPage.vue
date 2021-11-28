<template>
  <TestVue />
  <item-list-vue></item-list-vue>
  <item-form-vue></item-form-vue>

  <router-link to="login">
    <btn-vue btn-name="login" btn-color="green"></btn-vue>
  </router-link>
</template>

<script>
import TestVue from "./TestMyVue";
// import UserVue from "./User";
import ItemListVue from "./ItemList";
import ItemFormVue from "./ItemForm";
import BtnVue from "./Buttons";
export default {
  name: "MainPage",
  components: {
    TestVue,
    // UserVue,
    BtnVue,
    ItemListVue,
    ItemFormVue,
  },
  data: function () {},
};
</script>
