<script setup>
import HelloWorld from "./components/HelloWorld.vue";
import { loadOml2d } from "oh-my-live2d";
import { reactive, onMounted } from "vue";
// import axios from "axios";

loadOml2d({
  models: [
    {
      path: "https://model.oml2d.com/Senko_Normals/senko.model3.json",
      position: [-10, 20],
    },
  ],
  statusBar: {
    loadingIcon: "icon-loading",
  },
  menus: {
    items: [
      // {
      //   id: "Rest",
      //   icon: "icon-rest",
      //   title: "休息",
      //   onClick(oml2d) {
      //     // actions ...
      //   },
      // },
      // {
      //   id: "SwitchModel",
      //   icon: "icon-switch",
      //   title: "切换模型",
      //   onClick(oml2d) {
      //     // actions ...
      //   },
      // },
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
const data = reactive({ content: null });

onMounted(() => {
  fetch("https://memes.tw/wtf/api")
    .then((res) => res.json())
    .then((json) => {
      data.content = json;
    })
    .catch((error) => {
      console.error(error);
    });
});
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
