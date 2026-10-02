<script setup lang="ts">
import audioSrc from '~/assets/audio/kurt-message.mp3'

const audio = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const audioError = ref(false)

const toggleAudio = async () => {
  if (!audio.value) return

  if (isPlaying.value) {
    audio.value.pause()
    return
  }

  try {
    await audio.value.play()
    audioError.value = false
  } catch {
    audioError.value = true
  }
}

const updateTime = () => {
  if (!audio.value) return

  currentTime.value = audio.value.currentTime
}

const audioLoaded = () => {
  if (!audio.value) return

  duration.value = audio.value.duration
}

const audioEnded = () => {
  isPlaying.value = false
}

// tap the bar to jump to that part
const seek = (event: MouseEvent) => {
  if (!audio.value || !duration.value) return

  const bar = event.currentTarget as HTMLElement
  const rect = bar.getBoundingClientRect()
  const ratio = (event.clientX - rect.left) / rect.width

  audio.value.currentTime = Math.min(Math.max(ratio, 0), 1) * duration.value
}

const formatTime = (time: number) => {
  if (!time || isNaN(time)) return '0:00'

  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const continueToGifts = () => {
  navigateTo('/gifts')
}
</script>

<template>
  <div class="message-page">

    <div class="message-content">

      <p class="eyebrow">
        Before you continue...
      </p>

      <h1>
        A message<br>
        from Kurt 💜
      </h1>

      <p class="intro">
        I wanted you to hear this from me.
      </p>

      <div class="letter-card">

        <div class="music-icon">
          🎧
        </div>

        <p class="recording-title">
          A little message for J-ann
        </p>

        <p class="recording-subtitle">
          From Kurt
        </p>

        <audio
          ref="audio"
          :src="audioSrc"
          @timeupdate="updateTime"
          @loadedmetadata="audioLoaded"
          @play="isPlaying = true"
          @pause="isPlaying = false"
          @ended="audioEnded"
          @error="audioError = true"
        />

        <button
          class="play-button"
          :class="{ playing: isPlaying }"
          :aria-label="isPlaying ? 'Pause' : 'Play'"
          @click="toggleAudio"
        >
          <span v-if="!isPlaying">
            ▶
          </span>

          <span v-else>
            ❚❚
          </span>
        </button>

        <div
          class="eq"
          :class="{ playing: isPlaying }"
        >
          <span
            v-for="n in 7"
            :key="n"
          ></span>
        </div>

        <div class="progress-area">

          <span>
            {{ formatTime(currentTime) }}
          </span>

          <div
            class="progress-bar"
            @click="seek"
          >
            <div
              class="progress"
              :style="{
                width: duration
                  ? `${(currentTime / duration) * 100}%`
                  : '0%'
              }"
            ></div>
          </div>

          <span>
            {{ formatTime(duration) }}
          </span>

        </div>

        <p class="listen-text">
          {{
            audioError
              ? 'This message isn’t ready yet 💜'
              : isPlaying
                ? 'Kurt is talking...'
                : 'Tap play to listen'
          }}
        </p>

      </div>

      <button
        class="continue-button"
        @click="continueToGifts"
      >
        I'm ready 💜
        <span>→</span>
      </button>

    </div>

  </div>
</template>

<style scoped>
.message-page {
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

.message-content {
  width: min(90%, 430px);

  text-align: center;
}

h1 {
  margin: 10px 0;

  font-size: clamp(36px, 8vw, 50px);
  font-weight: 600;
  line-height: 1.1;
}

.intro {
  margin: 12px 0 26px;

  font-size: 15px;

  opacity: 0.75;
}

.letter-card {
  padding: 34px 25px 26px;

  border-radius: 32px;

  background: var(--glass);
  border: 1px solid var(--glass-border);

  box-shadow: var(--shadow-soft);

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.music-icon {
  margin-bottom: 10px;

  font-size: 40px;
}

.recording-title {
  margin: 0;

  font-family: var(--font-display);
  font-size: 21px;

  color: var(--title);
}

.recording-subtitle {
  margin: 5px 0 22px;

  font-size: 13px;

  opacity: 0.6;
}

audio {
  display: none;
}

/* play button */

.play-button {
  position: relative;

  width: 78px;
  height: 78px;

  border: none;
  border-radius: 50%;

  background: linear-gradient(135deg, #9b6bc9, #6f47a3);

  color: white;

  font-size: 25px;

  cursor: pointer;

  -webkit-tap-highlight-color: transparent;

  box-shadow:
    0 10px 25px rgba(82, 52, 110, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);

  transition: transform 0.2s;
}

.play-button::after {
  content: '';

  position: absolute;
  inset: 0;

  border-radius: 50%;

  border: 2px solid rgba(155, 107, 201, 0.6);

  opacity: 0;
}

.play-button.playing::after {
  animation: ring 1.6s ease-out infinite;
}

@media (hover: hover) {
  .play-button:hover {
    transform: scale(1.06);
  }
}

.play-button:active {
  transform: scale(0.95);
}

/* equalizer */

.eq {
  display: flex;
  align-items: flex-end;
  justify-content: center;

  gap: 4px;

  height: 24px;

  margin-top: 18px;
}

.eq span {
  width: 4px;
  height: 6px;

  border-radius: 3px;

  background: var(--primary-light);

  opacity: 0.6;

  transition: height 0.3s;
}

.eq.playing span {
  opacity: 1;

  animation: eq 0.9s ease-in-out infinite alternate;
}

.eq.playing span:nth-child(2) { animation-delay: -0.2s; }
.eq.playing span:nth-child(3) { animation-delay: -0.5s; }
.eq.playing span:nth-child(4) { animation-delay: -0.1s; }
.eq.playing span:nth-child(5) { animation-delay: -0.7s; }
.eq.playing span:nth-child(6) { animation-delay: -0.3s; }
.eq.playing span:nth-child(7) { animation-delay: -0.6s; }

/* progress */

.progress-area {
  display: flex;
  align-items: center;

  gap: 10px;

  margin-top: 18px;

  font-size: 11px;
  font-variant-numeric: tabular-nums;

  opacity: 0.7;
}

.progress-bar {
  position: relative;

  flex: 1;

  height: 6px;

  border-radius: 10px;

  background: rgba(118, 81, 154, 0.2);

  cursor: pointer;
}

/* bigger tap area */
.progress-bar::before {
  content: '';

  position: absolute;
  inset: -12px 0;
}

.progress {
  height: 100%;

  border-radius: inherit;

  background: linear-gradient(90deg, #9b6bc9, #6f47a3);

  transition: width 0.1s linear;
}

.listen-text {
  margin: 14px 0 0;

  font-size: 12px;

  opacity: 0.7;
}

.continue-button {
  margin-top: 26px;
}

@keyframes ring {
  0% { opacity: 0.8; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.5); }
}

@keyframes eq {
  from { height: 5px; }
  to { height: 24px; }
}
</style>
