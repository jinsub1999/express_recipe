<template>
  <div class="flex flex-col bg-red-100 m-1">
    <div class="p-3 m-3 bg-green-300">
      {{ ItemName }}
    </div>
    <div class="p-3 m-3 bg-red-300">
      {{ ItemPrice }}
    </div>
  </div>
</template>
<script>
export default {
  name: "item",
  props: {
    ItemID: {
      type: Number,
      required: true,
    },
    ItemName: {
      type: String,
      required: true,
    },
    ItemPrice: {
      type: String,
      required: true,
    },
  },
};
</script>
