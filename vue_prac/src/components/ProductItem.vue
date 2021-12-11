<template lang="pug">
div.mywrapper
    nav-vue
    div(class="bg-gray-300 p-3 m-2 w-3/4 max-w-md rounded-lg text-center") 상세정보
        div(class="p-1 m-2 bg-yellow-300 rounded-md") 이름 : {{prod.name}}
        div(class="p-1 m-2 bg-yellow-300 rounded-md") 가격 : {{prod.price}}
        div(class="p-1 m-2 bg-yellow-300 rounded-md") 수량 : {{prod.amount}}
        div(class="p-1 m-2 bg-yellow-300 rounded-md") 판매자 : {{prod.seller}}
        div.flex.justify-end.mr-2
          button(@click="deleteProd" class="p-3 hover:bg-red-500 bg-red-300 rounded") 삭제
    div(class="bg-gray-300 p-3 m-2 w-3/4 max-w-md rounded-lg")
        label(for="buyAmount" class="block p-1 m-2 bg-yellow-300 rounded-md") 구매량을 정해주세요.
        div.flex.justify-between
            input(type="number" v-model="buyAmount" name="buyAmount" class="m-2 p-2 rounded-md")
            button(@click="makeOrder" class="hover:bg-blue-600 bg-blue-400 m-2 w-1/4 rounded-md") 구매
</template>

<script>
import NavVue from "./Navbar";
import "../assets/myComponents.css";
import axios from "axios";
export default {
  components: { NavVue },
  data: function () {
    return {
      prod: {},
      buyAmount: 0,
    };
  },
  methods: {
    deleteProd: async function () {
      const currProd = this.$route.params.productID;
      console.log(currProd);
      const res = await axios({
        url: `http://localhost:3000/api/products/del/${currProd}`,
        method: "DELETE",
        headers: {
          charset: "utf-8",
        },
        withCredentials: true,
      });
      if (res.data.NOT_LOGINED === true) {
        alert("로그인한 회원만 주문가능합니다.");
        this.$router.push("/login");
      } else if (res.data.success === true) {
        alert("성공적으로 삭제하였습니다.");
        this.$router.go(-1);
      } else {
        if (res.data.err === "NOT SAME SELLER") alert("등록한 사용자만 삭제가 가능합니다.");
        else alert(`에러가 발생하였습니다. ${res.data.err}`);
      }
    },

    makeOrder: async function () {
      if (this.buyAmount > 0) {
        const fd = new FormData();
        fd.set("prodID", this.prod.id);
        fd.set("buyAmount", this.buyAmount);
        const res = await axios({
          url: `http://localhost:3000/api/products/order`,
          method: "POST",
          headers: {
            charset: "utf-8",
          },
          withCredentials: true,
          data: fd,
        });
        if (res.data.NOT_LOGINED === true) {
          alert("로그인한 회원만 주문가능합니다.");
          this.$router.push("/login");
        } else if (res.data.success === true) {
          alert("성공적으로 구매하였습니다.");
          this.$router.go(-1);
        } else {
          alert(`에러가 발생하였습니다. ${res.data.err}`);
        }
      } else {
        alert("구매량은 1 이상이여야 합니다.");
      }
    },
  },
  created: async function () {
    const currProd = this.$route.params.productID;
    const res = await axios({
      url: `http://localhost:3000/api/products/get/${currProd}`,
      method: "GET",
      headers: {
        charset: "utf-8",
      },
      withCredentials: true,
    });
    this.prod = res.data.result;
  },
};
</script>

<style></style>
