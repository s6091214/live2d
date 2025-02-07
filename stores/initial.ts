export const useInitialStore = defineStore("initial", () => {
  const alerts = ref([]);

  const globalLoading = ref(false);

  const signDialog = ref(false);

  const signDialogStatus = computed(() => signDialog.value);

  const live2dInitStatus = ref(false);

  const setLive2dInit = (value: boolean) => {
    live2dInitStatus.value = value;
  };

  const addAlert = ({ msg, type }) => {
    const vm = this;
    if (msg && msg !== "") {
      alerts.value.unshift({ msg, type });
    }
    let time = 0;
    if (alerts.value.length === 1) time = 3000;
    setTimeout(() => {
      alerts.value.pop();
    }, time);
  };

  const setLoading = (payload: boolean) => {
    globalLoading.value = payload;
  };

  const handleSignDialog = (payload: boolean) => {
    signDialog.value = payload;
  };

  return {
    alerts,
    globalLoading,
    signDialogStatus,
    live2dInitStatus,
    setLoading,
    handleSignDialog,
    addAlert,
    setLive2dInit,
  };
});
