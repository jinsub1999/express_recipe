<template>
  <div class="flex">
    <div v-for="item in fiveRecipe" :key="item.id" class="flex flex-col flex-shrink-0 m-2 p-1">
      <div class="bg-blue-400 text-green-700 text-center p-2">{{ item.name }}</div>
      <div class="p-3 bg-gray-400">{{ item.recipe }}</div>
      <div class="p-3 bg-gray-400">{{ item.author }}</div>
      <div class="p-3 bg-gray-400">{{ item.uploadDate }}</div>
      <div v-if="item.modifyDate" class="p-3 bg-gray-400">qweqwe</div>
      <btn-vue btnColor="blue" btnName="Buy"></btn-vue>
      <btn-vue btnColor="blue" btnName="Modify"></btn-vue>
    </div>
  </div>
</template>
<script>
// import ItemVue from "./Item.vue";
import BtnVue from "./Buttons.vue";
import axios from "axios";

export default {
  name: "ItemList",
  components: {
    // ItemVue,
    BtnVue,
  },
  data: function () {
    return {
      ListofRecipe: [],
    };
  },
  beforeMount: async function () {
    const dbQuery = await axios.get("http://localhost:3010/getRecipe");
    this.ListofRecipe = dbQuery.data;
  },
  computed: {
    fiveRecipe() {
      return this.ListofRecipe.slice(0, 5);
    },
  },
};
</script>
