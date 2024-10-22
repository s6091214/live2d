<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  // color: {
  //   type: String,
  //   default: "#fff",
  // },
  cssClass: {
    type: String,
    default: "",
  },
});
const svgName = computed(() => {
  return props.name.includes("/") ? `#${props.name}` : `#/${props.name}`;
});
</script>
<template>
  <svg aria-hidden="true" class="inline-block" :class="cssClass">
    <use :xlink:href="svgName" :fill="props.color" />
  </svg>
</template>
