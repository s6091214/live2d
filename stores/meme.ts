export const useMemeStore = defineStore('meme', () => {
  let memes = ref([])

  const memeList = computed(() => memes.value)

  const setMemeList = (list) => {
    if (list && list.length) {
      memes.value = list;
    }
  }

  const getMemeList = () => {
    fetch("https://memes.tw/wtf/api")
      .then((res) => res.json())
      .then((json) => {
        if (json && json.length) {
          const filterString = ["免費救援", "免費援助"];
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
              tags: content.hashtag
                ? content.hashtag.split(" ").map((tag, index) => ({
                    title: tag,
                    id: `meme${content.id}-tag${index}`,
                  }))
                : [],
              created_at_f: content.created_at?.date_time_string
                ? content.created_at.date_time_string.split(" ")[0]
                : "",
            };
            return meme;
          });
          setMemeList(memes);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return {
    memeList, setMemeList, getMemeList
  }
})