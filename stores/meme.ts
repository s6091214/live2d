export const useMemeStore = defineStore('meme', () => {
  let memes = ref([])

  const memeList = computed(() => memes.value)

  const setMemeList = (list) => {
    if (list && list.length) {
      memes.value = list;
    }
  }

  return {
    memeList, setMemeList
  }
})