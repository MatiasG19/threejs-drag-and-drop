<template>
  <canvas ref="canvas" class="canvas"></canvas>
  
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Engine2D } from '../engine2D/engine';
import * as THREE from 'three'

const canvas = ref<HTMLCanvasElement | null>(null)
let engine!: Engine2D

onMounted(() => {
  engine = new Engine2D(canvas.value as HTMLCanvasElement)
})

</script>

<style scoped>
.canvas {
  width: 100%;
  height: 100%;
}
</style>
