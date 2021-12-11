<template lang="pug">
div.mywrapper
  nav-vue
  div(class="bg-gray-700 p-3 m-2 max-w-md flex flex-col rounded-lg")
    label(for="r_name" class="block p-1 m-2 bg-yellow-300 rounded-md") 레시피 이름
    input(v-model="recipeName" name="r_name" type="text" class="m-2 p-2 rounded-md")
    label(for="r_text" class="block p-1 m-2 bg-yellow-300 rounded-md") 레시피를 적어주세요
    textarea(v-model="recipeBody" class="m-2 p-2 w-96 h-52 rounded-lg" name="r_text")
    label(for="r_ingred" class="block p-1 m-2 bg-yellow-300 rounded-md") 필요한 재료를 적어주세요
    input(v-model="recipeIngred_input" name="r_ingred" class="m-2 p-2 rounded-md")
    div(class="flex overflow-x-auto")
      div(v-for="(ingred, indx) in recipeIngred" class="flex flex-shrink-0 justify-center items-center m-2 pl-2 bg-green-600 rounded-md") {{ingred.ingredName}}
        button(@click="removeIngred(indx)" class="m-2 px-2 rounded-md bg-red-300 hover:bg-red-500") X
    button(name="r_ingred" @click="addIngred" class="hover:bg-blue-600 bg-blue-400 m-2 rounded-md") 재료추가


    button(@click="postRecipe" class="m-2 bg-purple-400 hover:bg-purple-500 rounded-md") 레시피 올리기!

    div(v-if="uploadFailed" class="text-red-600 container mx-auto bg-yellow-100 border-2 border-red-400 p-3 rounded-lg")
        ul(class="list-disc list-inside")
            li(v-for="item in uploadErrs") {{item}}


</template>

<script>
import NavVue from "./Navbar";
import BtnVue from "./Buttons.vue";
import axios from "axios";
import "../assets/myComponents.css";

export default {
  name: "itemForm",
  components: {
    NavVue,
    BtnVue,
  },
  data: function () {
    return {
      recipeName: "",
      recipeBody: "",
      recipeIngred_input: "",
      recipeIngred: [],
      uploadFailed: false,
      uploadErrs: [],
    };
  },
  methods: {
    postRecipe: async function () {
      const fd = new FormData();
      fd.set("recipeName", this.recipeName);
      fd.set("recipeBody", this.recipeBody);
      fd.set("recipeIngred", JSON.stringify(this.recipeIngred));
      const res = await axios({
        method: "POST",
        url: "http://localhost:3000/api/recipe",
        headers: {
          "Content-Type": "multipart/form-data",
          charset: "utf-8",
        },
        data: fd,
      });
      this.uploadFailed = !res.data.success;
      this.uploadErrs = res.data.errs;
      if (!this.uploadFailed) {
        alert("레시피를 등록했습니다!");
        this.$router.push(`/recipe/${res.data.recipeKey}`);
      }
    },
    addIngred: function () {
      this.recipeIngred.push({ ingredName: `${this.recipeIngred_input}` });
      this.recipeIngred_input = "";
    },
    removeIngred: function (indx) {
      this.recipeIngred.splice(indx, 1);
    },
  },
  created: async function () {
    const res = await axios({
      url: "http://localhost:3000/api/products/form",
      method: "GET",
      headers: {
        charset: "utf-8",
      },
      withCredentials: true,
    });
    if (res.data.NOT_LOGINED) {
      alert("로그인이 필요한 서비스입니다.");
      this.$router.push("/login");
    }
    this.ingredList = res.data.ingreds;
  },
};
</script>
