<template lang="pug">

form(class="bg-gray-700 p-3 m-2 max-w-sm flex flex-col rounded-lg" @submit="postDB" enctype="multipart/form-data")
    input(v-model="itemName" class="m-2")
    input(v-model="itemPrice" class="m-2")
    input(v-model="itemGroup" class="m-2")
    btn-vue(btnName="Press To Test" btnColor="red")


</template>

<script>
import BtnVue from "./Buttons.vue";
import axios from "axios";

export default {
  name: "itemForm",
  components: {
    BtnVue,
  },
  data: function () {
    return {
      itemName: "",
      itemPrice: 0,
      itemGroup: "",
    };
  },
  methods: {
    postDB: async function () {
      const fd = new FormData();
      fd.set("itemName", this.itemName);
      fd.set("itemPrice", this.itemPrice);
      fd.set("itemGroup", this.itemGroup);
      const res = await axios({
        method: "POST",
        url: "http://localhost:3010/insertProductInfo",
        headers: {
          "Content-Type": "multipart/form-data",
          charset: "utf-8",
        },
        data: fd,
      });
      console.log(res);
    },
  },
};
</script>
