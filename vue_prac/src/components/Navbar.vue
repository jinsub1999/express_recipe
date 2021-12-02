<template lang="pug">
div(class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 bg-gray-600")
    div(class="flex items-center justify-between h-20 bg-purple-600")
        router-link(to="/" class="bg-indigo-800 text-green-200 p-3 rounded-md m-1") Main Page
        router-link(v-if="!logined" to="/login" class="bg-indigo-800 text-green-200 p-3 rounded-md m-1") LOGIN
        button(@click="tryLogout" v-if="logined" class="bg-indigo-800 text-green-200 p-3 rounded-md m-1") logout
    div(v-if="logined" class="p-2 bg-gray-500 text-green-300")
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
      const res = await axios({
        url: "http://localhost:3010/auth/logout",
        method: "GET",
        headers: {
          charset: "utf-8",
        },
        withCredentials: true,
      });
      console.log(res);
      this.$router.push("/login");
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
    this.logined = res.data.logined;
    this.userID = res.data.userID;
  },
};
</script>
