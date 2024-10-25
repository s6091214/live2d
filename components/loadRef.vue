<template>
  <div
    v-if="componentInit"
    v-show="memePage <= 5"
    class="loading-indicator border-none pt-3"
    ref="loadingRef"
  >
    <SvgIcon name="icon-hot" cssClass="w-[36px] h-[36px] text-[#f97316]" />
  </div>
</template>

<script setup>
const memeStore = useMemeStore();
const { memeList } = storeToRefs(memeStore);

const { memePage, addMemePage } = useMemeList();

const { isIntersection, intersectionObserver } = useIntersectionObserver();

const loadingRef = ref();

const componentInit = ref(false);

watch(isIntersection, (newValue) => {
  if (!newValue) return;
  if (!memeList?.value.length) return;
  addMemePage();
});

onMounted(() => {
  componentInit.value = true;
  setTimeout(() => {
    if (loadingRef.value) {
      intersectionObserver(loadingRef.value);
    }
  });
});
</script>

<style scoped></style>
