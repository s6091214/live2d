import { signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { createApiClient } from "../api";
import { onIdTokenChanged } from "firebase/auth";
import type { Auth } from "firebase/auth";
import type { UserType } from "../types";

interface ApiErrorResponse {
  error?: string;
}

let unsubscribe: (() => void) | null = null;

export const useUserStore = defineStore("user", () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;
  const apiClient = createApiClient(apiBaseUrl);

  const initialLoad = ref(true);

  const authReady = ref(false);

  const nickname = ref("");

  const cookieNickname = useCookie("nickname");

  const user = ref(null as UserType | null);

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

  const fetchUsersData = async () => {
    if (import.meta.client) {
      try {
        const users = await apiClient.getUsers();
        if (users) {
          userList.value = users as UserType[];
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
  };

  const fetchCreateUser = async (userData) => {
    try {
      const res = (await apiClient.createUser(userData)) as ApiErrorResponse;

      if (!res.error) {
        fetchUsersData();
      }
    } catch (error) {
      console.error("Failed to add user", error);
    }
  };

  const isExist = (uid: string) => {
    const uidList = userList.value.map((user) => user.uid);
    if (!uidList.length || uidList.includes(uid)) {
      return true;
    }
    return false;
  };

  const initializeAuth = async () => {
    const { $auth } = useNuxtApp();
    if (!$auth) {
      authReady.value = true; // 如果 Firebase 未配置，直接標記完成
      return;
    }
    if (cookieNickname?.value) {
      nickname.value = cookieNickname.value;
    }
    if (initialLoad.value) {
      const { $auth } = useNuxtApp();
      initialLoad.value = false;
      if ($auth) {
        unsubscribe = onIdTokenChanged($auth as Auth, async (_user) => {
          if (!_user || !_user.uid) {
            user.value = null;
            return;
          }
          const { displayName, photoURL, uid, email } = _user;
          setNickname(displayName);
          setUserInfo({ displayName, photoURL, uid, email });

          if (!isExist(uid)) {
            fetchCreateUser({ displayName, photoURL, uid, email });
          }
        });

        authReady.value = true;
      }
    }
  };

  const cleanup = () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  };

  return {
    nickname,
    userInfo,
    isLogin,
    isGoogleLogin,
    googleUid,
    userList,
    authReady,
    setUserInfo,
    setNickname,
    setUserList,
    loginWithGoogle,
    logoutFromGoogle,
    fetchUsersData,
    cleanup,
    initializeAuth,
  };
});
