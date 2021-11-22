<template lang="pug">
div.flex
    div.userBlock.bg-indigo-500.text-yellow-500.m-3.flex-shrink-0.rounded.p-6.hoverRed {{username}}
    div.userBlock.bg-green-300.text-gray-500.m-3.flex-shrink-0.rounded-lg.p-6 {{gender}}
    input.userBlockInput.border-4
</template>

<script>
export default {
  name: "userBlock",
  props: {
    username: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
  },
};
</script>
