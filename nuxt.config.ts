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
        { property: "og:url", content: "http://localhost:3000/" },
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
      apiKey: process.env.apiKey,
      authDomain: process.env.authDomain,
      databaseURL: process.env.databaseURL,
      projectId: process.env.projectId,
      storageBucket: process.env.storageBucket,
      messagingSenderId: process.env.messagingSenderId,
      appId: process.env.appId,
      measurementId: process.env.measurementId,
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
  // nitro: {
  //   plugins: ["~/server/db/index.ts"],
  // },
});
