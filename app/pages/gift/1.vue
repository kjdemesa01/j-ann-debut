<script setup lang="ts">
// Every photo inside app/assets/memories is picked up automatically.
// Order = file name order (rename to 01-..., 02-... to control it).
const modules = import.meta.glob('../../assets/memories/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const photos = Object.keys(modules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((key) => modules[key] as string)

const total = photos.length
const INTERVAL = 2300 // ms between photos

// how many photos have appeared so far
const shown = ref(0)
const finished = computed(() => shown.value >= total)

let timer: ReturnType<typeof setInterval> | undefined

const preload = (i: number) => {
  if (import.meta.client && photos[i]) new Image().src = photos[i]
}

const reveal = () => {
  if (shown.value >= total) return
  shown.value++
  preload(shown.value)
  if (shown.value >= total) stop()
}

const stop = () => {
  if (timer) clearInterval(timer)
  timer = undefined
}

const start = () => {
  stop()
  timer = setInterval(reveal, INTERVAL)
}

// tapping a photo shows the next one right away
const skip = () => {
  reveal()
  if (!finished.value) start()
}

const replay = () => {
  shown.value = 0
  reveal()
  start()
}

onMounted(() => {
  if (!total) return
  reveal()
  start()
})

onBeforeUnmount(stop)

// only the newest few photos stay in the pile
const pile = computed(() => {
  const from = Math.max(0, shown.value - 4)
  return photos.slice(from, shown.value).map((src, k) => ({ src, i: from + k }))
})

const cardStyle = (i: number) => {
  const pos = shown.value - 1 - i // 0 = newest, on top
  const tilt = ((i * 37) % 13) - 6 // steady "random" tilt per photo
  const x = pos === 0 ? 0 : ((i * 17) % 21) - 10
  const y = pos * 10

  return {
    transform: `translate(${x}px, ${y}px) rotate(${pos === 0 ? tilt * 0.5 : tilt}deg) scale(${1 - pos * 0.035})`,
    zIndex: 10 - pos,
    opacity: pos > 2 ? 0 : 1,
    pointerEvents: pos === 0 ? 'auto' : 'none',
  } as const
}
</script>

<template>
  <GiftFrame
    :id="1"
    title="A Memory"
  >

    <p
      v-if="total && !finished"
      class="hint"
    >
      Tap a photo to see the next one
    </p>

    <p
      v-else-if="total"
      class="hint"
    >
      That's every memory 💜
    </p>

    <p
      v-else
      class="hint"
    >
      Add photos to app/assets/memories
    </p>

    <div class="stack">

      <figure
        v-for="p in pile"
        :key="p.i"
        class="polaroid"
        :style="cardStyle(p.i)"
        @click="skip"
      >
        <span class="tape"></span>

        <img
          :src="p.src"
          alt=""
          draggable="false"
        />

        <figcaption>
          {{ p.i + 1 }} <small>/ {{ total }}</small>
        </figcaption>
      </figure>

    </div>

    <button
      v-if="finished && total"
      class="ghost-button replay"
      @click="replay"
    >
      ↻ Watch again
    </button>

  </GiftFrame>
</template>

<style scoped>
.hint {
  margin: -12px 0 26px;

  font-size: 14px;

  opacity: 0.7;
}

.stack {
  position: relative;

  width: 250px;
  height: 390px;

  margin: 0 auto;
}

.polaroid {
  position: absolute;
  inset: 0 0 auto 0;

  margin: 0;
  padding: 12px 12px 10px;

  background: #fffdf9;

  border-radius: 6px;

  box-shadow:
    0 14px 30px rgba(60, 35, 85, 0.25),
    0 2px 4px rgba(60, 35, 85, 0.12);

  cursor: pointer;

  -webkit-tap-highlight-color: transparent;

  transition:
    transform 0.55s cubic-bezier(.3, .8, .3, 1),
    opacity 0.4s ease;

  /* each new photo drops onto the pile */
  animation: drop 0.7s cubic-bezier(.3, .8, .3, 1) backwards;
}

.polaroid img {
  display: block;

  width: 100%;
  aspect-ratio: 4 / 5;

  object-fit: cover;
  object-position: center 30%;

  border-radius: 2px;
}

.polaroid figcaption {
  padding-top: 8px;

  font-family: var(--font-hand);
  font-size: 24px;
  line-height: 1.1;

  color: #4a3560;
}

.polaroid small {
  font-size: 17px;

  opacity: 0.6;
}

.tape {
  position: absolute;

  top: -12px;
  left: 50%;

  width: 80px;
  height: 24px;

  transform: translateX(-50%) rotate(-3deg);

  background: rgba(214, 180, 240, 0.7);

  box-shadow: 0 2px 4px rgba(60, 35, 85, 0.1);
}

.replay {
  margin-top: 12px;
}

@keyframes drop {
  from {
    opacity: 0;

    transform: translateY(-150px) rotate(-14deg) scale(1.12);
  }
}
</style>
