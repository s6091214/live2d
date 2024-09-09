<template>
  <div class="px-2 w-full">
    <div class="pt-[8vh]">
      <img src="/logo.png" alt="logo" class="inline-block w-[150px]" />
      <h2 class="text-3xl font-bold text-white pt-3">MEME TALK</h2>
    </div>
    <div
      class="md:px-[45px] xl:py-[75px] md:py-[50px] text-white flex flex-col items-center bg-white rounded"
    >
      <div>
        <h2 class="my-2 text-2xl font-bold text-black">遊客登入</h2>
        <p class="my-2 text-sm text-black">按讚可暫時可儲存貼文</p>
      </div>
      <el-form
        :model="registerForm"
        @submit.prevent="onRegister(registerRef)"
        :rules="registerRules"
        ref="registerRef"
        class="w-1/2 sm:w-[30vw] max-w-[380px]"
      >
        <el-form-item prop="nickname">
          <el-input
            v-model="registerForm.nickname"
            placeholder="暱稱"
            :max="3"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            native-type="submit"
            class="w-full mt-4"
            :disabled="globalLoading || isLogin"
          >
            創建暱稱
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
const userStore = useUserStore();
const { setNickname } = userStore;
const { isLogin } = storeToRefs(userStore);

const initialStore = useInitialStore();
const { globalLoading } = storeToRefs(initialStore);

const router = useRouter();

const registerRef = ref();

const registerRules = reactive({
  nickname: [{ required: true, message: "請輸入暱稱", trigger: "blur" }],
});

let registerForm = reactive({
  nickname: "",
});

const onRegister = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      setNickname(registerForm.nickname);
      registerForm.nickname = "";
    } else {
      console.log("error submit!", fields);
    }
  });
};

watch(isLogin, async (status) => {
  if (status) {
    router.push({ path: "/" });
  }
});
</script>

<style scoped></style>
