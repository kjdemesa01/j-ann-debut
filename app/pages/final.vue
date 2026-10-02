<script setup lang="ts">
// Memes: every video in app/assets/memes is used automatically.
// Files whose name starts with "greenscreen" get their green background removed.
const clipModules = import.meta.glob('../assets/memes/*.mp4', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

// Crop around the subject of each green-screen clip: [x, y, width, height] in video pixels.
const crops: Record<string, [number, number, number, number]> = {
  greenscreen1: [210, 15, 220, 330],
  greenscreen2: [185, 83, 240, 253],
}

const clips = Object.keys(clipModules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((key) => {
    const name = key.split('/').pop()!.replace('.mp4', '')

    return {
      src: clipModules[key] as string,
      keyed: name.startsWith('greenscreen'),
      crop: crops[name],
    }
  })

// mix green-screen and normal clips so they're spread around the page
const keyedClips = clips.filter((c) => c.keyed)
const plainClips = clips.filter((c) => !c.keyed)
const mixed: typeof clips = []

for (let i = 0; i < Math.max(keyedClips.length, plainClips.length); i++) {
  if (plainClips[i]) mixed.push(plainClips[i]!)
  if (keyedClips[i]) mixed.push(keyedClips[i]!)
}

// Deterministic layout (no Math.random) so server and client render the same.
// Order: top-left, top-right, bottom-left, bottom-right, left, right, top-middle, bottom-middle
const spots: Record<string, string>[] = [
  { left: '2%', top: '2%' },
  { right: '2%', top: '4%' },
  { left: '3%', bottom: '3%' },
  { right: '3%', bottom: '2%' },
  { left: '1%', top: '38%' },
  { right: '1%', top: '42%' },
  { left: '37%', top: '1%' },
  { left: '36%', bottom: '1%' },
]

const memes = mixed.slice(0, spots.length).map((clip, i) => ({
  id: i,
  ...clip,
  style: {
    ...spots[i],
    width: clip.keyed ? 'clamp(100px, 22vw, 250px)' : 'clamp(135px, 31vw, 330px)',
    '--tilt': `${((i * 37) % 31) - 15}deg`,
    animationDelay: `${-((i * 13) % 20) / 10}s`,
    animationDuration: `${1.6 + ((i * 7) % 12) / 10}s`,
  },
}))

// raining confetti
const colors = ['#ff2bd6', '#00e5ff', '#ffe600', '#7cff4d', '#ffffff', '#ff7a1a', '#9b6bff']

const confetti = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  left: (i * 37 + 5) % 100,
  color: colors[i % colors.length],
  size: 6 + ((i * 5) % 9),
  duration: 3 + ((i * 11) % 30) / 10,
  delay: -((i * 17) % 60) / 10,
  sway: (i % 2 ? 1 : -1) * (20 + ((i * 23) % 70)),
  rot: (i * 53) % 360,
  round: i % 4 === 0,
}))

const beams = [
  { left: '8%', color: '255, 43, 214', delay: '0s' },
  { left: '28%', color: '0, 229, 255', delay: '-1.2s' },
  { left: '48%', color: '255, 230, 0', delay: '-2.4s' },
  { left: '68%', color: '124, 255, 77', delay: '-3.6s' },
  { left: '88%', color: '155, 107, 255', delay: '-0.6s' },
]
</script>

<template>
  <div class="final">

    <!-- disco background -->
    <div class="disco" aria-hidden="true">
      <div class="spin"></div>
      <div class="floor"></div>

      <span
        v-for="(beam, i) in beams"
        :key="i"
        class="beam"
        :style="{
          left: beam.left,
          animationDelay: beam.delay,
          '--beam': beam.color,
        }"
      ></span>
    </div>

    <!-- memes: top, sides and bottom -->
    <MemeVideo
      v-for="m in memes"
      :key="m.id"
      class="meme"
      :src="m.src"
      :keyed="m.keyed"
      :crop="m.crop"
      :style="m.style"
    />

    <!-- middle -->
    <div class="center">
      <div class="beat">💜</div>
      <h1 class="love">I love you</h1>
    </div>

    <!-- confetti rain -->
    <div class="rain" aria-hidden="true">
      <span
        v-for="c in confetti"
        :key="c.id"
        class="piece"
        :class="{ round: c.round }"
        :style="{
          left: `${c.left}%`,
          background: c.color,
          width: `${c.size}px`,
          height: `${c.size * 1.5}px`,
          animationDuration: `${c.duration}s`,
          animationDelay: `${c.delay}s`,
          '--sway': `${c.sway}px`,
          '--rot': `${c.rot}deg`,
        }"
      ></span>
    </div>

  </div>
</template>

<style scoped>
.final {
  position: fixed;
  inset: 0;
  z-index: 1;

  overflow: hidden;
}

/* ---------- disco background ---------- */

.disco {
  position: absolute;
  inset: 0;

  background: #14002a;
}

.spin {
  position: absolute;
  inset: -60%;

  background: conic-gradient(
    from 0deg,
    #ff2bd6,
    #5a2bff,
    #00e5ff,
    #7cff4d,
    #ffe600,
    #ff7a1a,
    #ff2bd6
  );

  filter: blur(70px);
  opacity: 0.6;

  animation: spin 9s linear infinite;
}

.floor {
  position: absolute;
  inset: 0;

  background:
    conic-gradient(
      #ff2bd6 25%,
      #00e5ff 0 50%,
      #ffe600 0 75%,
      #7cff4d 0
    )
    0 0 / 90px 90px;

  opacity: 0.22;

  mix-blend-mode: overlay;

  animation: flash 1.2s steps(2) infinite;
}

.beam {
  position: absolute;
  top: -10%;

  width: 22vw;
  height: 130%;

  background: linear-gradient(
    to bottom,
    rgba(var(--beam), 0.85),
    rgba(var(--beam), 0) 85%
  );

  clip-path: polygon(46% 0, 54% 0, 100% 100%, 0 100%);

  mix-blend-mode: screen;

  transform-origin: 50% 0;

  animation: sweep 3.4s ease-in-out infinite alternate;
}

/* ---------- memes ---------- */

.meme {
  position: absolute;
  z-index: 2;

  animation: wobble ease-in-out infinite alternate;
}

/* ---------- middle ---------- */

.center {
  position: absolute;
  inset: 0;
  z-index: 3;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;

  pointer-events: none;
}

.beat {
  font-size: clamp(48px, 12vw, 96px);
  line-height: 1;

  animation: beat 0.9s ease-in-out infinite;
}

.love {
  margin: 6px 0 0;

  font-size: clamp(56px, 17vw, 170px);
  line-height: 1;
  color: #fff;

  text-shadow:
    0 0 10px #fff,
    0 0 26px #ff2bd6,
    0 0 54px #ff2bd6,
    0 0 90px #00e5ff;

  animation:
    beat 0.9s ease-in-out infinite,
    glow 3s linear infinite;
}

/* ---------- confetti ---------- */

.rain {
  position: absolute;
  inset: 0;
  z-index: 5;

  overflow: hidden;
  pointer-events: none;
}

.piece {
  position: absolute;
  top: -30px;

  border-radius: 2px;

  animation: fall linear infinite;
}

.piece.round {
  border-radius: 50%;
}

/* ---------- keyframes ---------- */

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes flash {
  50% {
    filter: hue-rotate(180deg);
  }
}

@keyframes sweep {
  from {
    transform: rotate(-35deg);
  }

  to {
    transform: rotate(35deg);
  }
}

@keyframes wobble {
  from {
    transform: rotate(calc(var(--tilt) - 8deg)) scale(0.95);
  }

  to {
    transform: rotate(calc(var(--tilt) + 8deg)) scale(1.08);
  }
}

@keyframes beat {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.12);
  }
}

@keyframes glow {
  to {
    filter: hue-rotate(360deg);
  }
}

@keyframes fall {
  from {
    transform: translate3d(0, 0, 0) rotate(var(--rot));
  }

  to {
    transform:
      translate3d(var(--sway), 110vh, 0)
      rotate(calc(var(--rot) + 720deg));
  }
}
</style>
