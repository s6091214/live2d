import { signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import type { Auth } from "firebase/auth";

export const useUserStore = defineStore("user", () => {
  const nickname = ref("");

  const cookieNickname = useCookie("nickname");

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

  const googleUid = computed(() => {
    if (isGoogleLogin.value) {
      return userInfo.value.uid;
    }
    return null;
  });

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
  });

  return {
    nickname,
    userInfo,
    isLogin,
    isGoogleLogin,
    googleUid,
    userList,
    setUserInfo,
    setNickname,
    setUserList,
    loginWithGoogle,
    logoutFromGoogle,
  };
});
