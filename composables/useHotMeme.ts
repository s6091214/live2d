import type { MemePost } from "~/types";
import { createApiClient } from "../api";

interface ApiResponse {
  data: MemePost[];
}

export function useHotMeme() {
  const memeStore = useMemeStore();
  const { setHotMeme } = memeStore;
  const { hotMemesList } = storeToRefs(memeStore);

  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;
  const apiClient = createApiClient(apiBaseUrl);

  const { data: memes, refresh } = useAsyncData(
    "getHotMeme",
    async () => (await apiClient.getHotMemes()) as ApiResponse
  );
  if (memes.value?.data) {
    setHotMeme(memes.value.data);
  }

  return {
    refresh,
    hotMemesList,
  };
}
