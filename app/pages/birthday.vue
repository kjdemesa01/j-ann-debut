<script setup lang="ts">
const showContent = ref(false)

onMounted(() => {
  setTimeout(() => {
    showContent.value = true
  }, 300)
})
</script>

<template>
  <div class="birthday-page">
    <ConfettiBurst :active="showContent" />

    <div
      class="birthday-content"
      :class="{ visible: showContent }"
    >
      <p class="eyebrow">
        Today is a special day...
      </p>

      <h1>
        Happy 18th Birthday,
        <br>
        J-ann! 💜
      </h1>

      <div class="photo-wrap">
        <span class="sparkle s1">✨</span>
        <span class="sparkle s2">💜</span>
        <span class="sparkle s3">✨</span>

        <div class="photo-frame">
          <img
            src="~/assets/j-ann.jpg"
            alt="J-ann"
            class="birthday-photo"
          />
        </div>
      </div>

      <p class="message">
        Welcome to your 18th birthday. ✨
      </p>

      <p class="from">
        With love, Kurtin 😙💙
      </p>

      <button
        class="continue-button"
        @click="navigateTo('/wish')"
      >
        Continue
        <span>→</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.birthday-page {
  position: relative;
  z-index: 1;

  min-height: 100vh;
  min-height: 100dvh;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 30px 20px;

  overflow: hidden;
}

.birthday-content {
  width: min(90%, 430px);

  text-align: center;
}

/* staggered reveal */

.birthday-content > * {
  opacity: 0;
  transform: translateY(22px);

  transition:
    opacity 0.8s ease,
    transform 0.8s ease;
}

.birthday-content.visible > * {
  opacity: 1;
  transform: translateY(0);
}

.birthday-content.visible > :nth-child(2) { transition-delay: 0.15s; }
.birthday-content.visible > :nth-child(3) { transition-delay: 0.3s; }
.birthday-content.visible > :nth-child(4) { transition-delay: 0.5s; }
.birthday-content.visible > :nth-child(5) { transition-delay: 0.65s; }
.birthday-content.visible > :nth-child(6) { transition-delay: 0.8s; }

h1 {
  margin: 10px 0 28px;

  font-size: clamp(32px, 8vw, 48px);
  font-weight: 600;
  line-height: 1.15;

  background: linear-gradient(135deg, #583878, #9b6bc9 55%, #583878);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* photo */

.photo-wrap {
  position: relative;

  width: 240px;

  margin: 0 auto 28px;
}

.photo-frame {
  position: relative;

  width: 240px;
  height: 300px;

  padding: 8px;

  background: rgba(255, 255, 255, 0.8);

  border-radius: 120px 120px 25px 25px;

  box-shadow:
    0 18px 45px rgba(75, 45, 100, 0.22),
    0 0 0 6px rgba(255, 255, 255, 0.35);

  transform: rotate(-2deg);
}

.birthday-photo {
  width: 100%;
  height: 100%;

  object-fit: cover;

  border-radius: 112px 112px 18px 18px;
}

.sparkle {
  position: absolute;
  z-index: 2;

  font-size: 22px;

  animation: twinkle 2.4s ease-in-out infinite;
}

.s1 { top: -6px; left: -18px; }
.s2 { top: 90px; right: -22px; animation-delay: 0.8s; }
.s3 { bottom: 10px; left: -22px; animation-delay: 1.6s; }

/* text */

.message {
  margin: 0;

  font-size: 16px;

  opacity: 0.85;
}

.from {
  margin: 6px 0 0;

  font-family: var(--font-hand);
  font-size: 24px;
}

.continue-button {
  margin-top: 26px;
}

@keyframes twinkle {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; }
  50% { transform: scale(1.3) rotate(12deg); opacity: 1; }
}
</style>
