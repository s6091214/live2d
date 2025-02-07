<template>
  <div
    class="loading-indicator border-none pt-3"
    ref="loadingRef"
    v-show="!isReposOver"
  >
    <SvgIcon name="icon-hot" cssClass="w-[36px] h-[36px] text-[#f97316]" />
  </div>
</template>

<script lang="ts" setup>
const memeStore = useMemeStore();
const { fetchMemeData } = memeStore;
const { isLoadRepos, isReposOver } = storeToRefs(memeStore);

const { isIntersection, intersectionObserver } = useIntersectionObserver();

const loadingRef = ref(null);

onMounted(() => {
  if (loadingRef.value) {
    intersectionObserver(loadingRef.value);
  }
});

watch(isIntersection, (newValue) => {
  if (!newValue) return;
  if (isLoadRepos.value) return;
  fetchMemeData();
});
</script>

<style scoped></style>
