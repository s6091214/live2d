<template>
  <div>
    <h1 class="font-bold py-2 text-4xl">說讚的內容</h1>
    <!-- TODO: 文章列表 -->
    <div class="w-full" v-if="isLogin">
      <PostComponent
        v-for="content in filterLikes"
        :key="content.id"
        :postData="content"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const memeStore = useMemeStore();
const { getMemeList } = memeStore;
const { memeList } = storeToRefs(memeStore);

const userStore = useUserStore();
const { isLogin, likeIdList } = storeToRefs(userStore);

const filterLikes = computed(() => {
  if (likeIdList?.value && memeList?.value) {
    const result = [...memeList.value];
    return result.filter((item) => likeIdList.value.includes(item.id));
  }
  return [];
});

onMounted(() => {
  if (!memeList.value.length) {
    getMemeList();
  }
});
</script>

<style scoped></style>
