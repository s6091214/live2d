import type { NuxtConfig } from "nuxt/schema";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";

// https://nuxt.com/docs/api/configuration/nuxt-config
const config: NuxtConfig = {
  app: {
    head: {
      viewport: "width=device-width,initial-scale=1.0",
      title: "迷因聊天, MEMETALK",
      meta: [
        {
          name: "description",
          content:
            "加入 MEMETALK 社群，與全球迷因愛好者一起留言互動、點讚與收藏熱門貼文。",
        },
        { property: "og:title", content: "迷因聊天, MEMETALK" },
        { property: "og:url", content: "https://live2d-two.vercel.app/" },
        {
          property: "og:description",
          content:
            "加入 MEMETALK 社群，與全球迷因愛好者一起留言互動、點讚與收藏熱門貼文。",
        },
        {
          property: "og:image",
          content: "https://live2d-two.vercel.app/og-image.png",
        },
        {
          name: "google-site-verification",
          content: "9SF0DnY0VkwDUx0m43hTCwoEDRdIhlaDiW8IhREz6xw",
        },
      ],
      link: [
        {
          rel: "canonical",
          href: "https://live2d-two.vercel.app/",
        },
      ],
      script: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            url: "https://live2d-two.vercel.app/",
            name: "MEMETALK",
            potentialAction: {
              "@type": "SearchAction",
              target:
                "https://live2d-two.vercel.app/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
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
  vite: {
    plugins: [
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "assets/icons")],
        symbolId: "[dir]/[name]",
        customDomId: "__svg__icons__dom__",
      }),
    ],
    server: {
      proxy: {},
      watch: {
        usePolling: true,
      },
    },
  },
  nitro: {
    devProxy: {
      "/api": {
        target: "https://postgresql-prisma-912342912109.asia-east1.run.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    } as any,
  },
};

export default defineNuxtConfig(config);
