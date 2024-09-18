import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-tw";
dayjs.extend(relativeTime);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("timeformat", {
    mounted(el, binding) {
      const time = dayjs(binding.value).locale("zh-tw").fromNow();
      el.innerText = time;
    },
  });
});
