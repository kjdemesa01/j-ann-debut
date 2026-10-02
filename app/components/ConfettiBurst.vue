<script setup lang="ts">
defineProps<{ active: boolean }>()

const colors = ['#9b6bc9', '#e6c35c', '#ffffff', '#f4a6d7', '#b99bd8']

const pieces = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  left: (i * 29 + 7) % 100,
  color: colors[i % colors.length],
  delay: ((i * 7) % 10) / 10,
  duration: 2.6 + ((i * 11) % 15) / 10,
  size: 7 + ((i * 5) % 7),
  sway: (i % 2 ? 1 : -1) * (20 + ((i * 17) % 50)),
  rot: (i * 47) % 360,
  round: i % 3 === 0,
}))
</script>

<template>
  <div
    v-if="active"
    class="confetti"
    aria-hidden="true"
  >
    <span
      v-for="piece in pieces"
      :key="piece.id"
      class="piece"
      :class="{ round: piece.round }"
      :style="{
        left: `${piece.left}%`,
        background: piece.color,
        width: `${piece.size}px`,
        height: `${piece.size * 1.5}px`,
        animationDelay: `${piece.delay}s`,
        animationDuration: `${piece.duration}s`,
        '--sway': `${piece.sway}px`,
        '--rot': `${piece.rot}deg`,
      }"
    ></span>
  </div>
</template>

<style scoped>
.confetti {
  position: fixed;
  inset: 0;
  z-index: 60;

  overflow: hidden;
  pointer-events: none;
}

.piece {
  position: absolute;
  top: -20px;

  border-radius: 2px;

  opacity: 0;

  animation: confetti-fall linear forwards;
}

.piece.round {
  border-radius: 50%;
}

@keyframes confetti-fall {
  0% {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotate(var(--rot));
  }

  85% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform:
      translate3d(var(--sway), 110vh, 0)
      rotate(calc(var(--rot) + 540deg));
  }
}
</style>
