<template>
  <div class="w-full relative" v-loading="globalLoading">
    <Header :scrollOver="scrollOver" @openUserDialog="openUserDialog" />
    <div
      class="layout w-full mx-auto text-center"
      style="min-height: calc(100vh - 56px)"
    >
      <slot />
    </div>
    <Footer class="sticky bottom-0 left-0 bg-[#000]" />
    <!-- 註冊/登入選單 -->
    <SignInAndSignup :signDialog="signDialogStatus" @close="closeUserDialog" />
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

import { onAuthStateChanged } from "firebase/auth";

const initialStore = useInitialStore();
const { handleSignDialog } = initialStore;
const { globalLoading, signDialogStatus } = storeToRefs(initialStore);

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

// TODO: 初始化 Firebase

onMounted(() => {
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
