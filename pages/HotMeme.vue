<template>
  <div class="px-2 sm:px-0">
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
import type { MemePost } from "~/types";

interface ApiResponse {
  data: MemePost[];
}

const initialStore = useInitialStore();
const { setLoading } = initialStore;

const memeStore = useMemeStore();
const { setHotMeme } = memeStore;
const { hotMemesList } = storeToRefs(memeStore);

setLoading(true);

const { data: memes, refresh } = await useAsyncData<ApiResponse>(
  "getHotMemeList",
  () =>
    // $fetch("/api/meme")
    $fetch("https://shielded-earth-43070-852d0af23eb2.herokuapp.com/api/memes")
);

setLoading(false);

if (memes.value?.data) {
  setHotMeme(memes.value.data);
}
</script>

<style scoped></style>
