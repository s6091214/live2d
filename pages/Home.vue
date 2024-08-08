<template>
  <div class="relative">
    <!-- <div class="w-full top-[48px] left-0 fixed hidden sm:block">
      <uploadComment @get-list="updateList" />
    </div> -->
    <!-- <div class="w-full h-[289px] mb-4 hidden sm:block"></div> -->
    <div class="w-full home-bg min-h-screen">
      <div
        class="mx-auto w-full px-2 sm:px-0 sm:max-w-[630px] pt-[4rem] pb-[20px] relative z-10 min-h-screen"
      >
        <!-- TODO: 文章列表 -->
        <template v-for="content in memeList" :key="content.id">
          <div
            class="max-w-full mx-auto pb-[20px] border-b border-gray-400"
            style="width: min(470px, 100vw)"
          >
            <!-- article header -->
            <div class="flex items-center text-white py-3">
              <span>{{ content.created_at_f }}</span>
            </div>
            <!-- 文章圖片 -->
            <div class="w-full max-w-full flex items-center">
              <a
                v-if="content.src"
                id="meme"
                :href="content.src"
                target="_blank"
                rel="noopener noreferrer"
                class="block w-full"
              >
                <el-image
                  class="w-full h-auto"
                  :src="content.src"
                  alt="meme"
                  lazy
                />
              </a>
            </div>
            <!-- 下方文章資訊及流言區塊 -->
            <div>
              <!-- TODO: 操作 -->
              <div class="flex pb-[4px]">
                <div>
                  <span
                    class="p-[0.5rem] inline-block cursor-pointer"
                    @click="pressLike(content.id)"
                  >
                    <img
                      class="w-[24px] h-[24px]"
                      :class="{
                        grayscale: !isLike(content.id),
                      }"
                      src="/heart-like-con.svg"
                      alt=""
                    />
                  </span>
                  <span
                    class="p-[0.5rem] inline-block cursor-pointer"
                    @click="() => {}"
                  >
                    <img
                      class="w-[24px] h-[24px] invert"
                      src="/comment-icon.svg"
                      alt=""
                    />
                  </span>
                </div>
              </div>
              <!-- TODO: 按讚列表 -->
              <!-- TODO: tags -->
              <div class="flex gap-2 pt-[0.5rem]" v-if="content.tags">
                <el-tag
                  type="danger"
                  v-for="tag in content.tags"
                  :key="tag.id"
                  effect="dark"
                  round
                >
                  {{ tag.title }}
                </el-tag>
              </div>
              <!-- TODO: 標題 -->
              <p class="text-left text-white mt-[0.5rem]">
                <span>{{ content.title }}</span>
              </p>
              <!-- TODO: 留言 -->
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCookie } from "#imports";
import deviceName from "../util/mobileDetective";

const initialStore = useInitialStore();
const { handleSignDialog, addAlert } = initialStore;

const userStore = useUserStore();
const { savaLikeIdList } = userStore;
const { isLogin, likeIdList } = storeToRefs(userStore);

const cookieLive2d = useCookie("live2dInit");

declare global {
  interface Window {
    OML2D: any;
  }
}

let memeList = ref([]);

const isLike = (id: number) => {
  if (id) {
    return likeIdList.value.includes(id);
  }
  return false;
};

const handleLike = (id: number) => {
  if (id) {
    const liked = isLike(id);
    if (liked) {
      const filterArray = likeIdList.value.filter((item) => item !== id);
      savaLikeIdList(filterArray);
    } else {
      savaLikeIdList(id);
    }
  }
};

const pressLike = (id) => {
  if (!isLogin.value) {
    addAlert({ type: "error", msg: "請先創建暱稱" });
    handleSignDialog(true);
    return;
  }
  if (id) {
    handleLike(id);
  }
};

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
        memeList.value = filterArray.map((content) => {
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
