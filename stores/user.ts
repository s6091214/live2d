export const useUserStore = defineStore('user', () => {
  const nickname = ref('');

  const likeIdList: Ref<number[]> = ref([])

  const cookieNickname = useCookie('nickname');

  const cookieLikeIdList = useCookie("likeIdList");

  const setNickname = (name: string) => {
    if (typeof name === 'string') {
      nickname.value = name;
      cookieNickname.value = name;
    }
  }

  const isLogin = computed(() => {
    if (nickname.value && nickname.value !== '') return true
    return false
  })

  const savaLikeIdList = (payload: number | number[] ) => {
    let newList = [...likeIdList.value];
    if (typeof payload === 'number') newList.push(payload)
    else newList = payload
    likeIdList.value = newList;
    cookieLikeIdList.value = newList.join(",");
  }

  onMounted(() => {
    if(cookieNickname?.value) {
      nickname.value = cookieNickname.value
    }
    if(cookieLikeIdList?.value) {
      const cookie = cookieLikeIdList.value.toString();
      const saveData = cookie.split(",");
      likeIdList.value = saveData.map(item => {
        try {
          return Number(item)
        } catch (error) {
          return 0
        }
      });
    }
  })

  return { nickname, likeIdList, isLogin, setNickname, savaLikeIdList }
})