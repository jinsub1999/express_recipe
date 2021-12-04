<template lang="pug">
div(class="mywrapper")
  nav-vue
  div(class="bg-red-100 p-3 rounded-md w-2/4 m-3 text-center flex flex-col items-center") Sign up
    div(class="bg-gray-500 w-3/4 p-2 m-2 max-w-md flex flex-col rounded-md") 
      input(type="text" name="id" placeholder="ID" v-model="signup_id" class="m-2 rounded-md px-2 py-1") 
      input(type="password" name="pw" placeholder="PW" v-model="signup_pw" class="m-2 rounded-md px-2 py-1")
      button(@click="trySignup" class="m-2 bg-purple-400 hover:bg-purple-500 rounded-md") 회원가입


    div(v-if="signupFailed" class="text-red-600 container bg-yellow-100 border-2 border-red-400 p-3 rounded-lg")
      ul(class="list-disc list-inside")
        li(v-for="item in signupErr") {{item}}

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
      signup_id: "",
      signup_pw: "",
      signupFailed: false,
      signupErr: [],
    };
  },
  methods: {
    trySignup: async function () {
      const fd = new FormData();
      fd.set("inputID", this.signup_id);
      fd.set("inputPW", this.signup_pw);
      const res = await axios({
        url: "http://localhost:3010/auth/signup",
        method: "POST",
        data: fd,
        headers: {
          "Content-Type": "multipart/form-data",
          charset: "utf-8",
        },
        withCredentials: true,
      });
      this.signupFailed = !res.data.success;
      if (!res.data.success) {
        this.signupFailed = true;
        this.signupErr = res.data.errs;
      } else {
        this.$router.push("/login");
      }
    },
    tryLogout: async function () {
      const res = await axios({
        url: "http://localhost:3010/auth/logout",
        method: "GET",
        headers: {
          charset: "utf-8",
        },
        withCredentials: true,
      });
      console.log(res);
      this.$router.push("/");
    },
  },
};
</script>
