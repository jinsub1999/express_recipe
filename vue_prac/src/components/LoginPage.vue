<template lang="pug">
div(class="max-w-lg flex justify-around bg-green-400" )
  router-link(to="/" class="py-2 px-4 bg-gray-600 rounded") MAIN PAGE
  router-link(to="/login" class="py-2 px-4 bg-gray-600 rounded") LOGIN
  router-link(to="/signup" class="py-2 px-4 bg-gray-600 rounded") SIGN UP

div LOGIN
div(class="bg-gray-500 p-2 m-2 max-w-md flex flex-col") 
  input(type="text" name="id" placeholder="ID" v-model="user_id" class="m-2") 
  input(type="password" name="pw" placeholder="PW" v-model="user_pw" class="m-2")
  button(@click="tryLogin" class="m-2 bg-purple-600") try

div(v-if="loginFailed" class="text-red-600") LOGIN FAILED!

div SIGN UP
div(class="bg-gray-500 p-2 m-2 max-w-md flex flex-col") 
  input(type="text" name="id" placeholder="ID" v-model="signup_id" class="m-2") 
  input(type="password" name="pw" placeholder="PW" v-model="signup_pw" class="m-2")
  button(@click="trySignup" class="m-2 bg-purple-600") try

div(v-if="signupFailed" class="text-red-600") SIGN UP FAILED!
</template>

<script>
import axios from "axios";
// import axios from "axios";
export default {
  name: "LoginPage",
  data: function () {
    return {
      user_id: "",
      user_pw: "",
      signup_id: "",
      signup_pw: "",
      loginFailed: false,
      signupFailed: false,
    };
  },
  methods: {
    tryLogin: async function () {
      const fd = new FormData();
      fd.set("inputID", this.user_id);
      fd.set("inputPW", this.user_pw);
      const res = await axios({
        url: "http://localhost:3010/auth/login",
        method: "POST",
        data: fd,
        headers: {
          "Content-Type": "multipart/form-data",
          charset: "utf-8",
        },
      });
      if (res.data === "OK") {
        this.$router.go(-1);
      } else {
        this.loginFailed = true;
      }
    },
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
      });
      if (res.data === "OK") {
        console.log("LOL");
      } else {
        this.signupFailed = true;
      }
    },
  },
};
</script>
