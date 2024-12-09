import deviceName from "../util/mobileDetective";
import { useInitialStore } from "~/stores/initial";
import { useUserStore } from "~/stores/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const initialStore = useInitialStore();
  const { handleSignDialog, addAlert } = initialStore;

  const userStore = useUserStore();
  const { initializeAuth } = userStore;
  const { isLogin, authReady } = storeToRefs(userStore);

  if (!authReady.value) {
    initializeAuth();
  }

  if (!isLogin.value && authReady.value) {
    if (deviceName === "unknown") {
      addAlert({ type: "error", msg: "請先創建暱稱" });
      handleSignDialog(true);
      if (from && from.fullPath !== to.fullPath) {
        return navigateTo(from.fullPath || "/");
      }
    } else {
      return navigateTo("/login");
    }
  }
});
