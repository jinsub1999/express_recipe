<template lang="pug">

form(class="bg-indigo-200 rounded p-3 m-2 max-w-sm flex flex-col" @submit="postDB" enctype="multipart/form-data")
    div.mb-4
      label(for="name" class="block text-gray-700 text-sm font-bold mb-2") Item name
      input(v-model="itemName" name="name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline")
    div.mb-4
      label(for="price" class="block text-gray-700 text-sm font-bold mb-2") Item price
      input(v-model="itemPrice" name="price" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline")
    div.mb-6
      label(for="group" class="block text-gray-700 text-sm font-bold mb-2") Item group
      input(v-model="itemGroup" name="group" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline")

    
    btn-vue(btnName="Press To Test" btnColor="red")
    p(class="mt-3 text-center text-gray-800 text-xs") All right reserved.

//- div(class="max-w-lg bg-red-600") {{itemName}}
//- div(class="max-w-lg border-green-400") {{itemPrice}}
//- div(class="max-w-lg bg-indigo-600") {{itemGroup}}

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
      //   itemName: {
      //     type: String,
      //     required: true,
      //     default: "",
      //   },
      //   itemPrice: {
      //     type: Number,
      //     required: true,
      //     default: 0,
      //   },
      //   itemGroup: {
      //     type: String,
      //     required: true,
      //     default: "",
      //   },
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
