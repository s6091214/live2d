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

import "virtual:svg-icons-register";
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
const { savaLikeIdList, setMemeList } = memeStore;

const userStore = useUserStore();
const { googleUid } = storeToRefs(userStore);

const { getMemeList, getMemeFromWarehouse } = useMemeList();
const { getHotMeme } = useHotMeme();
const { getUserList } = useUser();

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

const isScrollOver = () => {
  const overHeigth = window.scrollY > 200;
  setScrollOver(overHeigth);
};

const openUserDialog = () => {
  handleSignDialog(true);
};

const closeUserDialog = () => {
  handleSignDialog(false);
};

// getMemeList();
useAsyncData("memeList", async () => {
  await getMemeFromWarehouse();
});

// getHotMeme();

// getUserList();

onMounted(async () => {
  window.addEventListener("scroll", isScrollOver);
  // 監聽 beforeunload 事件
  window.addEventListener("beforeunload", handleBeforeUnload);
});

const resetLocalStorage = () => {
  localStorage.setItem("memePage", "1");
};

const handleBeforeUnload = (event) => {
  event.preventDefault();
  resetLocalStorage();
  setMemeList([]);
  return (event.returnValue = "");
};

onUnmounted(() => {
  window.removeEventListener("scroll", isScrollOver);
  // 移除 beforeunload 事件監聽
  window.removeEventListener("beforeunload", handleBeforeUnload);
});
</script>

<style scoped>
:deep(.el-loading-mask) {
  position: fixed;
  background-color: transparent;
}
</style>
