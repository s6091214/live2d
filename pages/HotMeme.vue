<template>
  <div class="px-2 sm:px-0">
    <h1 class="font-bold py-2 text-4xl">熱門迷因</h1>
    <!-- TODO: 文章列表 -->
    <div class="w-full">
      <PostComponent
        v-for="content in hotMemesList"
        :key="content.memeId"
        :postData="content"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const memeStore = useMemeStore();
const { fetchHotMemeData } = memeStore;
const { hotMemesList } = storeToRefs(memeStore);

useAsyncData("hotMemeData", async () => {
  await fetchHotMemeData();
  return true;
});
</script>

<style scoped></style>
