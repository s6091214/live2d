import type { MemePost } from "~/types";
interface ApiResponse {
  data: MemePost[];
}

export const useMemeStore = defineStore("meme", () => {
  let memes = ref([]);
  let hotMemes = ref([]);

  const memeList = computed(() => memes.value);

  const hotMemesList = computed(() => {
    const list = hotMemes.value
      .filter((meme) => meme.id)
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
    if (list && list.length) {
      memes.value = list;
    }
  };

  const setHotMeme = (list) => {
    if (list && list.length) hotMemes.value = list;
  };

  const getMemeList = async (page: number = 1) => {
    function dataFormater(list) {
      let newList = [];
      const filterString = ["免費救援", "免費援助", "柯文哲被押"];
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
        setMemeList(memes);
      }
    }
    const { data: memes } = await useAsyncData<ApiResponse>("getMemeList", () =>
      $fetch(`https://memes.tw/wtf/api?page=${page}`)
    );
    if (memes.value) {
      dataFormater(memes.value);
    }
  };

  const getHotMeme = async () => {
    const { data: memes } = await useAsyncData<ApiResponse>(
      "getHotMemeList",
      () =>
        // $fetch("/api/meme")
        $fetch(
          "https://shielded-earth-43070-852d0af23eb2.herokuapp.com/api/memes"
        )
    );

    if (memes.value?.data) {
      setHotMeme(memes.value.data);
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
    setMemeList,
    getMemeList,
    setHotMeme,
    getHotMeme,
    savaLikeIdList,
  };
});
