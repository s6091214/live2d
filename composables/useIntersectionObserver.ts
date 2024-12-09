export function useIntersectionObserver() {
  const observer = ref(null);
  const isIntersection = ref(false);
  const elRef = ref(null);

  const intersectionObserver = (
    el,
    options = {
      root: null,
      threshold: 0,
    }
  ) => {
    elRef.value = el;
    observer.value = new IntersectionObserver((entries) => {
      entries.forEach((item) => {
        isIntersection.value = item.isIntersecting;
      });
    }, options);
    observer.value.observe(el);
  };

  const unobserver = () => {
    if (observer.value) {
      observer.value.unobserve(elRef.value);
    }
  };

  onUnmounted(() => {
    unobserver();
  });

  return { elRef, isIntersection, intersectionObserver };
}
