<template>
  <div class="px-2 sm:px-0">
    <h1 class="font-bold py-2 text-4xl">說讚的內容</h1>
    <!-- TODO: 文章列表 -->
    <div class="w-full pb-8" v-if="isLogin">
      <PostComponent
        v-for="content in filterLikes"
        :key="content.memeId"
        :postData="content"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
});

const memeStore = useMemeStore();
const { memeList, hotMemesList, likeIdList } = storeToRefs(memeStore);

const userStore = useUserStore();
const { isLogin } = storeToRefs(userStore);

const router = useRouter();

const filterLikes = computed(() => {
  let resultArray = [];
  let additional = [];

  if (hotMemesList?.value) {
    resultArray = [...hotMemesList.value].filter((item) => {
      const isLike = likeIdList.value.includes(item.memeId);
      return isLike;
    });
  }

  if (likeIdList?.value) {
    if (memeList?.value) {
      additional = [...memeList.value].filter((item) => {
        const isLike = likeIdList.value.includes(item.id);
        return isLike;
      });
    }
  }

  if (additional.length) {
    const combinedArray = [...resultArray, ...additional];
    const uniqueByMemeId = combinedArray
      .reduce((acc, item) => {
        // 確保每個 memeId 只有一個物件
        if (!acc.has(item.memeId)) {
          acc.set(item.memeId, item);
        }
        return acc;
      }, new Map())
      .values();
    return [...uniqueByMemeId];
  }
  return resultArray;
});

watch(isLogin, async (status) => {
  if (!status) {
    router.push({ path: "/" });
  }
});
</script>

<style scoped></style>
