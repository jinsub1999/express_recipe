<template lang="pug">
div(class="max-w-7xl mx-2 px-2 sm:px-6 lg:px-8 bg-gray-600 rounded-br-xl rounded-bl-xl w-10/12")
    div(class="flex items-center justify-between h-20 bg-indigo-300 pl-3 pr-2")
        router-link(to="/" class="bg-indigo-600 text-green-200 p-3 rounded-md m-1") Main Page
        div
          router-link(v-if="!logined" to="/login" class="bg-indigo-600 text-green-200 p-3 rounded-md m-1") Login
          router-link(v-if="!logined" to="/signup" class="bg-indigo-600 text-green-200 p-3 rounded-md m-1") Signup
        button(@click="tryLogout" v-if="logined" class="bg-indigo-600 text-green-200 p-3 rounded-md m-1") Logout
    div(v-if="logined" class="p-2 bg-purple-300 text-blue-800")
      div {{userID}}
</template>

<script>
import axios from "axios";

export default {
  name: "NavBar",
  data: function () {
    return {
      userID: "",
      logined: false,
    };
  },
  methods: {
    tryLogout: async function () {
      await axios({
        url: "http://localhost:3010/auth/logout",
        method: "GET",
        headers: {
          charset: "utf-8",
        },
        withCredentials: true,
      });
      this.$router.push("/login");
    },
  },
  beforeMount: async function () {
    document.body.classList.add("bgcolor");
    const res = await axios({
      url: "http://localhost:3010/auth/userid",
      method: "GET",
      headers: {
        charset: "utf-8",
      },
      withCredentials: true,
    });
    this.logined = res.data.logined;
    this.userID = res.data.userID;
  },
};
</script>
<style>
body.bgcolor {
  background-color: antiquewhite;
}
</style>
