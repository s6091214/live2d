<template>
  <header
    :class="`relative z-10 text-center shadow flex px-3 justify-between ${
      scrollOver
        ? 'sticky top-0 left-0 z-[10] bg-[#870000] animate-[slide-down_1s_ease-in-out] pr-5'
        : 'bg-[#000]'
    }`"
  >
    <h1 class="font-bold py-1 text-[0px] xl:text-5xl">
      <router-link
        to="/"
        class="w-full h-full text-white text-4xl hover:text-white"
      >
        <span class="hidden xl:block">MEME Talk</span>
        <img
          src="/logo.png"
          alt="logo"
          class="inline-block xl:hidden w-[36px]"
        />
      </router-link>
    </h1>
  </header>
</template>

<script setup>
const props = defineProps({
  scrollOver: Boolean,
});
</script>
