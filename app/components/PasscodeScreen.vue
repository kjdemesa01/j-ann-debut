<script setup lang="ts">
const correctPassword = '100408'

const enteredPassword = ref('')
const errorMessage = ref('')
const unlocked = ref(false)
const shake = ref(false)

const enterNumber = (number: string) => {
  if (unlocked.value || shake.value || enteredPassword.value.length >= 6) return

  enteredPassword.value += number
  errorMessage.value = ''

  if (enteredPassword.value.length < 6) return

  if (enteredPassword.value === correctPassword) {
    unlocked.value = true

    setTimeout(() => {
      navigateTo('/birthday')
    }, 900)
  } else {
    errorMessage.value = 'Hmm... try again, birthday girl 💜'
    shake.value = true

    setTimeout(() => {
      enteredPassword.value = ''
      errorMessage.value = ''
      shake.value = false
    }, 900)
  }
}

const deleteNumber = () => {
  if (unlocked.value || shake.value) return

  enteredPassword.value = enteredPassword.value.slice(0, -1)
  errorMessage.value = ''
}

// physical keyboard support
const onKeydown = (event: KeyboardEvent) => {
  if (/^[0-9]$/.test(event.key)) enterNumber(event.key)
  else if (event.key === 'Backspace') deleteNumber()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="passcode-page">
    <div
      class="content"
      :class="{ unlocked }"
    >
      <div class="lock">
        {{ unlocked ? '🔓' : '🔐' }}
      </div>

      <p class="eyebrow">
        A little surprise for you...
      </p>

      <p class="subtitle">
        For bebe yangyang only. 💜
      </p>

      <div
        class="dots"
        :class="{ shake, success: unlocked }"
      >
        <span
          v-for="index in 6"
          :key="index"
          :class="{ filled: index <= enteredPassword.length }"
        ></span>
      </div>

      <p class="hint">
        {{ errorMessage || (unlocked ? 'Welcome in 💜' : 'Enter your birthday') }}
      </p>

      <div class="keypad">
        <button
          v-for="number in ['1','2','3','4','5','6','7','8','9']"
          :key="number"
          class="key"
          @click="enterNumber(number)"
        >
          {{ number }}
        </button>

        <button
          class="key empty"
          disabled
        ></button>

        <button
          class="key"
          @click="enterNumber('0')"
        >
          0
        </button>

        <button
          class="key delete"
          aria-label="Delete"
          @click="deleteNumber"
        >
          ←
        </button>
      </div>

      <p class="from">
        From Kurtin😙💙
      </p>
    </div>
  </div>
</template>

<style scoped>
.passcode-page {
  position: relative;
  z-index: 1;

  min-height: 100vh;
  min-height: 100dvh;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 24px 16px;

  overflow: hidden;
}

.content {
  width: min(100%, 360px);

  padding: 34px 26px 26px;

  text-align: center;

  border-radius: 36px;

  background: var(--glass);
  border: 1px solid var(--glass-border);

  box-shadow: var(--shadow-soft);

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.lock {
  margin-bottom: 12px;

  font-size: 44px;

  animation: bob 3s ease-in-out infinite;
}

.content.unlocked .lock {
  animation: pop 0.5s ease;
}

.subtitle {
  margin: 8px 0 0;

  font-family: var(--font-display);
  font-size: 20px;

  color: var(--title);
}

/* dots */

.dots {
  display: flex;
  justify-content: center;
  gap: 14px;

  margin: 28px 0 12px;
}

.dots span {
  width: 13px;
  height: 13px;

  border-radius: 50%;

  border: 2px solid var(--primary);

  transition:
    background 0.2s,
    transform 0.2s,
    box-shadow 0.2s,
    border-color 0.2s;
}

.dots span.filled {
  background: var(--primary);

  transform: scale(1.15);

  box-shadow: 0 0 10px rgba(118, 81, 154, 0.5);
}

.dots.shake {
  animation: shake 0.45s ease;
}

.dots.shake span {
  border-color: #b0446f;
}

.dots.shake span.filled {
  background: #b0446f;
  box-shadow: 0 0 10px rgba(176, 68, 111, 0.5);
}

.dots.success span {
  border-color: #d9a935;
}

.dots.success span.filled {
  background: #d9a935;
  box-shadow: 0 0 12px rgba(217, 169, 53, 0.6);
}

.hint {
  min-height: 20px;

  margin: 0 0 20px;

  font-size: 13px;

  opacity: 0.75;
}

/* keypad */

.keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  gap: 12px;

  max-width: 280px;

  margin: auto;
}

.key {
  height: 60px;

  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 20px;

  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.85),
      rgba(255, 255, 255, 0.5)
    );

  color: #55366f;

  font-size: 22px;
  font-weight: 600;

  cursor: pointer;

  -webkit-tap-highlight-color: transparent;

  box-shadow: 0 6px 14px rgba(77, 48, 102, 0.12);

  transition:
    transform 0.15s,
    background 0.15s,
    box-shadow 0.15s;
}

@media (hover: hover) {
  .key:hover {
    transform: translateY(-2px);

    box-shadow: 0 10px 18px rgba(77, 48, 102, 0.18);
  }
}

.key:active {
  transform: scale(0.92);

  background: rgba(255, 255, 255, 0.95);
}

.key.empty {
  visibility: hidden;
}

.key.delete {
  font-size: 22px;
}

.from {
  margin: 26px 0 0;

  font-family: var(--font-hand);
  font-size: 20px;

  opacity: 0.8;
}

@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes pop {
  0% { transform: scale(0.6); }
  60% { transform: scale(1.25); }
  100% { transform: scale(1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-9px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(4px); }
}
</style>
