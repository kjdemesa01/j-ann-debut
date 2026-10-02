<script setup lang="ts">
// Deterministic values (no Math.random) so server and client render the same.
const symbols = ['💜', '✨', '🤍', '💜', '✨']

const items = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  symbol: symbols[i % symbols.length],
  left: (i * 53 + 11) % 100,
  size: 12 + ((i * 7) % 16),
  delay: -((i * 37) % 180) / 10,
  duration: 14 + ((i * 5) % 12),
  drift: (i % 2 ? 1 : -1) * (10 + ((i * 13) % 30)),
  opacity: 0.25 + ((i * 17) % 40) / 100,
}))
</script>

<template>
  <div class="ambient" aria-hidden="true">
    <div class="blob blob-one"></div>
    <div class="blob blob-two"></div>
    <div class="blob blob-three"></div>

    <span
      v-for="item in items"
      :key="item.id"
      class="float"
      :style="{
        left: `${item.left}%`,
        fontSize: `${item.size}px`,
        opacity: item.opacity,
        animationDuration: `${item.duration}s`,
        animationDelay: `${item.delay}s`,
        '--drift': `${item.drift}px`,
      }"
    >
      {{ item.symbol }}
    </span>
  </div>
</template>

<style scoped>
.ambient {
  position: fixed;
  inset: 0;
  z-index: 0;

  overflow: hidden;
  pointer-events: none;

  background:
    radial-gradient(
      circle at 50% 10%,
      #f7f0ff 0%,
      #dfccef 45%,
      #b99bd8 100%
    );
}

.blob {
  position: absolute;

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.22);

  filter: blur(40px);

  animation: drift 18s ease-in-out infinite alternate;
}

.blob-one {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
}

.blob-two {
  width: 380px;
  height: 380px;
  right: -160px;
  bottom: -140px;
  animation-delay: -6s;
}

.blob-three {
  width: 220px;
  height: 220px;
  top: 45%;
  left: 55%;
  background: rgba(214, 170, 240, 0.25);
  animation-delay: -11s;
}

.float {
  position: absolute;
  bottom: -40px;

  animation: rise linear infinite;

  will-change: transform;
}

@keyframes rise {
  from {
    transform: translate3d(0, 0, 0) rotate(0deg);
  }

  to {
    transform: translate3d(var(--drift), -120vh, 0) rotate(25deg);
  }
}

@keyframes drift {
  from {
    transform: translate(0, 0) scale(1);
  }

  to {
    transform: translate(30px, 40px) scale(1.12);
  }
}
</style>
