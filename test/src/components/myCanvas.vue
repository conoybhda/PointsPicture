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
  <input type="range" v-model="force" @change="change" />
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { initCanvas } from "@conoybhda/pointspicture";

const canvas = ref<HTMLCanvasElement | null>(null);
const force = ref(0);
let c: any = null;

const changePoints = () => {
  let arr = [];
  for (let i = 0; i < 800; i += 3) {
    for (let j = 0; j < 300; j += 3) {
      arr.push({
        x: i,
        y: j,
        rgba: [0, 0, 0, 255],
      });
    }
  }
  c.changePoints(arr);
};

const change = () => {
  console.log(force.value);
  c.changeR(force.value);
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
