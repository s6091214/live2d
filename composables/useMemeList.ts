import type { MemePost } from "~/types";

interface ApiResponse {
  data: MemePost[];
}

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
    return memes;
  }
}

export function useMemeList(page: number = 1) {
  const memeStore = useMemeStore();
  const { setMemeList } = memeStore;

  const memePage = ref(0);

  return new Promise(async (resolve) => {
    if (memePage.value === page) return resolve(false);
    memePage.value = page;
    const { data: memes } = await useAsyncData<ApiResponse>("getMemeList", () =>
      $fetch(`https://memes.tw/wtf/api?page=${page}`)
    );
    if (memes.value) {
      const formater = dataFormater(memes.value);
      setMemeList(formater);
    }
    resolve(true);
  });
}
