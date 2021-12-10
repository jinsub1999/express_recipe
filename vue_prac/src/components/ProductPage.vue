<template lang="pug">
div(class="mywrapper")
    nav-vue
    div(class="bg-gray-300 p-3 m-1 rounded-md items-center flex flex-col max-h-96 overflow-scroll") 제품 목록
        div(class="bg-gray-700 p-3 m-2 max-w-md flex flex-col rounded-lg")
            div(v-for="item in productList" class="m-1 p-1 bg-gray-200 rounded-sm")
                router-link(class="p-1 m-1 bg-yellow-200 hover:bg-yellow-300 rounded-sm flex items-center justify-center"
                :to="{ path: `/products/${item.id}` }") {{item.name}}
                div 제품 종류 : {{item.kind}}
                div 제품 수량 : {{item.amount}}
                div 제품 가격 : {{item.price}}
                div 판매자 : {{item.seller}}

</template>

<script>
import NavVue from "./Navbar";
import "../assets/myComponents.css";
import axios from "axios";
export default {
  name: "ProductPage",
  components: { NavVue },
  data: function () {
    return {
      productList: [],
    };
  },
  methods: {},
  created: async function () {
    const res = await axios({
      url: "http://localhost:3000/api/products",
      method: "GET",
      headers: {
        charset: "utf-8",
      },
      withCredentials: true,
    });
    this.productList = res.data.result;
  },
};
</script>
