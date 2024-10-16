import { onIdTokenChanged } from "firebase/auth";
import type { Auth } from "firebase/auth";

let unsubscribe: (() => void) | null = null;

interface ApiResponse {
  data: UserType[];
}

interface ApiErrorResponse {
  error?: string;
}

export const useUser = () => {
  const userStore = useUserStore();
  const { setUserInfo, setNickname, setUserList } = userStore;
  const { userList } = storeToRefs(userStore);

  const user = useState<UserType | null>("user", () => null);

  const initialLoad = useState<boolean>("user-initial-load", () => true);

  const config = useRuntimeConfig();

  if (!initialLoad.value) {
    setNickname("");
    setUserInfo({
      displayName: "",
      photoURL: "",
      uid: "",
      email: "",
    });
    return;
  }

  const getUserList = async () => {
    try {
      const { data: users } = await useLazyAsyncData<ApiResponse>(
        "getUserList",
        () => $fetch(`${config.public.apiBaseUrl}/api/users`)
      );
      if (users.value) {
        setUserList(users.value);
      }
    } catch (error) {
      console.error("Failed to fetch user list", error);
    }
  };

  const addUser = async (userData) => {
    try {
      const { data: res } = await useAsyncData<ApiErrorResponse>(
        "addUser",
        () =>
          $fetch(`${config.public.apiBaseUrl}/api/users`, {
            method: "POST",
            body: userData,
          })
      );
      if (!res.value.error) {
        getUserList();
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

  onMounted(() => {
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
          if (!isExist(uid)) addUser({ displayName, photoURL, uid, email });
        });
      }
    }
  });

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe(); // 移除監聽器
      unsubscribe = null;
    }
  });

  return {
    user,
    getUserList,
  };
};
