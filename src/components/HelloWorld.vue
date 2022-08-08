<template>
<div style="">
  <canvas ref="canvas"></canvas>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Engine2D } from '../engine2D/engine';
import * as THREE from 'three'

const canvas = ref<HTMLCanvasElement | null>(null)
let engine!: Engine2D

onMounted(() => {
  engine = new Engine2D(canvas.value as HTMLCanvasElement)
})

onBeforeUnmount(() => {
  engine.dispose()
})

</script>

<style scoped>
.canvas {
  width: 100%;
  height: 100%;
}
</style>
