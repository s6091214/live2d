import deviceName from "../util/mobileDetective";
import { useInitialStore } from "~/stores/initial";
import { useUserStore } from "~/stores/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const initialStore = useInitialStore();
  const { handleSignDialog, addAlert } = initialStore;

  const userStore = useUserStore();
  const { isLogin } = storeToRefs(userStore);

  const nicknameCookie = useCookie("nickname");
  const nickname = nicknameCookie.value;

  if (!isLogin.value) {
    if (deviceName === "unknown" && !nickname) {
      addAlert({ type: "error", msg: "請先創建暱稱" });
      handleSignDialog(true);
      if (from && from.fullPath !== to.fullPath) {
        return navigateTo(from.fullPath || "/");
      }
    } else if (!nickname) {
      return navigateTo("/login");
    }
  }
});
