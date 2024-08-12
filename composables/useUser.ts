import {
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onIdTokenChanged,
} from "firebase/auth";
export type UserType = {
  displayName: string | null;
  photoURL: string | null;
  uid: string;
  email: string | null;
};

export const useUser = () => {
  const { $auth } = useNuxtApp();

  const userStore = useUserStore();
  const { setUserInfo, setNickname } = userStore;

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

  const loginWithGoogle = async () => {
    await signInWithPopup($auth, new GoogleAuthProvider());
  };

  const logoutFromGoogle = async () => {
    await signOut($auth);
  };

  onMounted(() => {
    initialLoad.value = false;
    unsubscribe = onIdTokenChanged($auth, async (_user) => {
      if (!_user || !_user.uid) {
        user.value = null;
        return;
      }
      const { displayName, photoURL, uid, email } = _user;
      setNickname(displayName);
      setUserInfo({ displayName, photoURL, uid, email });
    });
  });

  onUnmounted(unsubscribe);

  return {
    loginWithGoogle,
    logoutFromGoogle,
  };
};
