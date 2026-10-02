<script setup lang="ts">
// Plain clip: normal looping video.
// Green-screen clip (keyed): the green is removed live on a canvas,
// so it works on every browser, including iPhone Safari.
const props = defineProps<{
  src: string
  keyed?: boolean
  // [x, y, width, height] in video pixels, crops the empty green around the subject
  crop?: [number, number, number, number]
}>()

const video = ref<HTMLVideoElement>()
const canvas = ref<HTMLCanvasElement>()

let stopped = false

onMounted(() => {
  const v = video.value
  if (!v) return

  v.muted = true
  v.play().catch(() => {})

  if (!props.keyed) return

  const c = canvas.value!
  const ctx = c.getContext('2d', { willReadFrequently: true })!

  const draw = () => {
    if (stopped) return

    const [sx, sy, sw, sh] = props.crop ?? [0, 0, v.videoWidth, v.videoHeight]

    if (v.videoWidth && sw && sh) {
      if (c.width !== sw) {
        c.width = sw
        c.height = sh
      }

      ctx.drawImage(v, sx, sy, sw, sh, 0, 0, sw, sh)

      const img = ctx.getImageData(0, 0, sw, sh)
      const d = img.data

      for (let i = 0; i < d.length; i += 4) {
        const r = d[i]!
        const g = d[i + 1]!
        const b = d[i + 2]!
        const dom = g - (r > b ? r : b) // how green-dominant the pixel is

        if (dom > 70) {
          d[i + 3] = 0
        } else if (dom > 25) {
          d[i + 3] = 255 * (1 - (dom - 25) / 45)
        }

        if (dom > 0) d[i + 1] = r > b ? r : b // remove green edge spill
      }

      ctx.putImageData(img, 0, 0)
    }

    if ('requestVideoFrameCallback' in v) {
      v.requestVideoFrameCallback(draw)
    } else {
      requestAnimationFrame(draw)
    }
  }

  draw()
})

onBeforeUnmount(() => {
  stopped = true
})
</script>

<template>
  <div
    class="clip"
    :class="{ keyed }"
  >
    <video
      ref="video"
      :class="{ source: keyed }"
      :src="src"
      muted
      loop
      autoplay
      playsinline
      preload="auto"
    ></video>

    <canvas
      v-if="keyed"
      ref="canvas"
    ></canvas>
  </div>
</template>

<style scoped>
.clip {
  line-height: 0;
}

.clip:not(.keyed) {
  border: 4px solid #fff;
  border-radius: 8px;

  overflow: hidden;

  box-shadow:
    0 8px 22px rgba(0, 0, 0, 0.45),
    0 0 18px rgba(255, 255, 255, 0.35);
}

video,
canvas {
  display: block;

  width: 100%;
  height: auto;
}

/* the keyed clip's real video stays hidden, the canvas is what you see */
video.source {
  position: absolute;

  width: 1px;
  height: 1px;

  opacity: 0;
  pointer-events: none;
}

canvas {
  filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.5));
}
</style>
