<template>
  <div>
    <h1 class="font-bold py-2 text-4xl">熱門迷因</h1>
    <!-- TODO: 文章列表 -->
    <div class="w-full">
      <PostComponent
        v-for="content in hotMemesList"
        :key="content.id"
        :postData="content"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const memeStore = useMemeStore();
const { setHotMeme } = memeStore;
const { hotMemesList } = storeToRefs(memeStore);

const { data, refresh } = await useAsyncData("getHotMemeList", () =>
  $fetch("/api/meme")
);

if (data.value) {
  setHotMeme(data.value);
}
</script>

<style scoped></style>
