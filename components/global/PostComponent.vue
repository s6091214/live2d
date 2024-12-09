<template>
  <div
    v-if="postData"
    class="max-w-[470px] w-full mx-auto pb-[8px] border-b border-gray-400"
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
          <!-- 按讚 -->
          <span
            class="p-[0.5rem] inline-block cursor-pointer"
            @click="pressLike"
          >
            <SvgIcon
              name="icon-like"
              :cssClass="`w-[24px] h-[24px] ${
                !isLike(postData.memeId) ? 'grayscale' : ''
              }`"
            />
          </span>
          <!-- 留言 -->
          <el-button
            v-show="!isHome"
            @click="handleComment"
            @mouseover="($event) => emit('showTooltip', $event.currentTarget)"
          >
            <SvgIcon name="icon-comment" cssClass="w-[24px] h-[24px] invert" />
          </el-button>
        </div>
      </div>
      <!-- TODO: 按讚列表 -->
      <div class="flex">
        <!-- 大頭貼 -->
        <span></span>
        <!-- 讚數 -->
        <el-tooltip placement="top" v-if="fotmatLikedNames.length">
          <template #content>
            <span v-html="fotmatLikedNames"></span>
          </template>
          <span class="text-white">
            {{ fotmatLikedNames.length || 0 }}個讚
          </span>
        </el-tooltip>
      </div>
      <!-- TODO: tags -->
      <div class="flex flex-wrap gap-2 pt-[0.5rem]">
        <el-tag
          type="danger"
          v-for="tag in showTags"
          :key="tag.xata_id"
          effect="dark"
          round
        >
          {{ tag.title }}
        </el-tag>
      </div>
      <!-- TODO: 標題 -->
      <p class="text-left text-white my-[0.5rem]">
        <span>{{ postData.title }}</span>
      </p>
      <!-- TODO: 留言 -->
      <div class="text-left">
        <a
          v-show="!commentsControls[postData.memeId]"
          v-if="postData.comments && postData.comments.length"
          href="#"
          event=""
          @click.prevent="showComments(postData.memeId)"
          class="text-neutral-500"
          >查看全部{{ postData.comments.length }}則留言</a
        >
        <div v-show="commentsControls[postData.memeId]">
          <ul>
            <li
              class="pt-[12px] pb-2"
              v-for="comment in postData.comments"
              :key="comment.xata_id"
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
                      >{{ comment.name ? comment.name : "noname" }}</span
                    >
                    <span v-html="renderHtml(comment.content)"></span>
                  </p>
                  <div
                    v-if="comment.xata_createdat"
                    v-timeformat="comment.xata_createdat"
                    class="text-neutral-500 mt-[0.5rem] flex-1"
                  ></div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <ReplyComment v-if="isLogin && showCommentBlock" :postData="postData" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { MemePost } from "~/types";

interface ApiResponse {
  data: MemePost;
  success?: string;
  error?: string;
}

interface UpdateApiResponse {
  success?: string;
  error?: string;
}

const config = useRuntimeConfig();

const emit = defineEmits(["showTooltip", "handleTip"]);

const initialStore = useInitialStore();
const { handleSignDialog, addAlert } = initialStore;

const userStore = useUserStore();
const { isLogin, isGoogleLogin, googleUid, userList } = storeToRefs(userStore);

const memeStore = useMemeStore();
const { fetchHotMemeData, savaLikeIdList } = memeStore;
const { likeIdList, hotMemeIds } = storeToRefs(memeStore);

const props = defineProps<{ postData: MemePost }>();

const fotmatLikedNames = computed(() => {
  let likedUsers = [];
  let users = [];
  if (props.postData?.liked_user && userList?.value) {
    if (typeof props.postData.liked_user === "object")
      likedUsers = props.postData.liked_user;
    else if (typeof props.postData.liked_user === "string") {
      try {
        likedUsers = JSON.parse(props.postData.liked_user);
      } catch (error) {}
    }
    userList.value.map((user) => {
      const { uid, displayName } = user;
      if (likedUsers.includes(uid)) users.push(displayName);
      return user;
    });
  }
  return users;
});

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

const routes = useRoute();

const onRoutes = computed(() => {
  return routes.path;
});

const isHome = computed(() => {
  switch (onRoutes.value) {
    case "/":
    case "/Home":
      return true;

    default:
      return false;
  }
});

const handleComment = () => {
  if (isLogin.value) {
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

const likeMeme = async (request) => {
  const { memeId } = request;
  if (memeId) {
    const { data: res } = await useAsyncData<UpdateApiResponse>(
      "updateMeme",
      () =>
        $fetch(`${config.public.apiBaseUrl}/api/meme/${memeId}/like`, {
          method: "PUT",
          body: { uid: googleUid.value },
        })
    );
    console.log(res.value);
    if (res.value.success) {
      fetchHotMemeData();
    }
  }
};

const addHotMemes = async () => {
  const liked = isLike(props.postData.memeId);
  let liked_user = [];
  try {
    switch (typeof props.postData.liked_user) {
      case "object":
        liked_user = props.postData.liked_user;
        break;
      case "string":
        liked_user = JSON.parse(props.postData.liked_user);
      default:
        break;
    }
  } catch (error) {}

  if (googleUid?.value) {
    liked_user = liked_user.filter((item) => item !== googleUid.value);
    if (liked) {
      liked_user.push(googleUid.value);
    }
  }

  const {
    title,
    url,
    src,
    memeId,
    pageview,
    total_like_count,
    created_date,
    comments,
  } = props.postData;

  const requestData = {
    title,
    url,
    src,
    memeId,
    pageview,
    total_like_count,
    created_date,
    tags: [...showTags.value],
    liked_user,
    comments,
  };

  // console.log(requestData);

  const isExist = hotMemeIds.value.includes(props.postData.memeId);
  if (isExist) {
    if (isGoogleLogin.value) likeMeme(requestData);
    return;
  }

  const { data: res } = await useAsyncData<ApiResponse>("createMeme", () =>
    $fetch(`${config.public.apiBaseUrl}/api/hot-meme`, {
      method: "POST",
      body: { ...requestData },
    })
  );

  if (res.value) {
    fetchHotMemeData();
    return;
  }

  console.log(res.value);

  if (res.value === null && isGoogleLogin.value) {
    likeMeme(requestData);
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

let commentsControls = reactive({});

const showComments = (id) => {
  if (id) commentsControls[id] = true;
};

const renderHtml = (msg) => {
  /** 將html碼格式化 只取得文字 */
  const regex = /<(?!br\s*\/?)[^>]*>/g;
  if (typeof msg === "string") return msg.replace(regex, " ");
  return "";
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
