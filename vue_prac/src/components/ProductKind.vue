<template lang="pug">
div.mywrapper
    nav-vue
    div(class="bg-gray-300 p-3 m-2 w-3/4 max-w-md rounded-lg") {{kind}}
        div(class="p-2 rounded bg-green-100 flex flex-col items-center" v-for="item in searched")
            router-link(class="bg-blue-200 p-1 rounded w-3/4" :to="{path:`/products/${item.id}`}") {{item.name}}
            div(class="flex justify-between w-3/4")
                div(class="p-2 bg-blue-300 my-1 rounded-sm") 판매자 : {{item.seller}} 
                div.flex
                    div(class="p-2 bg-green-300 my-1 mr-1 rounded-sm") 가격 : {{item.price}} 
                    div(class="p-2 bg-green-300 my-1 ml-1 rounded-sm") 수량 : {{item.amount}} 
        div(class="bg-gray-300 justify-between p-3 m-2 w-3/4 max-w-md rounded-lg")
        div.flex.justify-between
</template>

<script>
import NavVue from "./Navbar";
import "../assets/myComponents.css";
import axios from "axios";
export default {
  components: { NavVue },
  data: function () {
    return {
      searched: [],
      kind: "",
    };
  },
  methods: {},
  created: async function () {
    const currKind = this.$route.params.kindID;
    const res = await axios({
      url: `http://localhost:3000/api/products/kind/${currKind}`,
      method: "GET",
      headers: {
        charset: "utf-8",
      },
      withCredentials: true,
    });
    this.searched = res.data.result;
    this.kind = res.data.kind;
    if (res.data.success === false) {
      if (res.data.err === "PRODUCT NOT FOUND") alert("해당 종류의 상품이 현재 등록되지 않았습니다...");
      else alert(res.data.err);
      this.$router.go(-1);
    }
  },
};
</script>

<style></style>
