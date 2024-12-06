import type { MemePost } from "~/types";

interface ApiResponse {
  data: MemePost[];
}

function dataFormater(list) {
  let newList = [];
  const filterString = [
    "免費救援",
    "免費援助",
    "柯文哲被押",
    "Xem đá gà trực tiếp tại thomo hôm nay",
    "山東號、羅斯福號",
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

export function useMemeList() {
  const initialStore = useInitialStore();
  const { setLoading } = initialStore;
  const { globalLoading } = storeToRefs(initialStore);

  const memeStore = useMemeStore();
  const { setMemeList, fetchMemeData } = memeStore;

  const memePage = ref(1);

  const getMemeList = () => {
    return new Promise(async (resolve) => {
      const { data: memes } = await useAsyncData<ApiResponse>(
        "getMemeList",
        () => $fetch(`https://memes.tw/wtf/api?page=${memePage.value}`)
      );
      if (memes.value) {
        const formater = dataFormater(memes.value);
        setMemeList(formater);
        if (import.meta.client) {
          localStorage.setItem("memePage", memePage.value.toString());
        }
      }
      resolve(true);
    });
  };

  const addMemePage = async () => {
    if (globalLoading.value || memePage.value >= 5) return;
    setLoading(true);
    memePage.value += 1;
    await getMemeList();
    setLoading(false);
  };

  const getMemeFromWarehouse = async () => {
    await fetchMemeData();
  };

  onMounted(() => {
    const storeMemePage = localStorage.getItem("memePage");
    if (storeMemePage) {
      try {
        memePage.value = Number(storeMemePage);
      } catch (error) {
        memePage.value = 1;
        setMemeList([]);
      }
    }
  });

  return {
    memePage,
    getMemeList,
    addMemePage,
    getMemeFromWarehouse,
  };
}
