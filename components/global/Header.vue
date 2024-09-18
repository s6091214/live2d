<template>
  <header
    :class="`relative z-10 text-center shadow flex px-3 justify-between ${
      scrollOver
        ? 'sticky top-0 left-0 z-[10] bg-[#870000] animate-[slide-down_1s_ease-in-out] pr-5'
        : 'bg-[#000]'
    }`"
  >
    <!-- TODO: LOGO -->
    <h1 class="font-bold py-1 pr-3 text-[0px]">
      <router-link
        to="/"
        class="w-full h-full text-white text-4xl hover:text-white"
      >
        <span class="hidden xl:block">MEME Talk</span>
        <img
          src="/logo.png"
          alt="logo"
          class="inline-block xl:hidden w-[36px]"
        />
      </router-link>
    </h1>
    <!-- TODO: 中間分頁按紐 -->
    <ul class="flex-1 flex items-center">
      <li v-for="page in routeList" :key="page.name">
        <NuxtLink
          :to="page.href"
          class="link block p-3 text-2xl font-bold text-[#222] hover:text-[tomato]"
          :class="[
            `${page.href === onRoutes ? 'text-yellow-500' : 'text-white'}`,
          ]"
          v-show="deviceName === 'unknown' || page.diveice === 'all'"
        >
          <span class="font-pop hidden sm:inline-block">{{ page.name }}</span>
          <img class="sm:hidden w-[30px]" :src="`/${page.icon}`" alt="icon" />
        </NuxtLink>
      </li>
    </ul>
    <!-- TODO: 右邊操作 -->
    <div class="flex items-center">
      <div class="hidden md:flex justify-center items-center" v-if="isHome">
        <button class="btn-reset pr-2" @click="memeRefesh(true)">
          重置迷因
        </button>
        <button
          type="button"
          class="btn-reset pr-2 text-3xl flex justify-center items-center"
          @click="memeRefesh(false)"
        >
          <el-icon
            :class="memeRefreshing ? 'animate-spin' : ''"
            style="animation-iteration-count: 1"
            ><RefreshRight
          /></el-icon>
        </button>
      </div>
      <div v-if="!isLogin">
        <button
          class="hidden md:inline-block p-0 bg-transparent border-none focus:outline-none"
          @click="emit('openUserDialog')"
        >
          <el-icon color="white" size="30px" style="vertical-align: -10%">
            <UserFilled />
          </el-icon>
        </button>
      </div>
      <router-link
        to="/Login"
        v-if="!isLogin"
        class="flex items-center md:hidden"
      >
        <el-icon color="white" size="30px" style="vertical-align: -10%">
          <UserFilled />
        </el-icon>
      </router-link>
      <div class="flex items-center" v-else>
        <div v-if="isGoogleLogin" class="text-white text-xl flex items-center">
          <img
            class="w-[45px] rounded-[50%]"
            v-if="userInfo?.photoURL"
            :src="userInfo.photoURL"
            alt="headshot"
          />
          <span class="px-2">{{ userInfo.displayName }}</span>
        </div>
        <span v-else class="text-white pr-2 text-xl leading-[30px]"
          >{{ nickname }}(遊客)</span
        >
        <button
          class="p-0 bg-transparent border-none outline-none"
          @click="logout"
        >
          <el-icon color="tomato" size="30px" style="vertical-align: -10%">
            <RemoveFilled />
          </el-icon>
        </button>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import deviceName from "../../util/mobileDetective";
import randomNumber from "~/util/randomNumber";

const props = defineProps({
  scrollOver: Boolean,
});

const { getMemeList } = useMemeList();

const userStore = useUserStore();
const { setNickname, setUserInfo, logoutFromGoogle } = userStore;
const { isLogin, isGoogleLogin, nickname, userInfo } = storeToRefs(userStore);

const memeStore = useMemeStore();
const { savaLikeIdList } = memeStore;

const emit = defineEmits(["close", "openUserDialog"]);

const routes = useRoute();

const onRoutes = computed(() => {
  return routes.path;
});

const isHome = computed(() => {
  switch (onRoutes.value) {
    case "/":
    case "/Home":
      return true;

    default:
      return false;
  }
});

const routeList = reactive([
  {
    href: "/",
    name: "首頁",
    diveice: "pc",
    icon: "home.svg",
  },
  {
    href: "/PersonSpace",
    name: "個人空間",
    diveice: "all",
    icon: "space.svg",
  },
  {
    href: "/HotMeme",
    name: "熱門迷因",
    diveice: "all",
    icon: "hot.svg",
  },
]);

const memeRefreshing = ref(false);

const memeRefesh = (reset: boolean) => {
  if (!reset) memeRefreshing.value = true;
  const page = reset ? 1 : randomNumber(1, 10);
  getMemeList(page).then((res) => {
    if (!reset) memeRefreshing.value = false;
  });
};

const logout = () => {
  setNickname("");
  savaLikeIdList([]);
  if (isGoogleLogin.value) {
    logoutFromGoogle();
    setUserInfo({
      displayName: "",
      photoURL: "",
      uid: "",
      email: "",
    });
  }
};
</script>
