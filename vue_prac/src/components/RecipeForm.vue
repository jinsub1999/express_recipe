<template lang="pug">

div(class="bg-gray-700 p-3 m-2 max-w-md flex flex-col rounded-lg")
    input(v-model="recipeName" type="text" class="m-2")
    textarea(v-model="recipeBody" class="m-2 w-96 h-52")
    button(@click="postRecipe" class="m-2 bg-purple-400 hover:bg-purple-500 rounded-md") 레시피 올리기!

    div(v-if="uploadFailed" class="text-red-600 container mx-auto bg-yellow-100 border-2 border-red-400 p-3 rounded-lg")
        ul(class="list-disc list-inside")
            li(v-for="item in uploadErrs") {{item}}


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
      recipeName: "",
      recipeBody: "",
      uploadFailed: false,
      uploadErrs: [],
    };
  },
  methods: {
    postRecipe: async function () {
      const fd = new FormData();
      fd.set("recipeName", this.recipeName);
      fd.set("recipeBody", this.recipeBody);
      const res = await axios({
        method: "POST",
        url: "http://localhost:3010/insertRecipe",
        headers: {
          "Content-Type": "multipart/form-data",
          charset: "utf-8",
        },
        data: fd,
      });
      this.uploadFailed = !res.data.success;
      this.uploadErrs = res.data.errs;
    },
  },
};
</script>
