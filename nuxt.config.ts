// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      viewport: "width=device-width,initial-scale=1.0",
      title: "迷因聊天, MEMETALK",
      meta: [
        {
          name: "description",
          content: "迷因、社群、貼文、留言、點讚和收藏",
        },
        { property: "og:title", content: "MEMETALK 用迷因來聊天的社群" },
        { property: "og:url", content: "http://localhost:9527/" },
        {
          property: "og:description",
          content: "MEMES, SNS, Post, COMMENTS, LIKE and COLLECT",
        },
        {
          name: "google-site-verification",
          content: "9SF0DnY0VkwDUx0m43hTCwoEDRdIhlaDiW8IhREz6xw",
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiKey: process.env.NUXT_PUBLIC_API_KEY,
      authDomain: process.env.NUXT_PUBLIC_AUTH_DOMAIN,
      projectId: process.env.NUXT_PUBLIC_PROJECT_ID,
      storageBucket: process.env.NUXT_PUBLIC_STORAGE_BUCKET,
      messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NUXT_PUBLIC_APP_ID,
      measurementId: process.env.NUXT_PUBLIC_MEASUREMENT_ID,
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
    },
    dev: process.env.NODE_ENV !== "production",
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  //TS支援
  typescript: {
    strict: false,
    typeCheck: true,
  },
  //鉤子
  hooks: {
    //改路由
    "pages:extend"(_Pages) {
      _Pages.push({
        name: "首頁",
        path: "/",
        file: "~/pages/Home.vue",
      });
    },
  },
  modules: ["@pinia/nuxt", "@element-plus/nuxt"],
  imports: {
    dirs: ["stores"],
  },
  components: {
    dirs: [
      {
        path: "~/components/global/",
        global: true,
      },
    ],
  },
});
