import { signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";

export const useUserStore = defineStore("user", () => {
  const nickname = ref("");

  const likeIdList: Ref<number[]> = ref([]);

  const cookieNickname = useCookie("nickname");

  const cookieLikeIdList = useCookie("likeIdList");

  const userList = ref([]);

  const userInfo = ref({} as UserType);

  const setUserInfo = (userData) => {
    userInfo.value = userData;
  };

  const setUserList = (users) => {
    userList.value = users;
  };

  const setNickname = (name: string) => {
    if (typeof name === "string") {
      nickname.value = name;
      cookieNickname.value = name;
    }
  };

  const isLogin = computed(() => {
    if (nickname.value && nickname.value !== "") return true;
    return false;
  });

  const isGoogleLogin = computed(() => {
    if (userInfo.value.uid !== "" && Object.keys(userInfo.value).length)
      return true;
    return false;
  });

  const savaLikeIdList = (payload: number | number[]) => {
    let newList = [...likeIdList.value];
    if (typeof payload === "number") newList.push(payload);
    else newList = payload;
    likeIdList.value = newList;
    cookieLikeIdList.value = newList.join(",");
  };

  const loginWithGoogle = async () => {
    const { $auth } = useNuxtApp();
    if ($auth) {
      await signInWithPopup($auth, new GoogleAuthProvider());
    }
  };

  const logoutFromGoogle = async () => {
    const { $auth } = useNuxtApp();
    if ($auth) {
      await signOut($auth);
    }
  };

  onMounted(() => {
    if (cookieNickname?.value) {
      nickname.value = cookieNickname.value;
    }
    if (cookieLikeIdList?.value) {
      const cookie = cookieLikeIdList.value.toString();
      const saveData = cookie.split(",");
      likeIdList.value = saveData.map((item) => {
        try {
          return Number(item);
        } catch (error) {
          return 0;
        }
      });
    }
  });

  return {
    nickname,
    likeIdList,
    userInfo,
    isLogin,
    isGoogleLogin,
    userList,
    setUserInfo,
    setNickname,
    savaLikeIdList,
    setUserList,
    loginWithGoogle,
    logoutFromGoogle,
  };
});
