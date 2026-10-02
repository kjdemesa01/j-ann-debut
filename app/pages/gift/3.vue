<script setup lang="ts">
// TODO: edit what the card reveals
const special = {
  emoji: '🎁',
  title: 'Your Special Surprise',
  description: 'This one is waiting for you in real life. Come find me. 💜',
}

const revealed = ref(false)

const reveal = () => {
  revealed.value = true
}
</script>

<template>
  <GiftFrame
    :id="3"
    title="Something Special"
  >

    <ConfettiBurst :active="revealed" />

    <p class="hint">
      {{ revealed ? 'Surprise! 💜' : 'Tap the card to reveal it' }}
    </p>

    <div
      class="flip"
      :class="{ flipped: revealed }"
      @click="reveal"
    >
      <div class="flip-inner">

        <!-- FRONT -->
        <div class="face front">
          <span class="corner tl">✨</span>
          <span class="corner tr">✨</span>
          <span class="corner bl">✨</span>
          <span class="corner br">✨</span>

          <div class="front-emoji">
            🎁
          </div>

          <p class="front-text">
            Tap to reveal
          </p>
        </div>

        <!-- BACK -->
        <div class="face back">
          <div class="back-emoji">
            {{ special.emoji }}
          </div>

          <h2>
            {{ special.title }}
          </h2>

          <p>
            {{ special.description }}
          </p>
        </div>

      </div>
    </div>

  </GiftFrame>
</template>

<style scoped>
.hint {
  margin: -12px 0 24px;

  font-size: 14px;

  opacity: 0.7;
}

.flip {
  width: min(100%, 300px);
  height: 380px;

  margin: 0 auto;

  perspective: 1100px;

  cursor: pointer;

  -webkit-tap-highlight-color: transparent;
}

.flip.flipped {
  cursor: default;
}

.flip-inner {
  position: relative;

  width: 100%;
  height: 100%;

  transform-style: preserve-3d;

  transition: transform 0.95s cubic-bezier(.4, .2, .2, 1);
}

.flip.flipped .flip-inner {
  transform: rotateY(180deg);
}

.face {
  position: absolute;
  inset: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 28px;

  border-radius: 28px;

  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

/* front */

.front {
  color: #fff;

  background:
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.25), transparent 50%),
    linear-gradient(145deg, #8a5cb8, #5d3b86);

  border: 2px solid rgba(230, 195, 92, 0.85);

  box-shadow:
    0 22px 45px rgba(60, 35, 85, 0.35),
    inset 0 0 0 8px rgba(255, 255, 255, 0.08);
}

.front-emoji {
  font-size: 84px;

  animation: pulse 2s ease-in-out infinite;
}

.front-text {
  margin: 18px 0 0;

  font-family: var(--font-display);
  font-size: 22px;
  letter-spacing: 1px;
}

.corner {
  position: absolute;

  font-size: 18px;

  animation: twinkle 2.4s ease-in-out infinite;
}

.tl { top: 18px; left: 18px; }
.tr { top: 18px; right: 18px; animation-delay: 0.6s; }
.bl { bottom: 18px; left: 18px; animation-delay: 1.2s; }
.br { bottom: 18px; right: 18px; animation-delay: 1.8s; }

/* back */

.back {
  transform: rotateY(180deg);

  text-align: center;

  background: rgba(255, 255, 255, 0.92);

  border: 1px solid rgba(255, 255, 255, 0.9);

  box-shadow:
    0 22px 45px rgba(60, 35, 85, 0.3),
    inset 0 0 0 6px rgba(155, 107, 201, 0.12);
}

.back-emoji {
  font-size: 72px;
}

.back h2 {
  margin: 16px 0 10px;

  font-size: 28px;
  line-height: 1.15;
}

.back p {
  margin: 0;

  font-size: 16px;
  line-height: 1.5;

  opacity: 0.85;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes twinkle {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.4); opacity: 1; }
}
</style>
