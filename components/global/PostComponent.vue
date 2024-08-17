<template>
  <div
    v-if="postData"
    class="max-w-full mx-auto pb-[20px] border-b border-gray-400"
    style="width: min(470px, 100vw)"
  >
    <!-- article header -->
    <div class="flex items-center text-white py-3">
      <span>{{ postData.created_at_f }}</span>
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
            @click="pressLike(postData.id)"
          >
            <img
              class="w-[24px] h-[24px]"
              :class="{
                grayscale: !isLike(postData.id),
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
      <div class="flex flex-wrap gap-2 pt-[0.5rem]" v-if="postData.tags">
        <el-tag
          type="danger"
          v-for="tag in postData.tags"
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
  created_at_f: string;
  title: string;
  src: string;
  tags?: { id: string; title: string }[];
  id: number;
};

const emit = defineEmits(["showTooltip", "handleTip"]);

const initialStore = useInitialStore();
const { handleSignDialog, addAlert } = initialStore;

const userStore = useUserStore();
const { savaLikeIdList } = userStore;
const { isLogin, likeIdList, isGoogleLogin } = storeToRefs(userStore);

defineProps<{ postData: postItem }>();

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
