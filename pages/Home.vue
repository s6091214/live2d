<template>
  <div class="relative">
    <div class="w-full home-bg min-h-screen">
      <div
        class="mx-auto w-full px-2 sm:px-0 sm:max-w-[630px] pt-[4rem] pb-[20px] relative z-10 min-h-screen"
      >
        <!-- TODO: 文章列表 -->
        <PostComponent
          v-for="content in memeList"
          :key="content.id"
          :postData="content"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCookie } from "#imports";
import deviceName from "../util/mobileDetective";

const memeStore = useMemeStore();
const { setMemeList } = memeStore;
const { memeList } = storeToRefs(memeStore);

const cookieLive2d = useCookie("live2dInit");

declare global {
  interface Window {
    OML2D: any;
  }
}

/** 看板娘初始化 */
const live2dInit = () => {
  const OML2D = window.OML2D;
  OML2D.loadOml2d({
    models: [
      {
        path: "https://model.oml2d.com/cat-black/model.json",
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
            window.open("https://github.com/s6091214/live2d");
          },
        },
      ],
    },
  });
};

const live2dHandler = () => {
  const OML2D = window.OML2D;
  if (!OML2D) {
    if (!cookieLive2d?.value) {
      cookieLive2d.value = "true";
      setTimeout(() => {
        live2dHandler();
      }, 1000);
    }
  } else {
    live2dInit();
  }
};

if (deviceName === "unknown") {
  useHead({
    script: [
      {
        src: "https://unpkg.com/oh-my-live2d@latest",
        async: true,
        onload: () => {
          live2dHandler();
        },
      },
    ],
  });
}

onMounted(() => {
  fetch("https://memes.tw/wtf/api")
    .then((res) => res.json())
    .then((json) => {
      if (json && json.length) {
        const filterString = ["免費救援"];
        const filterArray = json.filter((content) => {
          let show = true;
          const title = content.title;
          for (const string of filterString) {
            if (title.includes(string)) {
              show = false;
              break;
            }
          }
          return show;
        });
        // console.log(filterArray);
        const memes = filterArray.map((content) => {
          const meme = {
            ...content,
            tags: content.hashtag
              ? content.hashtag.split(" ").map((tag, index) => ({
                  title: tag,
                  id: `meme${content.id}-tag${index}`,
                }))
              : [],
            created_at_f: content.created_at?.date_time_string
              ? content.created_at.date_time_string.split(" ")[0]
              : "",
          };
          return meme;
        });
        setMemeList(memes);
      }
    })
    .catch((error) => {
      console.error(error);
    });
});
</script>

<style scoped>
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
  top: 50px;
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
  top: 50px;
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
