<template>
  <div>
    <h1 class="text-4xl text-center font-bold text-[tomato]">MEMETALK</h1>
  </div>
</template>

<script lang="ts" setup>
declare global {
  interface Window { 
    OML2D: any
  }
}

let memes = reactive([])

useHead({
  script: [
    { 
      src: 'https://unpkg.com/oh-my-live2d@latest',
      async: true
    }
  ]
})
onMounted(() => {
  const OML2D = window.OML2D
  if (OML2D) {
    OML2D.loadOml2d({
      models: [
        {
          path: "https://model.oml2d.com/cat-black/model.json",
          scale: 0.15,
          position: [0, 20],
          stageStyle: {
            height: 350
          }
        }
      ],
      statusBar: {
        loadingIcon: "icon-loading",
      },
      menus: {
        items: [
          {
            id: "Rest",
            icon: "icon-rest",
            title: "休息",
            onClick(oml2d) {
              // actions ...
            },
          },
          {
            id: "SwitchModel",
            icon: "icon-switch",
            title: "切换模型",
            onClick(oml2d) {
              // actions ...
            },
          },
          {
            id: "About",
            icon: "icon-about",
            title: "gtihub",
            onClick() {
              window.open("https://github.com/s6091214/live2d");
            },
          },
        ],
      },
    });
  }

  fetch("https://memes.tw/wtf/api")
    .then((res) => res.json())
    .then((json) => {
      memes = json;
    })
    .catch((error) => {
      console.error(error);
    });
})
</script>

<style scoped></style>
