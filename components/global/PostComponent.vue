<template>
  <div
    v-if="postData"
    class="max-w-[470px] w-full mx-auto pb-[20px] border-b border-gray-400"
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
  liked_user: string[] | string;
  created_date: string;
};

interface ApiResponse {
  data: postItem;
  success?: string;
  error?: string;
}

interface UpdateApiResponse {
  success?: string;
  error?: string;
}

const emit = defineEmits(["showTooltip", "handleTip"]);

const initialStore = useInitialStore();
const { handleSignDialog, addAlert } = initialStore;

const userStore = useUserStore();
const { isLogin, isGoogleLogin, googleUid } = storeToRefs(userStore);

const memeStore = useMemeStore();
const { getHotMeme, savaLikeIdList } = memeStore;
const { hotMemesList, likeIdList } = storeToRefs(memeStore);

const hotMemeIds = computed(() => {
  if (hotMemesList?.value) {
    return hotMemesList.value.map((meme) => meme.memeId);
  }
  return [];
});

const props = defineProps<{ postData: postItem }>();

const showTags = computed(() => {
  if (props.postData?.tags) {
    const tags = props.postData.tags;
    if (typeof tags === "object") return tags;
    else if (typeof tags === "string") {
      try {
        return JSON.parse(tags);
      } catch (error) {
        return [];
      }
    }
  }
  return [];
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

const putMemeData = async (request) => {
  const { memeId } = request;
  if (memeId) {
    const { data: res } = await useAsyncData<UpdateApiResponse>(
      "updateMeme",
      () =>
        $fetch(
          `https://shielded-earth-43070-852d0af23eb2.herokuapp.com/api/memes/${memeId}`,
          {
            method: "PUT",
            body: { ...request },
          }
        )
    );
    if (res.value.success) {
      getHotMeme();
    }
  }
};

const addHotMemes = async () => {
  const liked = isLike(props.postData.memeId);
  let liked_user = [];
  try {
    if (typeof props.postData.liked_user === "string")
      liked_user = JSON.parse(typeof props.postData.liked_user);
  } catch (error) {}

  if (googleUid?.value) {
    liked_user = liked_user.filter((item) => item !== googleUid.value);
    if (liked) {
      liked_user.push(googleUid.value);
    }
  }

  const { title, url, src, memeId, pageview, total_like_count, created_date } =
    props.postData;

  const requestData = {
    title,
    url,
    src,
    memeId,
    pageview,
    total_like_count,
    created_date,
    tags: showTags.value,
    liked_user,
  };

  // console.log(requestData);

  const isExist = hotMemeIds.value.includes(props.postData.memeId);
  if (isExist) {
    if (isGoogleLogin.value) putMemeData(requestData);
    return;
  }

  const { data: res } = await useAsyncData<ApiResponse>("createMeme", () =>
    $fetch(
      "https://shielded-earth-43070-852d0af23eb2.herokuapp.com/api/memes",
      {
        method: "POST",
        body: { ...requestData },
      }
    )
  );

  // console.log(res.value);

  if (res.value) {
    getHotMeme();
    return;
  }

  if (res.value === null) {
    putMemeData(requestData);
  }
};

const pressLike = () => {
  if (!isLogin.value) {
    addAlert({ type: "error", msg: "請先創建暱稱" });
    handleSignDialog(true);
    return;
  }
  if (props.postData) {
    handleLike(props.postData.memeId);
    addHotMemes();
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
