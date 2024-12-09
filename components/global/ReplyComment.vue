<template>
  <form
    action="#"
    class="relative"
    :class="{ 'mt-2': !osk }"
    :style="{ paddingBottom: osk ? renderHeight : 0 }"
    event=""
    @submit.prevent="submit"
  >
    <div
      class="form-group input w-full flex justify-between"
      :class="{ osk: osk }"
      v-if="postData"
    >
      <textarea
        type="text"
        :id="`reply-${postData.memeId}`"
        ref="textAreaRef"
        class="textarea"
        placeholder="留言..."
        v-model="form.comment"
        @focus="oskControl(true)"
        @change="textareaAutoHeight"
        @keyup="textareaAutoHeight"
        @keydown="handleSubmit($event)"
        @blur="textareaAutoHeight"
        rows="1"
      ></textarea>
      <el-button
        type="primary"
        native-type="submit"
        size="small"
        :disabled="globalLoading"
        v-if="showSubmitButton"
      >
        發布
      </el-button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import type { MemePost } from "~/types";

type comment = {
  name: string;
  content: string;
  avatar: string;
};

interface UpdateApiResponse {
  success?: string;
  error?: string;
}

interface ApiResponse {
  data: MemePost;
  success?: string;
  error?: string;
}

const props = defineProps<{ postData: MemePost }>();

const initialStore = useInitialStore();
const { setLoading } = initialStore;
const { globalLoading } = storeToRefs(initialStore);

const userStore = useUserStore();
const { nickname, userInfo, isGoogleLogin } = storeToRefs(userStore);

const memeStore = useMemeStore();
const { fetchHotMemeData } = memeStore;
const { hotMemesList } = storeToRefs(memeStore);

const config = useRuntimeConfig();

let form = ref({
  comment: "",
});

const textAreaRef = ref<HTMLTextAreaElement | null>(null);

const renderHeight = ref("24px");

const textareaAutoHeight = () => {
  if (!textAreaRef.value) return;
  textAreaRef.value.style.height = "auto";
  textAreaRef.value.style.height = `${textAreaRef.value.scrollHeight}px`;
  const height =
    textAreaRef.value.scrollHeight > 96 ? 96 : textAreaRef.value.scrollHeight;
  renderHeight.value = `${height}px`;
};

const osk = ref(false);

const oskControl = (val) => {
  if (!osk.value) textareaAutoHeight();
  osk.value = val;
};

const showSubmitButton = computed(() => {
  switch (true) {
    case !form.value.comment:
    case form.value.comment === "":
    case typeof form.value.comment !== "string":
    case form.value.comment.trim() === "":
      return false;

    default:
      return true;
  }
});

const formatString = (msg) => {
  if (typeof msg === "string" && msg.includes("\n")) {
    return msg.replaceAll("\n", "<br />");
  }
  return msg;
};

const hotMemeIds = computed(() => {
  if (hotMemesList?.value) {
    return hotMemesList.value.map((meme) => meme.memeId);
  }
  return [];
});

const formatCommentData = () => {
  const content = formatString(form.value.comment);

  const thisComment: comment = {
    name: nickname.value,
    content,
    avatar: "",
  };

  if (isGoogleLogin?.value && userInfo?.value.photoURL) {
    thisComment.avatar = userInfo.value.photoURL;
  }

  return thisComment;
};

const addComment = async (memeId) => {
  const comment = formatCommentData();

  setLoading(true);
  const { data: res } = await useAsyncData<UpdateApiResponse>(
    "updateMeme",
    () =>
      $fetch(`${config.public.apiBaseUrl}/api/meme/${memeId}/comment`, {
        method: "PUT",
        body: { comment },
      }).finally(() => {
        setLoading(false);
      })
  );
  if (res.value.success) {
    form.value.comment = "";
    renderHeight.value = "24px";
    fetchHotMemeData();
  }
};

const addHotMemes = async (requestData) => {
  const { data: res } = await useAsyncData<ApiResponse>("createMeme", () =>
    $fetch(`${config.public.apiBaseUrl}/api/hot-meme`, {
      method: "POST",
      body: { ...requestData },
    })
  );

  if (res.value) {
    form.value.comment = "";
    renderHeight.value = "24px";
    fetchHotMemeData();
  }

  console.log(res.value);

  if (res.value === null) {
    addComment(requestData.memeId);
  }
};

const handleSubmit = ($event) => {
  if ($event.keyCode === 13 && !$event.shiftKey) {
    if (showSubmitButton) {
      $event.preventDefault();
      submit();
    }
  }
};

const submit = async () => {
  const { memeId } = props.postData;
  if (!memeId) return;

  const thisComment = formatCommentData();

  const comments = [thisComment];

  const isExist = hotMemeIds.value.includes(memeId);

  if (!isExist) {
    const requestData = {
      ...props.postData,
      comments,
    };
    addHotMemes(requestData);
  } else {
    addComment(memeId);
  }
};

onMounted(() => {
  textareaAutoHeight();
});
</script>

<style scoped>
.form-group {
  position: relative;
  font-size: 0;
}

.form-group.osk {
  position: absolute;
  left: 0;
  top: 0;
}

.textarea {
  width: 100%;
  background-color: transparent;
  border: none;
  border-radius: 0;
  user-select: auto;
  resize: none;
  outline: none;
  font-size: 16px;
  color: #fff;
  height: 24px;
  max-height: 96px;
  display: flex;
  flex-grow: 1;
}

.textarea :active,
.textarea :focus {
  outline: none;
}
</style>
