<script setup>
const initialStore = useInitialStore();
const { alerts } = storeToRefs(initialStore);
const globalAlerts = computed(() => {
  if (alerts?.value && alerts.value.length) {
    return alerts.value;
  }
  return [];
});
</script>

<template>
  <div
    v-if="globalAlerts && globalAlerts.length"
    class="w-[40%] fixed top-[20px] left-[30%] z-40"
  >
    <div style="transition: all 0.3s ease" role="alert">
      <el-alert
        v-for="({ msg, type }, index) in globalAlerts"
        :key="`msg_${index}`"
        :title="msg"
        :type="type"
      />
    </div>
  </div>
</template>

<style></style>
