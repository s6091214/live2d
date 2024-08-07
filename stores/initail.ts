export const useInitialStore = defineStore("initial", () => {
  const alerts = ref([])

  const loading = ref(false)

  const signDialog = ref(false)

  const globalLoading = computed(() => loading.value)

  const signDialogStatus = computed(() => signDialog.value)

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
  }

  const setLoading = (payload: boolean) => {
    loading.value = payload
  }

  const handleSignDialog = (payload: boolean) => {
    signDialog.value = payload
  }

  return {
    alerts, globalLoading, signDialogStatus, setLoading, handleSignDialog, addAlert
  }
})