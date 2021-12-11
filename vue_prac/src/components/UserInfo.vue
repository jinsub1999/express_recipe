<template lang="pug">
div(class="mywrapper")
  nav-vue
  div(class="text-3xl p-3 m-1 bg-green-300 rounded-md w-1/2 text-center") {{userInfo.userID}} 님, 안녕하세요!
  div(class="flex flex-col justify-center items-center w-3/4 m-1 p-2 bg-blue-200 text-center rounded-lg") 회원님이 추천한 레시피 (최근 추천 순)
    div(class="flex flex-col p-3 m-1 rounded-md bg-green-200 text-left w-3/4" v-for="item in userInfo.upvoteLog")
      router-link(class="bg-blue-300 text-center w-60 overflow-hidden rounded-md p-3 m-2 hover:bg-blue-500" :to="{path: `/recipe/${item.id}`}") {{item.name}}
      div(class="flex justify-between my-1")
        div(class="w-1/12 block")
        div(class="flex items-center p-1 bg-green-300 rounded-md") 추천 일시 : {{showDate(item.upvoteDate)}}
      div(class="flex justify-between my-1")
        div(class="w-1/12 block")
        div(class="flex items-center p-1 bg-indigo-300 rounded-md") By {{item.author}}
  div(class="flex flex-col justify-center items-center w-3/4 m-1 p-2 bg-blue-200 text-center rounded-lg") 회원님이 주문한 제품들
    div(class="flex flex-col p-3 m-1 rounded-md bg-green-200 text-left w-3/4" v-for="item in userInfo.buyLog")
      router-link(class="bg-blue-300 text-center w-60 overflow-hidden rounded-md p-3 m-2 hover:bg-blue-500" :to="{path: `/products/${item.food_id}`}") {{item.prodName}}
      div(class="flex justify-between my-1")
        div(class="w-1/12 block")
        div(class="flex items-center p-1 bg-green-300 rounded-md") 구매 일시 : {{showDate(item.orderDate)}}
      div(class="flex justify-between my-1")
        div(class="w-1/12 block")
        div(class="flex items-center p-1 bg-pink-100 rounded-md") 구매량 : {{item.orderAmount}}
      div(class="flex justify-between my-1")
        div(class="w-1/12 block")
        div(class="flex items-center p-1 bg-indigo-300 rounded-md") By {{item.sellerID}}

</template>

<script>
import axios from "axios";
import NavVue from "./Navbar";
import "../assets/myComponents.css";
export default {
  name: "userInfo",
  components: {
    NavVue,
  },
  data: function () {
    return {
      userInfo: {},
    };
  },
  methods: {
    showDate: function (__date) {
      return `${__date.getFullYear()}년 ${
        __date.getMonth() + 1
      }월 ${__date.getDate()}일 ${__date.getHours()}시 ${__date.getMinutes()}분`;
    },
  },
  beforeMount: async function () {
    const res = await axios({
      url: "http://localhost:3000/api/auth/userinfo",
      method: "GET",
      headers: {
        charset: "utf-8",
      },
      withCredentials: true,
    });

    if (res.data.success) {
      this.userInfo = res.data.userInfo;
      this.userInfo.upvoteLog.forEach((elem) => {
        elem.upvoteDate = new Date(elem.upvoteDate);
      });
      this.userInfo.buyLog.forEach((elem) => {
        elem.orderDate = new Date(elem.orderDate);
      });
    } else {
      alert("로그인이 필요합니다!");
      this.$router.push("/login");
    }
  },
};
</script>
