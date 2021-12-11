<template lang="pug">

div(class="mywrapper")
  nav-vue
  div(class="bg-red-100 p-3 rounded-md w-2/4 m-3 text-center flex flex-col items-center") 로그인
    div(class="bg-gray-500 w-3/4 p-2 m-2 max-w-md flex flex-col rounded-md") 
      input(type="text" name="id" placeholder="ID" v-model="user_id" class="m-2 rounded-md px-2 py-1") 
      input(type="password" name="pw" placeholder="PW" v-model="user_pw" class="m-2 rounded-md px-2 py-1")
      button(@click="tryLogin" class="m-2 bg-purple-400 hover:bg-purple-500 rounded-md") 로그인

    div(v-if="loginFailed" class="text-red-600 container bg-yellow-100 border-2 border-red-400 p-3 rounded-lg")
      ul(class="list-disc list-inside")
        li(v-for="item in loginErr") {{item}}

</template>

<script>
import axios from "axios";
import NavVue from "./Navbar";
import "../assets/myComponents.css";

// import axios from "axios";
export default {
  name: "LoginPage",
  components: { NavVue },
  data: function () {
    return {
      user_id: "",
      user_pw: "",
      loginFailed: false,
      loginErr: [],
    };
  },
  methods: {
    tryLogin: async function () {
      const fd = new FormData();
      fd.set("inputID", this.user_id);
      fd.set("inputPW", this.user_pw);
      const res = await axios({
        url: "http://localhost:3000/api/auth/login",
        method: "POST",
        data: fd,
        headers: {
          "Content-Type": "multipart/form-data",
          charset: "utf-8",
        },
        withCredentials: true,
      });
      this.loginFailed = !res.data.success;
      if (!res.data.success) {
        this.loginFailed = true;
        this.loginErr = res.data.errs;
      } else {
        this.$router.push("/");
      }
    },
  },
};
</script>
