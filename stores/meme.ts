import type { MemePost } from "~/types";

export const useMemeStore = defineStore("meme", () => {
  let memes = ref([]);
  let hotMemes = ref([]);

  const memeList = computed(() => memes.value);

  const hotMemesList = computed(() => {
    const list = hotMemes.value
      .filter((meme) => meme.memeId)
      .map((memeData) => ({
        ...memeData,
      }));
    return list.sort((a: MemePost, b: MemePost) => {
      const timestampA = new Date(a.created_date).getTime() || 0;
      const timestampB = new Date(b.created_date).getTime() || 0;
      return timestampB - timestampA;
    });
  });

  const likeIdList: Ref<number[]> = ref([]);

  const cookieLikeIdList = useCookie("likeIdList");

  const savaLikeIdList = (payload: number | number[]) => {
    let newList = [...likeIdList.value];
    if (typeof payload === "number") newList.push(payload);
    else newList = payload;
    likeIdList.value = newList;
    cookieLikeIdList.value = newList.join(",");
  };

  const setMemeList = (list) => {
    if (list && Array.isArray(list)) {
      if (memes.value.length) {
        const newList = memes.value.concat(list);
        memes.value = newList;
      } else memes.value = list;
    }
  };

  const setHotMeme = (list) => {
    if (list && list.length) hotMemes.value = list;
  };

  onMounted(() => {
    if (cookieLikeIdList?.value) {
      const cookie = cookieLikeIdList.value.toString();
      const saveData = cookie.split(",");
      likeIdList.value = saveData.map((item) => {
        try {
          return Number(item);
        } catch (error) {
          return 0;
        }
      });
    }
  });

  return {
    memeList,
    hotMemesList,
    likeIdList,
    setMemeList,
    setHotMeme,
    savaLikeIdList,
  };
});
