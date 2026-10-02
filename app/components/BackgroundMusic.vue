<script setup lang="ts">
import mainTrack from '~/assets/audio/birthday-piano.mp3'
import finalTrack from '~/assets/audio/highlang.mp3'

// Piano on every page, highlang on /final.
const route = useRoute()

let main: HTMLAudioElement
let final: HTMLAudioElement
let unlocked = false

const wanted = () => (route.path.startsWith('/final') ? final : main)

const sync = () => {
  const target = wanted()

  for (const a of [main, final]) {
    if (a !== target) a.pause()
  }

  if (!unlocked) return

  target.play().catch(() => {
    // browser still blocking: wait for the next tap
    unlocked = false
    arm()
  })
}

// Browsers only allow sound after a tap, so start on the first one.
const unlock = () => {
  unlocked = true
  removeEventListener('pointerdown', unlock)
  removeEventListener('keydown', unlock)
  sync()
}

const arm = () => {
  addEventListener('pointerdown', unlock)
  addEventListener('keydown', unlock)
}

// Pause the music while the voice message (or any other <audio>) is playing.
const paused = new Set<HTMLAudioElement>()

const onOtherPlay = (e: Event) => {
  const t = e.target
  if (!(t instanceof HTMLAudioElement) || t === main || t === final) return

  for (const a of [main, final]) {
    if (!a.paused) {
      a.pause()
      paused.add(a)
    }
  }
}

const onOtherStop = (e: Event) => {
  const t = e.target
  if (!(t instanceof HTMLAudioElement) || t === main || t === final) return

  paused.forEach((a) => {
    if (a === wanted()) a.play().catch(() => {})
  })
  paused.clear()
}

onMounted(() => {
  main = new Audio(mainTrack)
  final = new Audio(finalTrack)

  for (const a of [main, final]) {
    a.loop = true
    a.volume = 0.6
  }

  document.addEventListener('play', onOtherPlay, true)
  document.addEventListener('pause', onOtherStop, true)
  document.addEventListener('ended', onOtherStop, true)

  unlocked = true
  sync() // works if the browser already allows sound; otherwise arms below
  if (main.paused) {
    unlocked = false
    arm()
  }
})

watch(() => route.path, () => {
  if (main && final) sync()
})

onBeforeUnmount(() => {
  main?.pause()
  final?.pause()
  removeEventListener('pointerdown', unlock)
  removeEventListener('keydown', unlock)
  document.removeEventListener('play', onOtherPlay, true)
  document.removeEventListener('pause', onOtherStop, true)
  document.removeEventListener('ended', onOtherStop, true)
})
</script>

<template>
  <span hidden></span>
</template>
