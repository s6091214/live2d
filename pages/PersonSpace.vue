<template>
  <div class="px-2 sm:px-0">
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
const { memeList, hotMemesList } = storeToRefs(memeStore);

const userStore = useUserStore();
const { isLogin, likeIdList, isGoogleLogin, userInfo } = storeToRefs(userStore);

const googleUid = computed(() => {
  if (isGoogleLogin) {
    return userInfo.value.uid;
  }
  return null;
});

const filterLikes = computed(() => {
  let result = [];
  if (likeIdList?.value) {
    if (memeList?.value) {
      result = [...memeList.value].filter((item) =>
        likeIdList.value.includes(item.id)
      );
    }
    if (hotMemesList?.value && isGoogleLogin) {
      let addList = [];
      hotMemesList.value.map((meme) => {
        let parseLikeList = [];
        try {
          parseLikeList = JSON.parse(meme.liked_user);
        } catch (error) {}
        if (
          parseLikeList.length &&
          parseLikeList.includes(googleUid.value) &&
          !likeIdList.value.includes(meme.id)
        ) {
          addList.push(meme);
        }
        return meme;
      });
      result = result.concat(addList);
    }
  }
  return result;
});

if (!memeList.value.length) {
  getMemeList();
}
</script>

<style scoped></style>
