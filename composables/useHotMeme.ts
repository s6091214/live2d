import type { MemePost } from "~/types";

interface ApiResponse {
  data: MemePost[];
}

export function useHotMeme() {
  const memeStore = useMemeStore();

  const getHotMeme = async () => {
    try {
      const { data: memes } = await useAsyncData<ApiResponse>(
        "getHotMeme",
        () =>
          $fetch(
            "https://shielded-earth-43070-852d0af23eb2.herokuapp.com/api/memes"
          )
      );

      if (memes?.value.data) {
        memeStore.setHotMeme(memes.value.data);
      }
    } catch (error) {
      console.error("Error fetching memes:", error);
    }
  };

  return {
    getHotMeme,
  };
}
