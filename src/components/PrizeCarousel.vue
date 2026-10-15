<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import activeSurface from '../assets/prizes/framer-prize-active.png'

type Prize = {
  image: string
  game: string
  amount: string
  username: string
  highlighted?: boolean
}

const props = defineProps<{ prizes: Prize[] }>()

const CLONE_COUNT = 6
const AUTOPLAY_DELAY = 2000
const GAP = 8

const viewport = ref<HTMLElement | null>(null)
const current = ref(0)
const step = ref(228)
const transitionEnabled = ref(true)
let autoplayTimer: number | undefined
let resizeObserver: ResizeObserver | undefined

const renderedPrizes = computed(() => [
  ...props.prizes.slice(-CLONE_COUNT),
  ...props.prizes,
  ...props.prizes.slice(0, CLONE_COUNT),
])

const trackStyle = computed(() => ({
  transform: `translate3d(${-(CLONE_COUNT + current.value) * step.value}px, 0, 0)`,
  transition: transitionEnabled.value ? 'transform 600ms cubic-bezier(.22, 1, .36, 1)' : 'none',
}))

const updateStep = () => {
  const firstCard = viewport.value?.querySelector<HTMLElement>('.prize-card')
  if (!firstCard) return
  const styles = window.getComputedStyle(viewport.value as HTMLElement)
  const gap = Number.parseFloat(styles.getPropertyValue('--prize-gap')) || GAP
  step.value = firstCard.offsetWidth + gap
}

const move = (direction: -1 | 1) => {
  transitionEnabled.value = true
  current.value += direction
}

const resetAutoplay = () => {
  window.clearInterval(autoplayTimer)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  autoplayTimer = window.setInterval(() => move(1), AUTOPLAY_DELAY)
}

const finishLoop = (event: TransitionEvent) => {
  if (event.propertyName !== 'transform') return
  if (current.value >= props.prizes.length || current.value < 0) {
    transitionEnabled.value = false
    current.value = ((current.value % props.prizes.length) + props.prizes.length) % props.prizes.length
    nextTick(() => requestAnimationFrame(() => { transitionEnabled.value = true }))
  }
}

onMounted(() => {
  updateStep()
  resizeObserver = new ResizeObserver(updateStep)
  if (viewport.value) resizeObserver.observe(viewport.value)
  resetAutoplay()
})

onBeforeUnmount(() => {
  window.clearInterval(autoplayTimer)
  resizeObserver?.disconnect()
})
</script>

<template>
  <div
    ref="viewport"
    class="prize-carousel"
    aria-label="Последние выигрыши"
  >
    <div class="prize-carousel__track" :style="trackStyle" @transitionend="finishLoop">
      <article
        v-for="(prize, index) in renderedPrizes"
        :key="`${index}-${prize.image}`"
        class="prize-card"
        :class="{ 'prize-card--highlighted': prize.highlighted }"
      >
        <div class="prize-card__surface">
          <img v-if="prize.highlighted" class="prize-card__active-surface" :src="activeSurface" alt="" />
          <div class="prize-card__cover"><img :src="prize.image" :alt="prize.game" draggable="false" /></div>
          <div class="prize-card__info">
            <b>{{ prize.amount }}</b>
            <span><strong>{{ prize.game }}</strong><small>{{ prize.username }}</small></span>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
