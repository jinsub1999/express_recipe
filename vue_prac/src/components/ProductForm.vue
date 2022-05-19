<template lang="pug">
div(class="mywrapper")
  nav-vue
  div.flex
    div(class="bg-gray-700 p-3 m-2 max-w-md flex flex-col rounded-lg")
        label(for="prod_name" class="block p-1 m-2 bg-yellow-300 rounded-md") 제품 이름
        input(v-model="prodName" name="prod_name" type="text" class="m-2 p-2 rounded-md")
        label(for="prod_price" class="block p-1 m-2 bg-yellow-300 rounded-md") 제품 가격
        input(v-model="prodPrice" name="prod_price" type="number" class="m-2 p-2 rounded-md")
        label(for="prod_amount" class="block p-1 m-2 bg-yellow-300 rounded-md") 제품 수량
        input(v-model="prodAmount" type="number" name="prod_amount" class="m-2 p-2 rounded-md")

    div(class="bg-gray-700 p-3 m-2 max-w-md flex flex-col rounded-lg")
        div(class="block p-1 m-2 bg-yellow-300 rounded-md") 제품 종류
        div(class="flex flex-col overflow-scroll max-h-72")
            div(v-for="item in ingredList" class="bg-purple-300 rounded-md m-1 p-2" )
                input(type="radio" v-model="checkedKind" :id="`kinds_${item.id}`" class="mr-2" name="kinds" :value="item.id")
                label(:for="`kinds_${item.id}`") {{item.kind}}
        label(for="prod_amount" class="block p-1 m-2 bg-yellow-300 rounded-md") 종류에 없다면 추가하세요!
        input(v-model="ingred_input" type="text" name="prod_amount" class="m-2 p-2 rounded-md")
        button(@click="addKind" class="hover:bg-blue-600 bg-blue-400 m-2 rounded-md") 종류 추가
        button(@click="createProd" class="m-2 bg-purple-400 hover:bg-purple-500 rounded-md") 제품 추가하기!

    

</template>

<script>
import NavVue from "./Navbar";
import "../assets/myComponents.css";
import axios from "axios";
export default {
  name: "LoginPage",
  components: { NavVue },
  data: function () {
    return {
      prodName: "",
      prodAmount: 0,
      prodPrice: 0,
      ingred_input: "",
      ingredList: [],
      formErr: [],
      checkedKind: undefined,
    };
  },
  methods: {
    createProd: async function () {
      if (this.checkedKind === undefined) alert("종류를 골라주세요!");
      else {
        const fd = new FormData();
        fd.set("prodName", this.prodName);
        fd.set("prodAmount", this.prodAmount);
        fd.set("prodPrice", this.prodPrice);
        fd.set("prodKind", this.checkedKind);
        const res = await axios({
          url: "http://localhost:3000/api/products/form",
          method: "POST",
          headers: {
            charset: "utf-8",
          },
          withCredentials: true,
          data: fd,
        });
        if (res.data.success) {
          alert("성공적으로 등록했습니다.");
          this.$router.push("/products");
        }
      }
    },
    addKind: async function () {
      const fd = new FormData();
      fd.set("ingredInput", this.ingred_input);
      const res = await axios({
        url: "http://localhost:3000/api/products/form/kind",
        method: "POST",
        headers: {
          charset: "utf-8",
        },
        withCredentials: true,
        data: fd,
      });
      if (!(this.ingredList.find(elem => elem.kind === this.ingred_input)))
        this.ingredList.push({id: res.data.kindID, kind: this.ingred_input });
      else
        alert("이미 있는 종류입니다!");
      this.ingred_input = "";
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
    if (res.data.ingreds)
      this.ingredList = res.data.ingreds;
    else
      this.ingredList = [];
  },
};
</script>
