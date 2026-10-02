<script setup lang="ts">
import giftImage from '~/assets/gift.png'

const { openedIds, load, markOpened } = useOpenedGifts()

const gifts = computed(() => [
  { id: 1, title: 'A Memory' },
  { id: 2, title: 'A Letter' },
  { id: 3, title: 'Something Special' },
].map(gift => ({
  ...gift,
  opened: openedIds.value.includes(gift.id),
})))

const openedCount = computed(() => {
  return gifts.value.filter(gift => gift.opened).length
})

const allOpened = computed(() => {
  return openedCount.value === gifts.value.length
})

const showPopup = ref(false)
const navigating = ref(false)

onMounted(() => {
  load()

  // Coming back with all 3 opened -> show the popup
  nextTick(() => {
    if (allOpened.value) {
      setTimeout(() => {
        showPopup.value = true
      }, 500)
    }
  })
})

const openGift = (id: number) => {
  const gift = gifts.value.find(gift => gift.id === id)

  if (!gift || navigating.value) return

  navigating.value = true

  // Already opened before: go straight in
  if (gift.opened) {
    navigateTo(`/gift/${id}`)
    return
  }

  markOpened(id)

  setTimeout(() => {
    navigateTo(`/gift/${id}`)
  }, 800)
}
</script>

<template>
  <div class="gifts-page">

    <div class="content">

      <p class="eyebrow">
        A few surprises for you...
      </p>

      <h1>
        Your Gifts 💜
      </h1>

      <p class="instruction">
        Open them in any order.
      </p>

      <div class="gift-count">
        {{ openedCount }} / 3 opened
      </div>

      <div class="gifts">

        <button
          v-for="gift in gifts"
          :key="gift.id"
          class="gift"
          :class="{ opened: gift.opened }"
          @click="openGift(gift.id)"
        >

          <div class="gift-visual">

            <div class="gift-shadow"></div>

            <!-- BOX BODY (everything under the lid seam) -->
            <img
              :src="giftImage"
              class="gift-box"
              alt=""
              draggable="false"
            />

            <!-- LIGHT FROM INSIDE -->
            <div class="gift-glow"></div>

            <!-- LID + BOW (everything above the lid seam) -->
            <img
              :src="giftImage"
              class="gift-lid"
              alt=""
              draggable="false"
            />

          </div>

          <p>
            {{ gift.opened ? gift.title : `Gift ${gift.id}` }}
          </p>

        </button>

      </div>

      <Transition name="popup">

        <div
          v-if="showPopup"
          class="popup-overlay"
        >

          <div class="popup-card">

            <div class="sparkles">
              ✨ ✨ ✨
            </div>

            <p class="popup-small">
              You opened them all!
            </p>

            <div class="tease-emoji">
              🤪
            </div>

            <h2>
              One last surprise...
            </h2>

            <p class="popup-message">
              Kurt has one more thing for you. 💜
            </p>

            <button
              class="continue-button"
              @click="navigateTo('/final')"
            >
              Continue
              <span>→</span>
            </button>

          </div>

        </div>

      </Transition>

    </div>

  </div>
</template>

<style scoped>

.gifts-page {
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

.content {
  width: 100%;
  max-width: 760px;

  text-align: center;
}


/* =========================
   TEXT
   ========================= */

h1 {
  margin: 10px 0 6px;

  font-size: clamp(36px, 8vw, 50px);
  font-weight: 600;
  line-height: 1.1;
}

.instruction {
  margin: 0 0 18px;

  font-size: 15px;

  opacity: 0.75;
}


/* =========================
   COUNT
   ========================= */

.gift-count {
  width: fit-content;

  margin: 0 auto 36px;

  padding: 8px 18px;

  border-radius: 20px;

  background: rgba(255, 255, 255, 0.6);
  border: 1px solid var(--glass-border);

  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;

  box-shadow: 0 6px 18px rgba(77, 48, 102, 0.1);
}


/* =========================
   GIFTS
   ========================= */

.gifts {
  display: flex;

  justify-content: center;
  align-items: flex-start;

  gap: 30px;

  flex-wrap: wrap;
}

.gift {
  position: relative;

  width: 200px;

  padding: 0;

  border: none;

  background: transparent;

  cursor: pointer;

  -webkit-tap-highlight-color: transparent;

  transition: transform 0.25s ease;
}

.gift:active {
  transform: scale(0.96);
}

@media (hover: hover) {
  .gift:not(.opened):hover {
    transform: translateY(-6px);
  }
}


/* =========================
   GIFT VISUAL
   (image is 1:1 — the lid/box seam
   is slanted, so both layers are
   clipped with the SAME polygon edge)
   ========================= */

.gift-visual {
  position: relative;

  width: 200px;
  height: 200px;

  overflow: visible;
}

.gift-shadow {
  position: absolute;

  left: 14%;
  bottom: 8%;

  width: 72%;
  height: 12%;

  border-radius: 50%;

  background: rgba(60, 30, 90, 0.28);
  filter: blur(8px);
}

.gift-box,
.gift-lid {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: contain;

  pointer-events: none;
  user-select: none;
}

/* Box = below the seam */
.gift-box {
  clip-path: polygon(
    0 35.5%,
    36% 54.2%,
    100% 44.5%,
    100% 100%,
    0 100%
  );

  z-index: 1;
}

/* Lid = above the seam */
.gift-lid {
  clip-path: polygon(
    0 0,
    100% 0,
    100% 44.5%,
    36% 54.2%,
    0 35.5%
  );

  z-index: 3;

  transform-origin: 40% 55%;

  transition:
    transform 0.8s cubic-bezier(.2, .8, .2, 1),
    opacity 0.8s ease;
}

.gift-glow {
  position: absolute;

  left: 12%;
  top: 36%;

  width: 76%;
  height: 24%;

  border-radius: 50%;

  background:
    radial-gradient(
      ellipse at center,
      rgba(255, 244, 190, 0.95) 0%,
      rgba(255, 210, 90, 0.6) 40%,
      rgba(255, 210, 90, 0) 75%
    );

  filter: blur(4px);

  opacity: 0;

  z-index: 2;

  transition: opacity 0.5s ease 0.15s;

  pointer-events: none;
}


/* =========================
   OPENING
   ========================= */

.gift.opened .gift-lid {
  transform:
    translate(-6px, -62px)
    rotate(-12deg);

  opacity: 0;
}

.gift.opened .gift-glow {
  opacity: 1;
}


/* =========================
   LABEL
   ========================= */

.gift p {
  margin: 4px 0 0;

  font-family: var(--font-display);
  font-size: 16px;

  color: var(--title);

  text-align: center;
}

.gift.opened p {
  opacity: 0.75;
}


/* =========================
   POPUP
   ========================= */

.popup-overlay {
  position: fixed;
  inset: 0;

  z-index: 50;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(60, 30, 90, 0.45);

  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.popup-card {
  width: min(100%, 360px);

  padding: 32px 26px 28px;

  border-radius: 30px;

  text-align: center;

  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.8);

  box-shadow: 0 25px 60px rgba(77, 48, 102, 0.3);
}

.sparkles {
  margin-bottom: 8px;

  font-size: 18px;
}

.popup-small {
  margin: 0;

  font-size: 12px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;

  opacity: 0.65;
}

.tease-emoji {
  margin: 10px 0 4px;

  font-size: 56px;

  animation: wiggle 1.6s ease-in-out infinite;
}

.popup-card h2 {
  margin: 0 0 8px;

  font-size: 26px;
}

.popup-message {
  margin: 0 0 22px;

  font-size: 15px;

  opacity: 0.8;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-6deg); }
  50% { transform: rotate(6deg); }
}

.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.35s ease;
}

.popup-enter-active .popup-card {
  animation: pop-in 0.45s cubic-bezier(.2, 1.2, .3, 1);
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}

@keyframes pop-in {
  from { transform: scale(0.8) translateY(20px); }
  to { transform: scale(1) translateY(0); }
}


/* =========================
   MOBILE
   ========================= */

@media (max-width: 600px) {

  .gifts {
    gap: 6px;
  }

  .gift {
    width: 170px;
  }

  .gift-visual {
    width: 170px;
    height: 170px;
  }

  .gift.opened .gift-lid {
    transform:
      translate(-5px, -50px)
      rotate(-12deg);
  }
}

</style>
