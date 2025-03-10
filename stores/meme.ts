import type { MemePost } from "~/types";
import { apiGetMemes, createApiClient } from "../api";

export const useMemeStore = defineStore("meme", () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;
  const apiClient = createApiClient(apiBaseUrl);

  const initialStore = useInitialStore();
  const { setLoading } = initialStore;

  const memes = ref<MemePost[]>([]);

  const inhibitWords = ref([]);

  const state = reactive({
    page: 0,
    limit: 9,
  });

  const isReposOver = ref(false); // Memes 是否 load 完成

  const isLoadRepos = ref(false); // Memes 是否正在 load

  const memeList = computed(() => memes.value);

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

  const formatMemeArray = computed(() => {
    if (inhibitWords.value.length && memes.value.length) {
      const memes = memeList.value.filter((meme) => {
        let show = true;
        const title = meme.title;
        for (const word of inhibitWords.value) {
          if (title.includes(word)) {
            show = false;
            break;
          }
        }
        return show;
      });
      return memes.map((content) => {
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
    return memeList.value;
  });

  function dataFormater(list) {
    let newList = [];
    const filterString = [
      "免費救援",
      "免費援助",
      "柯文哲被押",
      "山東號、羅斯福號",
      "日本外送茶",
      "日本東京約會找靜香",
      "台海政情室",
    ];
    if (list.length) {
      newList = list.filter((content) => {
        let show = true;
        const title = content.title;
        for (const string of filterString) {
          if (title.includes(string)) {
            show = false;
            break;
          }
        }
        return show;
      });
      const memes = newList.map((content) => {
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
      memes.value = dataFormater([...memeList.value, ...res]);
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
    memeList,
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
