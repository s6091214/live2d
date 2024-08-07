<template>
  <header
    :class="`relative z-10 text-center shadow flex px-3 justify-between ${
      scrollOver
        ? 'sticky top-0 left-0 z-[10] bg-[#870000] animate-[slide-down_1s_ease-in-out] pr-5'
        : 'bg-[#000]'
    }`"
  >
    <h1 class="font-bold py-1 text-[0px] xl:text-5xl">
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
    <div class="flex items-center" v-if="!isLogin">
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
      <span class="text-white pr-2 text-xl leading-[30px]" v-if="cookie"
        >{{ cookie }}(遊客)</span
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
  </header>
</template>

<script setup>
const cookie = useCookie("nickname");

const props = defineProps({
  scrollOver: Boolean,
});

const emit = defineEmits(["close"]);

const isLogin = computed(() => {
  const nickname = cookie?.value || "";
  return nickname && nickname !== "";
});

const logout = () => {
  if (cookie?.value) {
    cookie.value = "";
  }
};
</script>
