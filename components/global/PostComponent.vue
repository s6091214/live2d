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
        <div>
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
          <span
            class="p-[0.5rem] inline-block cursor-pointer"
            @click="() => {}"
          >
            <img
              class="w-[24px] h-[24px] invert"
              src="../../public/comment-icon.svg"
              alt=""
            />
          </span>
        </div>
      </div>
      <!-- TODO: 按讚列表 -->
      <!-- TODO: tags -->
      <div class="flex gap-2 pt-[0.5rem]" v-if="postData.tags">
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

const initialStore = useInitialStore();
const { handleSignDialog, addAlert } = initialStore;

const userStore = useUserStore();
const { savaLikeIdList } = userStore;
const { isLogin, likeIdList } = storeToRefs(userStore);

defineProps<{ postData: postItem }>();

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
</script>

<style scoped></style>
