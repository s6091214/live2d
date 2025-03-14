<template>
  <div class="relative">
    <div class="w-full home-bg min-h-screen">
      <div
        class="mx-auto w-full px-2 overflow-x-hidden sm:px-0 sm:max-w-[630px] pt-4 md:pt-[4rem] pb-[20px] relative z-10 min-h-screen"
      >
        <!-- TODO: 文章列表 -->
        <PostComponent
          v-for="content in formatMemeArray"
          :key="content.memeId"
          :postData="content"
          @showTooltip="(target) => (buttonRef = target)"
          @handleTip="tipHandler"
        />
        <el-tooltip
          ref="tooltipRef"
          :visible="tipVisible"
          :popper-options="{
            modifiers: [
              {
                name: 'computeStyles',
                options: {
                  adaptive: false,
                  enabled: false,
                },
              },
            ],
          }"
          :virtual-ref="buttonRef"
          virtual-triggering
          popper-class="singleton-tooltip"
        >
          <template #content>
            <span>創建暱稱或Google 登入即可留言</span>
          </template>
        </el-tooltip>
        <loadRef />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import deviceName from "~/util/mobileDetective";
import loadRef from "~/components/loadRef.vue";

useHead({
  title: "迷因聊天, MEMETALK",
  meta: [
    {
      name: "description",
      content:
        "加入 MEMETALK 社群，與全球迷因愛好者一起留言互動、點讚與收藏熱門貼文。",
    },
    { property: "og:title", content: "迷因聊天, MEMETALK" },
    {
      property: "og:description",
      content:
        "加入 MEMETALK 社群，與全球迷因愛好者一起留言互動、點讚與收藏熱門貼文。",
    },
  ],
});

const initialStore = useInitialStore();
const { setLive2dInit } = initialStore;
const { live2dInitStatus } = storeToRefs(initialStore);

const memeStore = useMemeStore();
const { formatMemeArray } = storeToRefs(memeStore);
const { fetchInhibitWords } = memeStore;

const userStore = useUserStore();
const { isLogin } = storeToRefs(userStore);

declare global {
  interface Window {
    OML2D: any;
  }
}

/** 提示框 Ref */
const buttonRef = ref();

const tooltipRef = ref();

const tipVisible = ref(false);

const tipHandler = () => {
  if (isLogin.value) {
    console.log("登入狀態");
  } else {
    tipVisible.value = !tipVisible.value;
  }
};

/** 看板娘初始化 */
const live2dInit = () => {
  const OML2D = window.OML2D;
  if (OML2D && !live2dInitStatus.value) {
    OML2D.loadOml2d({
      models: [
        {
          path: "https://model.hacxy.cn/cat-black/model.json",
          scale: 0.15,
          position: [0, 20],
          stageStyle: {
            height: 350,
          },
        },
      ],
      statusBar: {
        loadingIcon: "icon-loading",
      },
      menus: {
        items: [
          {
            id: "Rest",
            icon: "icon-rest",
            title: "休息",
            onClick(oml2d) {
              // actions ...
            },
          },
          {
            id: "SwitchModel",
            icon: "icon-switch",
            title: "切换模型",
            onClick(oml2d) {
              // actions ...
            },
          },
          {
            id: "About",
            icon: "icon-about",
            title: "gtihub",
            onClick() {
              window.open("https://github.com/hacxy/l2d");
            },
          },
        ],
      },
    });
    setLive2dInit(true);
  }
};

const live2dHandler = () => {
  const OML2D = window.OML2D;
  // console.log("test", live2dInitStatus.value);
  if (!OML2D) {
    if (!live2dInitStatus.value) {
      setTimeout(() => {
        live2dInit();
      }, 1000);
    }
  } else {
    live2dInit();
  }
};

useLazyAsyncData(
  "inhibitWords",
  async () => {
    // console.log("get inhibit-words");
    await fetchInhibitWords();
    return true;
  },
  { server: false }
);

if (deviceName === "unknown") {
  useHead({
    script: [
      {
        src: "/oh-my-live2d.min.js",
        async: true,
        onload: () => {
          live2dHandler();
        },
      },
    ],
  });
}
</script>

<style scoped>
.singleton-tooltip {
  transition: transform 0.3s var(--el-transition-function-fast-bezier);
}
.home-bg {
  position: relative;
  z-index: 1;
  background: linear-gradient(
      to bottom,
      #000000,
      #0f0f0f,
      #212121,
      #2e2e2e,
      #403f3f
    )
    fixed;
}
.home-bg::before {
  opacity: 0.2;
  background: transparent url("/meme-bg.webp") fixed;
  background-position: 26% 18px;
  background-size: auto 100%;
  background-repeat: no-repeat;
  content: "";
  position: absolute;
  width: 50%;
  height: 100%;
  top: 56px;
  left: 0;
  z-index: 2;
}
.home-bg::after {
  opacity: 0.2;
  background: transparent url("/meme2.jpeg") fixed;
  background-position: 74% 18px;
  background-size: auto 100%;
  background-repeat: no-repeat;
  content: "";
  position: absolute;
  width: 50%;
  height: 100%;
  top: 56px;
  right: 0;
  z-index: 2;
}
@media screen and (max-width: 475px) {
  .home-bg::after,
  .home-bg::before {
    top: 0;
  }
}
</style>
