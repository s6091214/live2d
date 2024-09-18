<template>
  <form
    action="#"
    class="relative"
    :class="{ 'mt-2': !osk }"
    :style="{ paddingBottom: osk ? renderHeight : 0 }"
    event=""
    @submit.prevent="submit(postData.memeId)"
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
        @keydown="textareaAutoHeight"
        rows="1"
      ></textarea>
      <el-button
        type="primary"
        native-type="button"
        size="small"
        :disabled="globalLoading"
        v-if="showSubmitButton(form.comment)"
      >
        發布
      </el-button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import type { HtmlHTMLAttributes } from "vue";
import type { MemePost } from "~/types";

const props = defineProps<{ postData: MemePost }>();

const initialStore = useInitialStore();
const { globalLoading } = storeToRefs(initialStore);

const userStore = useUserStore();
const { nickname } = storeToRefs(userStore);

let form = reactive({
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

const showSubmitButton = (msg) => {
  switch (true) {
    case !msg:
    case msg === "":
    case typeof msg !== "string":
    case msg.trim() === "":
      return false;

    default:
      return true;
  }
};

const formatString = (msg) => {
  if (typeof msg === "string" && msg.includes("\n")) {
    return msg.replaceAll("\n", "<br />");
  }
  return msg;
};

const submit = async (memeId) => {
  const comment = formatString(form.comment);
  console.log(memeId, comment);
  // if (memeId && nickname) {
  //   setLoading(true);
  //   const { data: res } =
  //     (await useAsyncData) <
  //     UpdateApiResponse >
  //     ("updateMeme",
  //     () =>
  //       $fetch(
  //         `https://shielded-earth-43070-852d0af23eb2.herokuapp.com/api/memes/${memeId}`,
  //         {
  //           method: "PUT",
  //           body: { ...request },
  //         }
  //       ).finally(() => {
  //         setLoading(false);
  //       }));
  //   if (res.value.success) {
  //     useHotMeme();
  //   }
  // }
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
