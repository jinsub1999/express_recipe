<template lang="pug">
div(class="mywrapper")
    nav-vue
    div(class="bg-yellow-100 p-2 text-center w-1/4 rounded-md m-2") {{recipeInfo.name}}
    div(class="bg-green-50 p-2 w-3/4 rounded-md")
        div.flex.justify-start(class="w-3/4 ml-2")
            div(class="flex bg-gray-200 p-1 px-2 rounded-md items-center") 레시피 by {{recipeInfo.author}}
            div(class="flex mx-1 bg-yellow-200 p-1 px-2 items-center rounded-md text-green-500") 추천 수 : {{recipeInfo.upvs}}
            div(v-if="recipeInfo.uploadDate" class="flex bg-gray-200 p-2 rounded-md items-center mx-1") {{showDate(recipeInfo.uploadDate)}}에 등록됨.
            div(v-if="recipeInfo.modifyDate" class="flex bg-gray-200 p-2 rounded-md items-center mx-1") {{showDate(recipeInfo.modifyDate)}}에 수정됨.

        div(class="bg-blue-200 p-2 rounded-md m-2") {{recipeInfo.recipe}}
        div.flex.justify-end(v-if="recipeInfo.upvoted !== undefined")
            button(v-if="!recipeInfo.upvoted" @click="upvoteRecipe(recipeInfo)" class="p-3 bg-green-300 hover:bg-green-500 mx-2 rounded-md") 추천
            button(v-if="recipeInfo.upvoted" @click="removeUpvote(recipeInfo)" class="p-3 bg-pink-100 hover:bg-pink-300 mx-2 rounded-md") 추천 취소
            router-link(:to="{ path: `/modify/${recipeInfo.id}`}" class="p-3 bg-blue-200 hover:bg-blue-400 text-center mx-2 rounded-md") 수정
            button(@click="removeRecipe(recipeInfo)" class="p-3 bg-red-200 hover:bg-red-400 rounded-md mx-2") 삭제

</template>

<script>
import NavVue from "./Navbar";
import axios from "axios";
import "../assets/myComponents.css";
export default {
  name: "RecipeItem",
  components: {
    NavVue,
  },
  data: function () {
    return {
      recipeInfo: {},
    };
  },
  methods: {
    upvoteRecipe: async function (params) {
      const recId = params.id;
      await axios.post(`http://localhost:3000/upvote/${recId}`);
      params.upvs++;
      params.upvoted = 1;
    },
    removeUpvote: async function (params) {
      const recId = params.id;
      await axios.delete(`http://localhost:3000/upvote/${recId}`);
      params.upvs--;
      params.upvoted = 0;
    },
    removeRecipe: async function (params) {
      if (confirm("삭제하겠습니까?")) {
        const recId = params.id;
        const res = await axios.delete(`http://localhost:3000/recipe/${recId}`);
        if (!res.data.success) {
          alert(res.data.errs[0]);
        } else {
          this.$router.go(-1);
        }
      }
    },
    showDate: function (__date) {
      return `${__date.getFullYear()}년 ${__date.getMonth() + 1}월 ${__date.getDate()}일`;
    },
  },
  beforeMount: async function () {
    const currRecipe = this.$route.params.recipeID;
    const res = await axios.get(`http://localhost:3000/recipe/${currRecipe}`);
    if (res.data.success) {
      this.recipeInfo = res.data.result;
      this.recipeInfo.uploadDate = new Date(this.recipeInfo.uploadDate);
      if (this.recipeInfo.modifyDate) this.recipeInfo.modifyDate = new Date(this.recipeInfo.modifyDate);
      console.log(this.recipeInfo);
    } else {
      alert(res.data.message);
      this.$router.push("/");
    }
  },
};
</script>
