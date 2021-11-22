<template lang="pug">
  
button(:class="classStr" @click="onClick") {{btnName}}
</template>

<script>
export default {
  name: "btn",
  data: function () {
    return {
      classStr: `bg-${this.btnColor}-500
      hover:bg-${this.btnColor}-700 text-white font-bold py-2 px-4 rounded`,
    };
  },
  props: {
    btnName: {
      type: String,
      required: true,
    },
    btnColor: {
      type: String,
      required: true,
    },
    onClick: {
      type: Function,
      default: () => {},
    },
  },
  beforeMount: function () {
    if (["red", "green", "blue"].indexOf(this.btnColor) === -1) {
      this.classStr = `bg-gray-500
      hover:bg-gray-700 text-white font-bold py-2 px-4 rounded`;
    }
  },
};
</script>
