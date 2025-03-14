import type { MemePost } from "~/types";
import { apiGetMemes, createApiClient } from "../api";

export const useMemeStore = defineStore("meme", () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;
  const apiClient = createApiClient(apiBaseUrl);

  const initialStore = useInitialStore();
  const { setLoading } = initialStore;

  const memes = ref<MemePost[]>([]);

  const memesFromApi = computed(() => memes.value);

  const inhibitWords = ref([]);

  const state = reactive({
    page: 0,
    limit: 9,
  });

  const isReposOver = ref(false); // Memes 是否 load 完成

  const isLoadRepos = ref(false); // Memes 是否正在 load

  const addPage = () => {
    state.page++;
  };

  const hotMemes = ref([]);

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

  const hotMemeIds = computed(() => {
    if (hotMemesList?.value?.length) {
      return hotMemesList.value.map((meme) => meme.memeId);
    }
    return [];
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

  const setHotMeme = (list) => {
    if (list && list.length) hotMemes.value = list;
  };

  const letterRegex = /\p{L}/u;
  const allowedRegex = /[A-Za-z\u4e00-\u9fa5]/;

  // 檢查是否全為中文或英文 (包含空白)
  function isChineseOrEnglish(meme) {
    // 逐一檢查 title 裡的每個字元
    for (const char of meme.title) {
      // 如果這個字元屬於任意語言的字母
      if (letterRegex.test(char) && !allowedRegex.test(char)) {
        // 檢查是否為英文字母或中文（基本中文字範圍）
        return false;
      }
    }
    return true;
  }

  function filterInhitbitWords(meme) {
    let show = true;
    const title = meme.title;

    if (inhibitWords.value.length) {
      for (const word of inhibitWords.value) {
        if (title.includes(word)) {
          show = false;
          break;
        }
      }
    }

    return show;
  }

  const formatMemeArray = computed(() => {
    if (memes.value.length) {
      let result = memes.value
        .filter(isChineseOrEnglish)
        .filter(filterInhitbitWords);

      return result.map((content) => {
        const meme = {
          ...content,
          tags: content.hashtag
            ? content.hashtag.split(" ").map((tag, index) => ({
                title: tag,
                id: `meme${content.memeId}-tag${index}`,
              }))
            : [],
          created_date: content.created_at?.date_time_string
            ? content.created_at.date_time_string
            : "",
          liked_user: [],
        };
        return meme;
      });
    }
    return memes.value;
  });

  function dataFormater(list) {
    if (list.length) {
      const memes = list.map((content) => {
        const meme = {
          ...content,
          memeId: content.id,
          tags: content.hashtag
            ? content.hashtag.split(" ").map((tag, index) => ({
                title: tag,
                id: `meme${content.id}-tag${index}`,
              }))
            : [],
          created_date: content.created_at?.date_time_string
            ? content.created_at.date_time_string
            : "",
          liked_user: [],
        };
        return meme;
      });
      return memes;
    }
    return [];
  }

  const fetchInhibitWords = async () => {
    try {
      const res = await apiClient.getInhibitWords();
      // console.log("res", res);
      if (Array.isArray(res)) {
        inhibitWords.value = res.map((word) => word.word);
      } else {
        console.error("Expected an array but got:", res);
      }
      return res;
    } catch (error) {
      console.error("Error fetching inhibit words:", error);
    }
  };

  const fetchMemeData = async () => {
    if (isReposOver.value) return;
    if (isLoadRepos.value) return;
    isLoadRepos.value = true;
    addPage();
    const res = await apiGetMemes(state.page);
    if (Array.isArray(res)) {
      memes.value = dataFormater([...memes.value, ...res]);
    } else {
      console.error("Expected an array but got:", res);
    }
    isLoadRepos.value = false;
    isReposOver.value = memes.value.length < state.limit;
    return;
  };

  const fetchHotMemeData = async () => {
    try {
      const memes = (await apiClient.getHotMemes()) as { data: MemePost[] };
      if (memes?.data) {
        setHotMeme(memes.data);
      }
    } catch (error) {
      console.error("Error fetching memes:", error);
    }
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
    memesFromApi,
    hotMemesList,
    likeIdList,
    setHotMeme,
    savaLikeIdList,
    fetchMemeData,
    fetchHotMemeData,
    fetchInhibitWords,
    isLoadRepos,
    isReposOver,
    hotMemeIds,
    inhibitWords,
    formatMemeArray,
  };
});
