import type { MemePost } from "~/types";

interface ApiResponse {
  data: MemePost[];
}

export function useHotMeme() {
  const memeStore = useMemeStore();
  const { setHotMeme } = memeStore;

  const initialStore = useInitialStore();
  const { setLoading } = initialStore;

  const config = useRuntimeConfig();

  const getHotMeme = async (setload: boolean = false) => {
    if (setload) setLoading(true);
    try {
      const { data: memes } = await useAsyncData<ApiResponse>(
        "getHotMeme",
        () => $fetch(`${config.public.apiBaseUrl}/api/hot-meme`)
      ).finally(() => {
        if (setload) setLoading(false);
      });
      if (memes?.value?.data) {
        setHotMeme(memes.value.data);
      }
    } catch (error) {
      console.error("Error fetching memes:", error);
    }
  };

  return {
    getHotMeme,
  };
}
