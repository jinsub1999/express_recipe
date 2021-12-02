<template lang="pug">
nav-vue
//- div(class="max-w-lg flex justify-around bg-green-400" )
//-   router-link(to="/" class="py-2 px-4 bg-gray-600 rounded") MAIN PAGE
//-   router-link(to="/login" class="py-2 px-4 bg-gray-600 rounded") LOGIN
//-   router-link(to="/signup" class="py-2 px-4 bg-gray-600 rounded") SIGN UP
//-   button(class="py-2 px-4 bg-gray-400 focus:bg-gray-700 rounded" @click="tryLogout") LOGOUT
//-   button(class="py-2 px-4 bg-gray-400 focus:bg-gray-700 rounded" @click="checkLogined") CHECK
div LOGIN
div(class="bg-gray-500 p-2 m-2 max-w-md flex flex-col") 
  input(type="text" name="id" placeholder="ID" v-model="user_id" class="m-2") 
  input(type="password" name="pw" placeholder="PW" v-model="user_pw" class="m-2")
  button(@click="tryLogin" class="m-2 bg-purple-600") try

div(v-if="loginFailed" class="text-red-600")
  ul(class="list-disc list-inside")
    li(v-for="item in loginErr") {{item}}


div SIGN UP
div(class="bg-gray-500 p-2 m-2 max-w-md flex flex-col") 
  input(type="text" name="id" placeholder="ID" v-model="signup_id" class="m-2") 
  input(type="password" name="pw" placeholder="PW" v-model="signup_pw" class="m-2")
  button(@click="trySignup" class="m-2 bg-purple-600") try

div(v-if="signupFailed" class="text-red-600")
  ul(class="list-disc list-inside")
    li(v-for="item in signupErr") {{item}}

//- div {{my_id}}
</template>

<script>
import axios from "axios";
import NavVue from "./Navbar";

// import axios from "axios";
export default {
  name: "LoginPage",
  components: { NavVue },
  data: function () {
    return {
      user_id: "",
      user_pw: "",
      signup_id: "",
      signup_pw: "",
      loginAllowed: false,
      signupAllowed: false,
      loginFailed: false,
      loginErr: [],
      signupFailed: false,
      signupErr: [],
      my_id: "",
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
  beforeMount: async function () {
    const res = await axios({
      url: "http://localhost:3010/auth/userid",
      method: "GET",
      headers: {
        charset: "utf-8",
      },
      withCredentials: true,
    });
    console.log(res);
    this.my_id = res.data;
  },
};
</script>
