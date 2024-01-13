<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Game } from '../Game'
import { IViewport } from '../IViewport'
import { CanvasViewport } from '../CanvasViewport'

const width = ref(640)
const height = ref(480)

const gameCanvas = ref<HTMLCanvasElement>()
const canvasContext = computed(() => gameCanvas.value?.getContext('2d'))

const viewport = () => new CanvasViewport(canvasContext.value!)

onMounted(async () => {
    const game = new Game(width.value, height.value, viewport())
    game.start()
})
</script>

<template>
    <canvas 
        ref="gameCanvas"
        :width="width" 
        :height="height" 
        style="border:1px solid #FFFFFF">
    </canvas>
</template>

<style scoped>
</style>
