<script setup lang="ts">
const props = defineProps<{
  id: number
  title: string
}>()

const { markOpened } = useOpenedGifts()

// Visiting a gift page always counts it as opened
onMounted(() => markOpened(props.id))
</script>

<template>
  <div class="gift-page">

    <div class="frame">

      <p class="eyebrow">
        Gift {{ id }} of 3
      </p>

      <h1>
        {{ title }}
      </h1>

      <slot />

      <button
        class="ghost-button back"
        @click="navigateTo('/gifts')"
      >
        ← Back to my gifts
      </button>

    </div>

  </div>
</template>

<style scoped>
.gift-page {
  position: relative;
  z-index: 1;

  min-height: 100vh;
  min-height: 100dvh;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 40px 20px;

  overflow-x: hidden;
}

.frame {
  width: min(100%, 440px);

  text-align: center;
}

h1 {
  margin: 10px 0 26px;

  font-size: clamp(34px, 8vw, 46px);
  font-weight: 600;
  line-height: 1.1;
}

.back {
  margin-top: 32px;
}
</style>
