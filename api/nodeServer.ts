export const createApiClient = (baseURL: string) => {
  const apiFetch = $fetch.create({ baseURL });

  return {
    getHotMemes: () => apiFetch("/api/hot-meme"),
    getUsers: () => apiFetch("/api/users"),
    createUser: (userData: any) =>
      apiFetch("/api/users", {
        method: "POST",
        body: userData,
      }),
    getInhibitWords: () => apiFetch("/api/inhibit-words"),
    // Add more API methods here as needed
  };
};
