<template>
  <canvas
    ref="canvas"
    width="1000"
    height="500"
    style="background-color: beige"
    @mousemove="move"
    @mouseleave="leave"
  ></canvas>
  <button @click="changePoints">changePoints</button>
  <button @click="changeMethod">changeMethod</button>
  <button @click="load">load</button>
  <input type="range" v-model="force" @change="change" />
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { initCanvas } from "@conoybhda/pointspicture";

const canvas = ref<HTMLCanvasElement | null>(null);
const force = ref(0);
let c: any = null;

const load = async () => {
  c.loadImg("fanhuicang.png");
};

const changePoints = () => {
  let arr = [];
  for (let i = 0; i < 800; i += 3) {
    for (let j = 0; j < 300; j += 3) {
      arr.push({
        x: Math.random() * 800,
        y: Math.random() * 300,
        // x: i,
        // y: j,
        rgba: [0, 0, 0, 255],
      });
    }
  }
  c.changePoints(arr);
};

const changeMethod = () => {
  c.moveMethod == "push" ? c.changeMethod("pull") : c.changeMethod("push");
};

const change = () => {
  console.log(Number(force.value) * 100);
  c.changeWeight(Number(force.value) * 100);
};

const move = (e: MouseEvent) => {
  if (c) {
    c.moveMouse(e.offsetX, e.offsetY);
  }
};

const leave = () => {
  if (c) {
    c.endMoveMouse();
  }
};

onMounted(() => {
  c = initCanvas(canvas.value!, {
    x: 100,
    y: 100,
  });
  changePoints();
});
</script>
<style scoped>
.read-the-docs {
  color: #888;
}
</style>
