<template>
  <div class="flex">
    <div v-for="item in ListofProduct" :key="item.ItemID" class="flex flex-col flex-shrink-0 m-2 p-1">
      <item-vue :ItemID="item.itemID" :ItemName="item.itemName" :ItemPrice="item.itemPrice"></item-vue>
      <btn-vue btnColor="blue" btnName="Buy"></btn-vue>
    </div>
  </div>
</template>
<script>
import ItemVue from "./Item.vue";
import BtnVue from "./Buttons.vue";
import axios from "axios";

export default {
  name: "ItemList",
  components: {
    ItemVue,
    BtnVue,
  },
  data: function () {
    return {
      ListofProduct: [],
    };
  },
  beforeMount: async function () {
    const dbQuery = await axios.get("http://localhost:3010/recipe");
    this.ListofProduct = dbQuery.data;
  },
};
</script>
