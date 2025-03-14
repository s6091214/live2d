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
const { hotMemesList, likeIdList, formatMemeArray } = storeToRefs(memeStore);

const userStore = useUserStore();
const { isLogin } = storeToRefs(userStore);

const router = useRouter();

watch(isLogin, async (status) => {
  if (!status) {
    router.push({ path: "/" });
  }
});

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
    if (formatMemeArray?.value) {
      additional = [...formatMemeArray.value].filter((item) => {
        const isLike = likeIdList.value.includes(item.memeId);
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
</script>

<style scoped></style>
