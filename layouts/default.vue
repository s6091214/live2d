<template>
  <div
    class="w-full relative"
    v-loading="globalLoading"
    element-loading-text="Loading..."
    :element-loading-spinner="loadingIcon"
    element-loading-svg-view-box="-10, -10, 50, 50"
    element-loading-background="rgba(122, 122, 122, 0.8)"
  >
    <Header :scrollOver="scrollOver" @openUserDialog="openUserDialog" />
    <div
      class="layout w-full mx-auto text-center"
      style="min-height: calc(100vh - 56px)"
    >
      <slot />
    </div>
    <Footer class="sticky bottom-0 left-0 bg-[#000]" />
    <!-- 註冊/登入選單 -->
    <SignInAndSignup
      v-if="deviceName === 'unknown'"
      :signDialog="signDialogStatus"
      @close="closeUserDialog"
    />
    <GlobalAlert />
  </div>
</template>

<script setup lang="ts">
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
const nuxtApp = useNuxtApp();

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  nuxtApp.vueApp.component(key, component);
}

import SignInAndSignup from "../components/SignInAndSignup.vue";
import deviceName from "../util/mobileDetective";

const loadingIcon = `
  <path class="path" d="
    M 30 15
    L 28 17
    M 25.61 25.61
    A 15 15, 0, 0, 1, 15 30
    A 15 15, 0, 1, 1, 27.99 7.5
    L 15 15
  " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
`;

const initialStore = useInitialStore();
const { handleSignDialog } = initialStore;
const { globalLoading, signDialogStatus } = storeToRefs(initialStore);

const memeStore = useMemeStore();
const { likeIdList, hotMemesList } = storeToRefs(memeStore);
const { savaLikeIdList } = memeStore;

const userStore = useUserStore();
const { googleUid } = storeToRefs(userStore);

const { getMemeList } = useMemeList();
const { getHotMeme } = useHotMeme();

getMemeList();
getHotMeme();

watch(googleUid, async (uid) => {
  if (uid && uid !== "" && hotMemesList?.value.length) {
    let additional = [];
    hotMemesList.value.map((meme) => {
      let parseLikeList = [];
      try {
        switch (typeof meme.liked_user) {
          case "object":
            parseLikeList = meme.liked_user;
            break;
          case "string":
            parseLikeList = JSON.parse(meme.liked_user);
          default:
            break;
        }
      } catch (error) {}
      if (parseLikeList.length && parseLikeList.includes(uid)) {
        additional.push(meme.memeId);
      }
      return meme;
    });
    const newLikeList = [...new Set([...likeIdList.value].concat(additional))];
    savaLikeIdList(newLikeList);
  }
});

const scrollOver = ref(false);

const setScrollOver = (val) => {
  scrollOver.value = val;
};

const openUserDialog = () => {
  handleSignDialog(true);
};

const closeUserDialog = () => {
  handleSignDialog(false);
};

const { user, getUserList } = useUser();

getUserList();

onMounted(async () => {
  window.addEventListener("scroll", () => {
    const overHeigth = window.scrollY > 200;
    setScrollOver(overHeigth);
  });
});
</script>

<style scoped>
:deep(.el-loading-mask) {
  position: fixed;
  background-color: transparent;
}
</style>
