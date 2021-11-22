<template>
  <!-- <TestVue /> -->
  <item-list-vue></item-list-vue>
  <UserVue gender="Male" username="HJS" />
  <UserVue gender="Female" username="KTH" />
  <item-form-vue></item-form-vue>
</template>

<script>
// import TestVue from "./components/TestMyVue.vue";
import UserVue from "./components/User.vue";
import ItemListVue from "./components/ItemList.vue";
import ItemFormVue from "./components/ItemForm.vue";
export default {
  name: "App",
  components: {
    // TestVue,
    UserVue,
    ItemListVue,
    ItemFormVue,
  },
  data: function () {
    return {
      Male: "M",
      Name: "HJS",
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
