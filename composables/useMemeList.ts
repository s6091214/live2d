export function useMemeList() {
  const memeStore = useMemeStore();
  const { fetchMemeData } = memeStore;

  const getMemeFromWarehouse = async () => {
    await fetchMemeData();
  };

  return {
    getMemeFromWarehouse,
  };
}
