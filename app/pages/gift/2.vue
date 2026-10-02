<script setup lang="ts">
// TODO: write your real letter here
const greeting = 'Dear J-ann,'

const paragraphs = [
  "Happy 18th birthday, Bab. 💜",
  "Hindi ko alam kung paano ko ba sisimulan to, pero gusto ko lang sabihin na sobrang saya ko na nakikita kita kang nakangiti sa araw mo. Ang dami nang nangyari mula nung mas nakilala kita, at hanggang ngayon, minsan hindi parin ako makapaniwala na yung taong dating kilala ko lang, ngayon ay isa na sa pinakamahalagang tao sa buhay ko and makakasama ko pa sa debut nya.",
  "Kaya ginawa ko itong website na to para sayo. Hindi man siya kasing bongga ng ibang regalo, gusto ko kasi na may bagay kang pwedeng balikan kapag gusto mong maalala yung mga pinagsamahan natin before ka mag debut. Isang maliit na lugar na para sayo lang, para sayo lang kasi special ka hehe.",
  "Naalala ko pa nung una tayong nagkita sa KFC Tas mula non parang naging normal na lang na pag may pera tas uwian na, sa Stella tayo lagi pumupunta. Simple lang naman yung mga araw na yon, pero kapag kasama kita, somehow nagiging mga alaala silang ayokong mawala.",
  "Tapos yung unang gabing sobrang tagal tayo nag usap na umabot na tayo ng madaling araw hindi parin tayo natatapos magkwentuhan Kahit wala pang tayo non HAHAHA, and the day nasinagot mo ako na dapat sa august 23, biglang naging 27. Pero still I'm so happy kasi sinagot mo ako hehe.",
  "Ngayong 18 ka na, gusto kong malaman mo na hindi lang ako nandito para sa mga masasayang araw. Nandito ako sa mga araw na pagod ka, sa mga araw na maraming iniisip, sa mga araw na gusto mo lang may makausap, at kahit sa mga araw na gusto mo lang akong asarin o tawagin akong kung ano-ano. HAHAHA.",
  "Gusto kong makita lahat ng susunod mong birthdays. Gusto kong makita kang maabot yung mga pangarap mo, matupad yung pag f flight attendant mo. At kung papayagan ako ng panahon, gusto kong kasama ako sa bawat chapter ng buhay mo.",
  "Kaya ngayong 18th birthday mo ang wish ko para sayo is sana maging mabait ka HAHAHAHAHHA, sana di ka na maging simang(simangot), sana wag mo ko kakalimutan, sana makuha mo lahat ng goals mo",
  "Happy 18th birthday, Bab. 💜",
  "Enjoy your day, bebe Yangyang. Deserve mong sumaya dahil special ang araw na ’to, kasi special ka sa akin hehe.",
  "At kung may isang bagay akong gustong ipangako sa’yo ngayon, ito ’yon:",
  "Sa birthday mo ngayon, nandito ako.\nSa mga susunod mong birthday, sana nandito pa rin ako.\nAt sa lahat ng araw sa pagitan noon, pipiliin pa rin kitang samahan. 💜",
  "I lovee you!!💜💜",
]

const signature = 'With love, Kurtin 😙💙'

// 0 = closed, 1 = flap + paper opening, 2 = letter shown
const stage = ref(0)

const openEnvelope = () => {
  if (stage.value !== 0) return

  stage.value = 1

  setTimeout(() => {
    stage.value = 2
  }, 1300)
}
</script>

<template>
  <GiftFrame
    :id="2"
    title="A Letter"
  >

    <div
      class="envelope-wrap"
      :class="{ open: stage >= 1, done: stage >= 2 }"
    >
      <button
        class="envelope"
        aria-label="Open the letter"
        @click="openEnvelope"
      >
        <span class="env-back"></span>
        <span class="paper"></span>
        <span class="env-front"></span>
        <span class="env-flap"></span>
        <span class="seal">♥</span>
      </button>

      <p class="tap-hint">
        Tap to open
      </p>
    </div>

    <Transition name="letter">
      <article
        v-if="stage >= 2"
        class="letter"
      >
        <p class="greeting">
          {{ greeting }}
        </p>

        <p
          v-for="(line, i) in paragraphs"
          :key="i"
          class="line"
          :style="{ animationDelay: `${0.5 + i * 0.7}s` }"
        >
          {{ line }}
        </p>

        <p
          class="signature line"
          :style="{ animationDelay: `${0.5 + paragraphs.length * 0.7}s` }"
        >
          {{ signature }}
        </p>
      </article>
    </Transition>

  </GiftFrame>
</template>

<style scoped>
/* =========================
   ENVELOPE
   ========================= */

.envelope-wrap {
  perspective: 900px;

  max-height: 260px;

  transition:
    max-height 0.7s ease,
    opacity 0.6s ease,
    transform 0.6s ease;
}

.envelope-wrap.done {
  max-height: 0;

  opacity: 0;

  transform: translateY(20px);

  pointer-events: none;

  overflow: hidden;
}

.envelope {
  position: relative;

  display: block;

  width: 280px;
  height: 190px;

  margin: 40px auto 0;

  padding: 0;

  border: none;

  background: transparent;

  cursor: pointer;

  -webkit-tap-highlight-color: transparent;

  filter: drop-shadow(0 16px 24px rgba(60, 35, 85, 0.25));

  animation: bob 3s ease-in-out infinite;
}

.envelope-wrap.open .envelope {
  animation: none;

  cursor: default;
}

.env-back {
  position: absolute;
  inset: 0;

  border-radius: 8px;

  background: #cfb0e6;
}

.paper {
  position: absolute;

  left: 14px;
  right: 14px;
  top: 14px;
  height: 160px;

  border-radius: 6px;

  background:
    repeating-linear-gradient(
      180deg,
      transparent 0,
      transparent 17px,
      rgba(118, 81, 154, 0.12) 17px,
      rgba(118, 81, 154, 0.12) 18px
    ),
    #fffdf8;

  z-index: 2;

  transition: transform 0.8s ease 0.35s;
}

.env-front {
  position: absolute;
  inset: 0;

  border-radius: 8px;

  background: linear-gradient(180deg, #e9d6f7, #dcc0ef);

  clip-path: polygon(0 100%, 0 0, 50% 54%, 100% 0, 100% 100%);

  z-index: 3;
}

.env-flap {
  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 54%;

  background: linear-gradient(180deg, #d4b4ea, #c39fe0);

  clip-path: polygon(0 0, 100% 0, 50% 100%);

  transform-origin: top;

  z-index: 4;

  transition:
    transform 0.6s ease,
    z-index 0s 0.3s;
}

.seal {
  position: absolute;

  left: 50%;
  top: 54%;

  width: 44px;
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  transform: translate(-50%, -50%);

  border-radius: 50%;

  background: radial-gradient(circle at 35% 30%, #b46ad6, #7a3fa0);

  color: #fff;

  font-size: 20px;

  box-shadow: 0 4px 10px rgba(60, 20, 90, 0.4);

  z-index: 5;

  transition:
    opacity 0.3s ease,
    transform 0.4s ease;
}

.envelope-wrap.open .env-flap {
  transform: rotateX(180deg);

  z-index: 1;
}

.envelope-wrap.open .paper {
  transform: translateY(-85px);
}

.envelope-wrap.open .seal {
  opacity: 0;

  transform: translate(-50%, -50%) scale(0.5);
}

.tap-hint {
  margin: 26px 0 0;

  font-size: 14px;

  opacity: 0.7;

  transition: opacity 0.3s;
}

.envelope-wrap.open .tap-hint {
  opacity: 0;
}

/* =========================
   LETTER
   ========================= */

.letter {
  padding: 34px 28px 30px;

  text-align: left;

  border-radius: 6px;

  background:
    repeating-linear-gradient(
      180deg,
      transparent 0,
      transparent 35px,
      rgba(118, 81, 154, 0.13) 35px,
      rgba(118, 81, 154, 0.13) 36px
    ),
    #fffdf8;

  box-shadow:
    0 20px 45px rgba(60, 35, 85, 0.25),
    0 2px 4px rgba(60, 35, 85, 0.1);

  color: #4a3560;

  font-family: var(--font-hand);
  font-size: 24px;
  line-height: 36px;
}

.letter p {
  margin: 0 0 36px;
}

.letter .greeting {
  font-size: 30px;
  font-weight: 500;
}

.letter .line {
  white-space: pre-line;

  opacity: 0;

  animation: fade-up 0.8s ease forwards;
}

.letter .signature {
  margin: 0;

  text-align: right;
}

.letter-enter-active {
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

.letter-enter-from {
  opacity: 0;

  transform: translateY(40px) scale(0.96);
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
</style>
