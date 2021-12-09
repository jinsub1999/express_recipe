<template>
  <div class="flex flex-col max-h-96 overflow-y-auto bg-blue-200 rounded-md">
    <div v-for="item in tenRecipe" :key="item.id" class="flex flex-col flex-shrink-0 m-2 p-1 bg-yellow-200 rounded-sm">
      <router-link
        :to="{ path: `/recipe/${item.id}` }"
        class="bg-blue-400 hover:bg-blue-600 hover:text-yellow-600 text-green-700 text-center p-2 rounded-t-md"
      >
        {{ item.name }}
      </router-link>
      <div class="p-3 bg-gray-400">{{ item.recipe }}</div>
      <div class="p-3 bg-gray-400">{{ item.author }}</div>
      <div class="p-3 bg-gray-400">{{ item.upvs }}</div>
      <div class="p-3 bg-gray-400">만든 날짜 : {{ showDate(item.uploadDate) }}</div>
      <div v-if="item.modifyDate" class="p-3 bg-gray-400">수정한 날짜 : {{ showDate(item.modifyDate) }}</div>
      <button v-if="item.upvoted === 0" @click="upvoteRecipe(item)" class="p-3 bg-green-300 hover:bg-green-500">
        추천
      </button>
      <button v-if="item.upvoted === 1" @click="removeUpvote(item)" class="p-3 bg-pink-100 hover:bg-pink-300">
        추천 취소
      </button>
      <router-link
        v-if="item.upvoted !== undefined"
        :to="{ path: `/modify/${item.id}` }"
        class="p-3 bg-blue-200 hover:bg-blue-400 text-center"
      >
        수정
      </router-link>
      <button
        v-if="item.upvoted !== undefined"
        @click="removeRecipe(item)"
        class="p-3 bg-red-200 hover:bg-red-400 rounded-b-md"
      >
        삭제
      </button>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "ItemList",
  components: {},
  data: function () {
    return {
      ListofRecipe: [],
      reload_page: 0,
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
          const dbQuery = await axios.get("http://localhost:3000/recipe");
          dbQuery.data.forEach((elem) => {
            elem.uploadDate = new Date(elem.uploadDate);
            if (elem.modifyDate !== null) elem.modifyDate = new Date(elem.modifyDate);
          });
          this.ListofRecipe = dbQuery.data;
        }
      }
    },
    showDate: function (__date) {
      return `${__date.getFullYear()}년 ${__date.getMonth() + 1}월 ${__date.getDate()}일`;
    },
  },
  created: async function () {
    const dbQuery = await axios.get("http://localhost:3000/recipe");
    var result = dbQuery.data.result[0];
    result.forEach((elem) => {
      elem.uploadDate = new Date(elem.uploadDate);
      if (elem.modifyDate !== null) elem.modifyDate = new Date(elem.modifyDate);
    });
    this.ListofRecipe = result;
  },
  computed: {
    tenRecipe() {
      return this.ListofRecipe.slice(0, 100);
    },
  },
};
</script>
