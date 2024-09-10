import { onIdTokenChanged } from "firebase/auth";
import type { Auth } from "firebase/auth";

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

  let unsubscribe = null;

  const getUserList = async () => {
    const { data: users } = await useAsyncData<ApiResponse>("getUserList", () =>
      // $fetch("/api/user")
      $fetch(
        "https://shielded-earth-43070-852d0af23eb2.herokuapp.com/api/users"
      )
    );
    if (users.value) {
      setUserList(users.value);
    }
  };

  const addUser = async (userData) => {
    const { data: res } = await useAsyncData<ApiErrorResponse>("addUser", () =>
      // /api/user/create
      $fetch(
        "https://shielded-earth-43070-852d0af23eb2.herokuapp.com/api/users",
        {
          method: "POST",
          body: { ...userData },
        }
      )
    );
    if (!res.value.error) {
      getUserList();
    }
  };

  const isExist = (uid: string) => {
    const uidList = userList.value.map((user) => user.uid);
    if (uidList.includes(uid)) {
      return true;
    }
    return false;
  };

  onMounted(() => {
    const { $auth } = useNuxtApp();
    initialLoad.value = false;
    console.log($auth);
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
  });

  onUnmounted(unsubscribe);

  return {
    user,
    getUserList,
  };
};
