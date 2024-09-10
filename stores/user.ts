import { signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import type { Auth } from "firebase/auth";

export const useUserStore = defineStore("user", () => {
  const nickname = ref("");

  const likeIdList: Ref<number[]> = ref([]);

  const cookieNickname = useCookie("nickname");

  const cookieLikeIdList = useCookie("likeIdList");

  const userList = ref([] as UserType[]);

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
      try {
        await signInWithPopup($auth as Auth, new GoogleAuthProvider());
      } catch (error) {
        console.error("Error during Google login:", error);
      }
    } else {
      console.error("Firebase Auth not initialized");
    }
  };

  const logoutFromGoogle = async () => {
    const { $auth } = useNuxtApp();
    if ($auth) {
      try {
        await signOut($auth as Auth);
        console.log("you have logouted from auth");
      } catch (error) {
        console.error("Error during Google login:", error);
      }
    } else {
      console.error("Firebase Auth not initialized");
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
