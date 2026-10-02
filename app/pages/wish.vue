<script setup lang="ts">
const candles = ref([true, true, true])

const candlesBlown = computed(() => {
  return candles.value.every(candle => !candle)
})

const blowCandle = (index: number) => {
  candles.value[index] = false
}

watch(candlesBlown, (blown) => {
  if (blown) {
    setTimeout(() => {
      navigateTo('/message')
    }, 2200)
  }
})
</script>

<template>
  <div class="wish-page">
    <ConfettiBurst :active="candlesBlown" />

    <div class="content">

      <p class="eyebrow">
        Make a wish...
      </p>

      <h1>
        Your wish starts here ✨
      </h1>

      <p class="instruction">
        Tap each candle to blow it out
      </p>

      <div class="cake-area">

        <div class="cake">

          <div class="candles">
            <button
              v-for="(lit, index) in candles"
              :key="index"
              class="candle"
              :class="{ blown: !lit }"
              aria-label="Blow out candle"
              @click="blowCandle(index)"
            >
              <span
                v-if="lit"
                class="flame"
              ></span>

              <span
                v-else
                class="smoke"
              ></span>

              <span class="wick"></span>

              <span class="candle-body"></span>
            </button>
          </div>

          <div class="cake-top"></div>

          <div class="cake-middle"></div>

          <div class="cake-bottom"></div>

          <div class="plate"></div>

        </div>

      </div>

      <Transition name="wish">
        <div
          v-if="candlesBlown"
          class="wish-complete"
        >
          <div class="sparkles">
            ✨ ✨ ✨
          </div>

          <h2>
            Wish made. 💜
          </h2>

          <p>
            I have something to say...
          </p>
        </div>
      </Transition>

    </div>
  </div>
</template>

<style scoped>
.wish-page {
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
  width: min(90%, 500px);

  text-align: center;
}

h1 {
  margin: 10px 0 6px;

  font-size: clamp(32px, 7vw, 46px);
  line-height: 1.15;
}

.instruction {
  margin: 0;

  font-size: 14px;

  opacity: 0.7;

  animation: nudge 2s ease-in-out infinite;
}

/* =========================
   CAKE
   ========================= */

.cake-area {
  height: 340px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.cake {
  position: relative;

  width: 280px;
  height: 250px;
}

.candles {
  position: absolute;

  top: 0;
  left: 50%;

  transform: translateX(-50%);

  display: flex;

  gap: 28px;

  z-index: 5;
}

.candle {
  position: relative;

  width: 42px;
  height: 110px;

  border: none;

  background: transparent;

  cursor: pointer;

  -webkit-tap-highlight-color: transparent;
}

.candle-body {
  position: absolute;

  bottom: 0;
  left: 50%;

  transform: translateX(-50%);

  width: 20px;
  height: 75px;

  border-radius: 6px;

  background:
    repeating-linear-gradient(
      135deg,
      #ffffff 0px,
      #ffffff 7px,
      #d8bff0 7px,
      #d8bff0 14px
    );

  box-shadow: 0 4px 8px rgba(77, 48, 102, 0.2);
}

.wick {
  position: absolute;

  top: 27px;
  left: 50%;

  width: 3px;
  height: 10px;

  transform: translateX(-50%);

  background: #594354;

  z-index: 2;
}

.flame {
  position: absolute;

  top: 3px;
  left: 50%;

  width: 15px;
  height: 26px;

  transform: translateX(-50%);
  transform-origin: 50% 100%;

  border-radius: 50% 50% 50% 50% / 62% 62% 38% 38%;

  background:
    radial-gradient(
      ellipse at 50% 75%,
      #fff6c9 0%,
      #ffd45a 40%,
      #ff9a2e 85%
    );

  box-shadow:
    0 0 14px 6px rgba(255, 200, 80, 0.55),
    0 0 36px 16px rgba(255, 170, 60, 0.25);

  animation: flicker 0.7s ease-in-out infinite alternate;
}

.smoke {
  position: absolute;

  top: 12px;
  left: 50%;

  width: 10px;
  height: 10px;

  border-radius: 50%;

  background: rgba(120, 100, 140, 0.45);

  filter: blur(4px);

  animation: smoke 1.6s ease-out forwards;
}

.candle.blown .candle-body {
  opacity: 0.7;
}

.candle.blown .wick {
  background: #333;
}

/* layers */

.cake-top {
  position: absolute;

  left: 50%;
  top: 92px;

  transform: translateX(-50%);

  width: 250px;
  height: 55px;

  border-radius: 50%;

  background:
    radial-gradient(
      ellipse at 50% 40%,
      #ffffff 0%,
      #fbeaff 60%,
      #f1d6fb 100%
    );

  border: 3px solid #c9a0e3;

  z-index: 3;
}

.cake-middle {
  position: absolute;

  left: 50%;
  top: 120px;

  transform: translateX(-50%);

  width: 250px;
  height: 70px;

  border-radius: 0 0 18px 18px;

  /* frosting scallops + sprinkles + body */
  background:
    radial-gradient(circle at 14px 0, #fff4ff 13px, transparent 14px) 0 0 / 28px 26px repeat-x,
    radial-gradient(circle, rgba(255, 255, 255, 0.7) 2px, transparent 3px) 6px 34px / 22px 22px,
    linear-gradient(180deg, #e2c4f1, #d0a9e6);

  z-index: 2;
}

.cake-bottom {
  position: absolute;

  left: 50%;
  top: 175px;

  transform: translateX(-50%);

  width: 275px;
  height: 65px;

  border-radius: 0 0 26px 26px;

  background:
    radial-gradient(circle, rgba(255, 255, 255, 0.55) 2px, transparent 3px) 0 24px / 22px 22px,
    linear-gradient(180deg, #c9a2e2, #ae83cf);

  box-shadow: 0 14px 24px rgba(77, 48, 102, 0.25);

  z-index: 1;
}

.plate {
  position: absolute;

  left: 50%;
  top: 225px;

  transform: translateX(-50%);

  width: 315px;
  height: 26px;

  border-radius: 50%;

  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.9),
      rgba(255, 255, 255, 0.55)
    );

  box-shadow: 0 8px 16px rgba(77, 48, 102, 0.15);
}

/* =========================
   COMPLETE
   ========================= */

.wish-complete {
  position: fixed;

  inset: 0;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  background: rgba(94, 60, 115, 0.35);

  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  z-index: 20;
}

.wish-complete h2 {
  margin: 10px 0;

  font-size: 42px;

  color: #ffffff;
}

.wish-complete p {
  margin: 0;

  color: #ffffff;
}

.sparkles {
  font-size: 25px;
}

/* =========================
   ANIMATIONS
   ========================= */

@keyframes flicker {
  from { transform: translateX(-50%) scale(1, 1) rotate(-2deg); }
  to { transform: translateX(-50%) scale(0.92, 1.1) rotate(2deg); }
}

@keyframes smoke {
  0% { opacity: 0.8; transform: translate(-50%, 0) scale(0.6); }
  100% { opacity: 0; transform: translate(-30%, -45px) scale(2.4); }
}

@keyframes nudge {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.wish-enter-active {
  animation: appear 0.6s ease;
}

@keyframes appear {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}
</style>
