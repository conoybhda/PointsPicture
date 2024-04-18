<template>
  <canvas
    ref="canvas"
    width="1000"
    height="500"
    style="background-color: beige"
  ></canvas>
  <button @click="changePoints">changePoints</button>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { initCanvas } from "@conoybhda/pointspicture";

const canvas = ref<HTMLCanvasElement | null>(null);
let c: any = null;

const changePoints = () => {
  let arr = [];
  const num = 30000 + Math.floor(Math.random() * 10000);
  for (let i = 0; i < num; i += 3) {
    arr.push({
      x: Math.floor(Math.random() * 800),
      y: Math.floor(Math.random() * 300),
      rgba: [
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        255,
      ],
    });
  }
  c.changePoints(arr);
};

const move = (e: MouseEvent) => {
  console.log(e.offsetX, e.offsetY);
  c.moveMouse(e.offsetX, e.offsetY);
};

onMounted(() => {
  c = initCanvas(canvas.value!, {
    x: 100,
    y: 100,
  });
  let arr = [];
  for (let i = 0; i < 1000; i++) {
    arr.push({
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
      rgba: [
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        255,
      ],
    });
  }
  console.log(arr);
  c.changePoints(arr);
});
</script>
<style scoped>
.read-the-docs {
  color: #888;
}
</style>
