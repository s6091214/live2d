<template>
  <div
    v-if="postData"
    class="max-w-full mx-auto pb-[20px] border-b border-gray-400"
    style="width: min(470px, 100vw)"
  >
    <!-- article header -->
    <div class="flex items-center text-white py-3">
      <span>{{ postData.created_date }}</span>
    </div>
    <!-- 文章圖片 -->
    <div class="w-full max-w-full flex items-center">
      <a
        v-if="postData.src"
        id="meme"
        :href="postData.src"
        target="_blank"
        rel="noopener noreferrer"
        class="block w-full"
      >
        <el-image class="w-full h-auto" :src="postData.src" alt="meme" lazy />
      </a>
    </div>
    <!-- 下方文章資訊及流言區塊 -->
    <div>
      <!-- TODO: 操作 -->
      <div class="flex pb-[4px]">
        <div class="flex items-center">
          <span
            class="p-[0.5rem] inline-block cursor-pointer"
            @click="pressLike"
            v-if="onRoutes !== '/HotMeme'"
          >
            <img
              class="w-[24px] h-[24px]"
              :class="{
                grayscale: !isLike(postData.memeId),
              }"
              src="../../public/heart-like-con.svg"
              alt=""
            />
          </span>
          <el-button
            @click="handleComment"
            @mouseover="($event) => emit('showTooltip', $event.currentTarget)"
          >
            <img
              class="w-[24px] h-[24px] invert"
              src="../../public/comment-icon.svg"
              alt=""
            />
          </el-button>
        </div>
      </div>
      <!-- TODO: 按讚列表 -->
      <!-- TODO: tags -->
      <div class="flex flex-wrap gap-2 pt-[0.5rem]">
        <el-tag
          type="danger"
          v-for="tag in showTags"
          :key="tag.id"
          effect="dark"
          round
        >
          {{ tag.title }}
        </el-tag>
      </div>
      <!-- TODO: 標題 -->
      <p class="text-left text-white mt-[0.5rem]">
        <span>{{ postData.title }}</span>
      </p>
      <!-- TODO: 留言 -->
      <div class="text-left">
        <!-- <a
          v-show="!commentsControls[content.id]"
          v-if="content.comments && content.comments.length"
          href="#"
          event=""
          @click.prevent="showComments(content.id)"
          class="text-neutral-500"
          >查看全部{{ content.comments.length }}則留言</a
        > -->
        <!-- <div v-show="commentsControls[content.id]">
          <ul>
            <li
              class="pt-[12px]"
              v-for="comment in content.comments"
              :key="comment.id"
            >
              <div class="flex">
                <el-avatar
                  class="mr-3"
                  :size="32"
                  :src="comment.avatar"
                  @error="() => {}"
                >
                  <img src="/default-headshot.png" />
                </el-avatar>
                <div class="flex flex-col">
                  <p class="text-white">
                    <span
                      class="font-bold inline-block text-sky-500 mr-[4px]"
                      >{{
                        comment.user ? comment.user.nickname : "noname"
                      }}</span
                    >
                    <span v-html="renderHtml(comment.comment)"></span>
                  </p>
                  <div
                    v-if="comment.created_at"
                    v-timeformat="comment.created_at"
                    class="text-neutral-500 mt-[0.5rem] flex-1"
                  ></div>
                </div>
              </div>
            </li>
          </ul>
        </div> -->
        <!-- @getList="updateList" -->
        <ReplyComment
          v-if="isGoogleLogin && showCommentBlock"
          :comment="postData"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
type postItem = {
  id: number;
  title: string;
  url: string;
  src: string;
  memeId: number;
  pageview: number;
  total_like_count: number;
  tags: { title: string; id: number }[] | string;
  liked_user: string[];
  created_date: string;
};

const emit = defineEmits(["showTooltip", "handleTip"]);

const initialStore = useInitialStore();
const { handleSignDialog, addAlert } = initialStore;

const userStore = useUserStore();
const { savaLikeIdList } = userStore;
const { isLogin, likeIdList, isGoogleLogin, userInfo } = storeToRefs(userStore);

const memeStore = useMemeStore();
const { hotMemesList } = storeToRefs(memeStore);

const props = defineProps<{ postData: postItem }>();

const showTags = computed(() => {
  if (props.postData?.tags) {
    const tags = props.postData.tags;
    if (typeof tags === "object") return tags;
    else if (typeof tags === "string") {
      try {
        return JSON.parse(tags);
      } catch (error) {}
    }
  }
  return [];
});

const routes = useRoute();

const onRoutes = computed(() => {
  return routes.path;
});

const showCommentBlock = ref(false);

const handleComment = () => {
  if (isGoogleLogin.value) {
    showCommentBlock.value = true;
  } else {
    emit("handleTip");
  }
};

const isLike = (id: number) => {
  if (id && likeIdList?.value) {
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

const addHotMemes = async () => {
  const liked = isLike(props.postData.memeId);
  let liked_user = props.postData.liked_user
    ? [...props.postData.liked_user]
    : [];

  if (userInfo?.value.uid) {
    if (liked) {
      liked_user.push(userInfo.value.uid);
    } else {
      liked_user = liked_user.filter((item) => item !== userInfo.value.uid);
    }
  }

  const {
    title,
    url,
    src,
    memeId,
    pageview,
    total_like_count,
    tags,
    created_date,
  } = props.postData;

  const requestData = {
    title,
    url,
    src,
    memeId,
    pageview,
    total_like_count,
    tags,
    created_date,
    liked_user,
  };

  // console.log(requestData);

  const { data: res } = await useAsyncData("postLike", () =>
    $fetch(
      "https://shielded-earth-43070-852d0af23eb2.herokuapp.com/api/memes",
      {
        method: "POST",
        body: { ...requestData },
      }
    )
  );

  console.log(res.value);

  /** mongodb /api/meme/like */
  // if (res.value) {
  //   const { status } = res.value;
  //   if (!status) {
  //     const { data: putRes } = await useAsyncData("postLikePut", () =>
  //       $fetch("/api/meme/update", {
  //         method: "PUT",
  //         body: { ...requestData },
  //       })
  //     );
  //   }
  // }
};

const pressLike = () => {
  if (!isLogin.value) {
    addAlert({ type: "error", msg: "請先創建暱稱" });
    handleSignDialog(true);
    return;
  }
  if (props.postData) {
    handleLike(props.postData.memeId);
    const hotIds = hotMemesList.value.map((meme) => meme.memeId);
    if (!hotIds.includes(props.postData.memeId)) {
      addHotMemes();
    }
  }
};
</script>

<style scoped>
.el-button,
.el-button.is-round {
  padding: 0.5rem;
  background-color: transparent;
  border: none;
}
.el-button:focus {
  outline: none;
}
</style>
