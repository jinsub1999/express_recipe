<template lang="pug">
div(class="mywrapper")
  nav-vue
  div(class="bg-gray-700 p-3 m-2 max-w-md flex flex-col rounded-lg")
    label(for="r_name" class="block p-1 m-2 bg-yellow-300 rounded-md") 레시피 이름
    input(v-model="recipeName" name="r_name" type="text" class="m-2 p-2 rounded-md")
    label(for="r_text" class="block p-1 m-2 bg-yellow-300 rounded-md") 레시피를 적어주세요
    textarea(v-model="recipeBody" class="m-2 p-2 w-96 h-52 rounded-lg" name="r_text")
    label(for="r_ingred" class="block p-1 m-2 bg-yellow-300 rounded-md") 필요한 재료를 적어주세요
    input(v-model="recipeIngred_input" name="r_ingred" class="m-2 p-2 rounded-md")
    div(class="flex overflow-x-auto")
      div(v-for="(ingred, indx) in recipeIngred" class="flex flex-shrink-0 justify-center items-center m-2 pl-2 bg-gray-600 rounded-md") {{ingred.kind}}
        button(@click="removeIngred(indx)" class="m-2 px-2 rounded-md bg-red-300 hover:bg-red-500") X
    button(name="r_ingred" @click="addIngred" class="hover:bg-blue-600 bg-blue-400 m-2 rounded-md") 재료추가


    button(@click="modRecipe" class="m-2 bg-purple-400 hover:bg-purple-500 rounded-md") 레시피 수정하기!

    div(v-if="modifyFailed" class="text-red-600 container mx-auto bg-yellow-100 border-2 border-red-400 p-3 rounded-lg")
        ul(class="list-disc list-inside")
            li(v-for="item in modifyErrs") {{item}}


</template>

<script>
import axios from "axios";
import NavVue from "./Navbar";
import "../assets/myComponents.css";

export default {
  name: "RecipeModify",
  components: {
    NavVue,
  },
  data: function () {
    return {
      recipeName: "",
      recipeBody: "",
      recipeIngred_input: "",
      recipeIngred: [],
      modifyFailed: false,
      modifyErrs: [],
    };
  },
  methods: {
    modRecipe: async function () {
      const fd = new FormData();
      const currRecipe = this.$route.params.recipeID;
      fd.set("recipeName", this.recipeName);
      fd.set("recipeBody", this.recipeBody);
      fd.set("recipeID", currRecipe);
      fd.set("recipeIngred", JSON.stringify(this.recipeIngred));
      const res = await axios({
        method: "PUT",
        url: `http://localhost:3000/api/recipe/${currRecipe}`,
        headers: {
          "Content-Type": "multipart/form-data",
          charset: "utf-8",
        },
        data: fd,
      });
      this.modifyFailed = !res.data.success;
      this.modifyErrs = res.data.errs;
      if (!this.modifyFailed) this.$router.go(-1);
    },
    addIngred: function () {
      this.recipeIngred.push({ kind: `${this.recipeIngred_input}` });
      this.recipeIngred_input = "";
    },
    removeIngred: function (indx) {
      this.recipeIngred.splice(indx, 1);
    },
  },
  beforeMount: async function () {
    const currRecipe = this.$route.params.recipeID;
    const res = await axios.get(`http://localhost:3000/api/recipe/${currRecipe}`);
    if (res.data.success) {
      if (res.data.sameAuthor) {
        this.recipeName = res.data.result.name;
        this.recipeBody = res.data.result.recipe;
        this.recipeIngred = res.data.ingred;
        console.log(this.recipeIngred);
      } else {
        alert("작성자만 수정가능합니다.");
        this.$router.go(-1);
      }
    } else {
      alert(res.data.message);
      this.$router.go(-1);
    }
  },
};
</script>
