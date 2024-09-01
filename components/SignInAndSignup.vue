<template>
  <div
    class="fixed left-0 top-0 z-20 w-full h-full justify-center pt-[100px] hidden"
    :class="{ 'sm:flex': signDialog && !isLogin }"
    @click="closeDialog"
  >
    <div
      @click.stop="() => {}"
      class="w-[96%] md:w-[80%] h-[300px] rounded-[3px] relative"
      @mousedown="setMouseTime"
      @mouseup="setMouseTime"
    >
      <div
        class="flex w-full h-full"
        style="background-color: rgba(34, 34, 34, 0.85)"
      >
        <div
          class="flex-1 px-3 md:px-[45px] xl:py-[75px] md:py-[50px] text-white flex flex-col justify-between"
        >
          <span class="inline-block md:hidden"></span>
          <div>
            <h2 class="mb-4 text-2xl">遊客登入</h2>
            <p class="text-sm">按讚可暫時可儲存貼文</p>
          </div>
          <el-button
            type="danger"
            plain
            class="self-baseline w-full md:w-[100px] mb-2 md:mb-0"
            @click="signType = 'register'"
            >切換</el-button
          >
        </div>
        <div
          class="flex-1 px-3 md:px-[45px] xl:py-[75px] md:py-[50px] text-white flex flex-col justify-between"
        >
          <span class="inline-block md:hidden"></span>
          <div>
            <h2 class="mb-4 text-2xl">第三方登入</h2>
            <p class="text-sm">登入可使用更多功能</p>
          </div>
          <el-button
            type="danger"
            plain
            class="self-baseline w-full md:w-[100px] mb-2 md:mb-0"
            @click="signType = 'login'"
            >切換</el-button
          >
        </div>
      </div>
      <div
        class="absolute left-0 xl:left-[30px] top-[50%] xl:min-h-[420px] md:min-h-[350px] rounded-[3px] overflow-hidden bg-white flex justify-center items-center flex-col"
        :class="`${
          signType === 'login'
            ? 'animate-[bounce-right_1s_forwards]'
            : 'animate-[bounce-left_1s_forwards]'
        }`"
        :style="{
          width: deviceName === 'unknown' ? 'calc(50% - 30px)' : '50%',
          boxShadow: '2px 0 15px rgba(0, 0, 0, 0.25)',
          transition: 'transform 0.4s ease-in-out',
        }"
      >
        <div
          class="sm:w-[80%] absolute left-[10%] top-[20%]"
          style="transition: all 0.4s ease-in-out"
          :style="
            signType === 'login'
              ? {
                  transform: 'translate3d(0, 0, 0)',
                  opacity: 1,
                  visibility: 'visible',
                }
              : {
                  transform: 'translate3d(-120px, 0, 0)',
                  opacity: 0,
                  visibility: 'hidden',
                }
          "
        >
          <h2
            class="text-rose-400 text-2xl xl:mb-12 md:mb-4 font-bold select-none"
          >
            Gmail 驗證登入
          </h2>
          <div>
            <el-button
              type="danger"
              native-type="button"
              class="w-[120px]"
              @click="loginWithGoogle"
              disabled
            >
              跳轉
            </el-button>
            <p class="text-[#222] pt-3">
              Gmail 驗證只紀錄 id 及大頭貼顯示用，不做其他用途，敬請放心使用。
            </p>
          </div>
        </div>
        <div
          class="w-[80%]"
          style="transition: all 0.4s ease-in-out"
          :style="
            signType === 'register'
              ? {
                  transform: 'translate3d(0, 0, 0)',
                  opacity: 1,
                  visibility: 'visible',
                }
              : {
                  transform: 'translate3d(120px, 0, 0)',
                  opacity: 0,
                  visibility: 'hidden',
                }
          "
        >
          <h2
            class="text-rose-400 text-2xl xl:mb-12 md:mb-4 font-bold select-none"
          >
            遊客登入
          </h2>
          <el-form
            :model="registerForm"
            @submit.prevent="onRegister(registerRef)"
            :rules="registerRules"
            ref="registerRef"
          >
            <el-form-item prop="nickname">
              <el-input
                v-model="registerForm.nickname"
                placeholder="暱稱"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="danger"
                native-type="submit"
                class="w-[120px] mt-4"
                :disabled="globalLoading"
              >
                創建暱稱
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import deviceName from "../util/mobileDetective";

const userStore = useUserStore();
const { setNickname } = userStore;
const { isLogin } = storeToRefs(userStore);

const { loginWithGoogle } = useUser();

defineProps({
  signDialog: Boolean,
});

const initialStore = useInitialStore();
const { globalLoading } = storeToRefs(initialStore);

const emit = defineEmits(["close"]);

const mousedownTime = ref(0);
const mouseupTime = ref(0);

const closeDialog = () => {
  const timedifference = mouseupTime.value - mousedownTime.value;
  if (timedifference >= 0) emit("close");
  mousedownTime.value = 0;
  mouseupTime.value = 0;
};

const setMouseTime = ($event) => {
  if ($event.type === "mousedown") {
    mousedownTime.value = new Date().getTime();
  }
  if ($event.type === "mouseup") {
    mouseupTime.value = new Date().getTime();
  }
};

const signType = ref("register");

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
</script>

<style scoped>
:deep(.el-input__wrapper) {
  border: none;
}
</style>
