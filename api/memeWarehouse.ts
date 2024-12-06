const apiFetch = $fetch.create({ baseURL: "https://memes.tw/wtf/api" });

export const apiGetMemes = (page: number | string) => {
  return apiFetch(`?page=${page}`);
};
