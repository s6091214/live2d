<template>
  <!-- @submit.prevent="submit(comment.id)" -->
  <form
    action="#"
    class="relative"
    :class="{ 'mt-2': !osk }"
    :style="{ paddingBottom: osk ? renderHeight : 0 }"
    event=""
    @submit.prevent="() => {}"
  >
    <div
      class="form-group input w-full flex justify-between"
      :class="{ osk: osk }"
      v-if="comment"
    >
      <textarea
        type="text"
        :id="`reply-${comment.id}`"
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
        :disabled="loading"
        v-if="showSubmitButton(form.comment)"
      >
        發布
      </el-button>
    </div>
  </form>
</template>

<script setup>
// const { addComment } = useMemeStore();

// const emit = defineEmits(["getList"]);

const props = defineProps({
  comment: Object,
});

const { comment } = toRefs(props);

const loading = ref(false);

let form = reactive({
  comment: "",
});

const textAreaRef = ref({});

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

const submit = async (id) => {
  const comment = formatString(form.comment);
  if (id) {
    addComment(id, { comment })
      .then((res) => {
        if (res) {
          form.comment = "";
          renderHeight.value = "24px";
          // emit("getList");
        }
      })
      .finally(() => {
        loading.value = false;
      });
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
  top: 0.5rem;
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
