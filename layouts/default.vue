<template>
  <div class="w-full relative">
    <Header :scrollOver="scrollOver" />
    <div
      class="layout w-full mx-auto text-center"
      style="min-height: calc(100vh - 50px)"
    >
      <slot />
    </div>
    <Footer class="sticky bottom-0 left-0 bg-[#000]" />
  </div>
</template>

<script setup lang="ts">
const scrollOver = ref(false);

const setScrollOver = (val) => {
  scrollOver.value = val;
};

onMounted(() => {
  window.addEventListener("scroll", () => {
    const overHeigth = window.scrollY > 200;
    setScrollOver(overHeigth);
  });
});
</script>

<style scoped></style>
