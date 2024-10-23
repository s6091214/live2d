import deviceName from "../util/mobileDetective";
import { useInitialStore } from "~/stores/initial";
import { useUserStore } from "~/stores/user";

export default defineNuxtRouteMiddleware((to, from) => {
  const initialStore = useInitialStore();
  const { handleSignDialog, addAlert } = initialStore;

  const userStore = useUserStore();
  const { isLogin } = storeToRefs(userStore);

  if (!isLogin.value) {
    // console.log(from);
    if (deviceName === "unknown") {
      addAlert({ type: "error", msg: "請先創建暱稱" });
      handleSignDialog(true);
      return navigateTo(from?.fullPath || "/");
    } else {
      return navigateTo("/login");
    }
  }
});
