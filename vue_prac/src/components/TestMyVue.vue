<template lang="pug">
h1 Using Pug
    h6 {{mystr}}

h2 {{cnt}}
div
    button(@click="logging"
    class = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded") arrow
div
    button(@click="loggingArrow"
    class = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded") non-arrow
div
    button(class = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded") axios_test


button(@click="changeUserName") BTN
</template>

<script>
import BtnVue from "./Buttons.vue";

export default {
  name: "practice",
  components: {
    BtnVue,
  },
  props: {
    username: {
      type: String,
      default: "USER",
    },
  },
  data() {
    return {
      mystr: "Hello! Using Pug",
      cnt: 1,
    };
  },
  methods: {
    logging: function () {
      // this -> component
      this.cnt++;
      console.log(this);
      console.log("pressed non-arrow button");
    },

    loggingArrow: () => {
      // this -> function
      this.cnt++;
      console.log(this);
      console.log("pressed arrow button");
    },
  },
};
</script>
