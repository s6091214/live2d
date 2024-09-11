export default defineNuxtPlugin((nuxtApp) => {
  // 封裝原生的 $fetch
  const customFetch = async (request, options) => {
    try {
      const response = await $fetch(request, options);
      return response;
    } catch (error) {
      // 在這裡攔截錯誤並做處理
      console.error("Fetch error:", error);

      // 根據不同的錯誤狀態碼進行處理
      if (error?.response?.status === 401) {
        console.log("Unauthorized, redirecting to login...");
        useRouter().push("/login");
      } else if (error?.response?.status === 500) {
        console.log("Internal Server Error, showing error message...");
        // 顯示錯誤通知
      }

      // 可以選擇重新拋出錯誤或返回預設值
      throw error;
    }
  };

  // 將我們自定義的 fetch 方法掛載到 nuxtApp 上
  // nuxtApp.provide('fetch', customFetch);

  // const { $fetch } = useNuxtApp();

  // const { data: res } = await useAsyncData<ApiResponse>("postLike", () =>
  //   $fetch("https://shielded-earth-43070-852d0af23eb2.herokuapp.com/api/memes", {
  //     method: "POST",
  //     body: { ...requestData },
  //   })
  // );
});
