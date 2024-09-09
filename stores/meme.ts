import type { MemePost } from "~/types";

export const useMemeStore = defineStore("meme", () => {
  let memes = ref([]);
  let hotMemes = ref([]);

  const memeList = computed(() => memes.value);
  const hotMemesList = computed(() => {
    const list = hotMemes.value
      .filter((meme) => meme.id)
      .map((memeData) => ({
        ...memeData,
        created_date: memeData.created_date,
      }));
    return list.sort((a: MemePost, b: MemePost) => {
      const timestampA = new Date(a.created_date).getTime() || 0;
      const timestampB = new Date(b.created_date).getTime() || 0;
      return timestampB - timestampA;
    });
  });

  const setMemeList = (list) => {
    if (list && list.length) {
      memes.value = list;
    }
  };

  const setHotMeme = (list) => {
    if (list && list.length) hotMemes.value = list;
  };

  const getMemeList = () => {
    fetch("https://memes.tw/wtf/api")
      .then((res) => res.json())
      .then((json) => {
        if (json && json.length) {
          const filterString = ["免費救援", "免費援助", "柯文哲被押"];
          const filterArray = json.filter((content) => {
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
          // console.log(filterArray);
          const memes = filterArray.map((content) => {
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
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return {
    memeList,
    hotMemesList,
    setMemeList,
    getMemeList,
    setHotMeme,
  };
});
