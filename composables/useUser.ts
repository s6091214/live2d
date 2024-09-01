import { onIdTokenChanged } from "firebase/auth";

export const useUser = () => {
  const userStore = useUserStore();
  const { setUserInfo, setNickname, setUserList } = userStore;

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
    const { data: users } = await useAsyncData("getUserList", () =>
      $fetch("/api/user")
    );
    if (users.value) {
      setUserList(users.value);
    }
  };

  const addUser = async (userData) => {
    const { data: res } = await useAsyncData("addUser", () =>
      $fetch("/api/user/create", {
        method: "POST",
        body: { ...userData },
      })
    );
    if (res.value.status) {
      getUserList();
    }
  };

  onMounted(async () => {
    const { $auth } = useNuxtApp();
    initialLoad.value = false;
    unsubscribe = onIdTokenChanged($auth, async (_user) => {
      if (!_user || !_user.uid) {
        user.value = null;
        return;
      }
      const { displayName, photoURL, uid, email } = _user;
      setNickname(displayName);
      setUserInfo({ displayName, photoURL, uid, email });
      addUser({ displayName, photoURL, uid, email });
    });
  });

  onUnmounted(unsubscribe);

  return {
    user,
  };
};
