<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import banner1 from '../assets/banners/framer-banner-1.png'
import banner2 from '../assets/banners/framer-banner-2.png'
import banner3 from '../assets/banners/framer-banner-3.png'
import banner4 from '../assets/banners/framer-banner-4.png'

const GAP = 8
const CLONE_COUNT = 3
const AUTOPLAY_DELAY = 3000

const banners = [
  { image: banner1, lines: ['Get your', '500%', 'bonus'] },
  { image: banner2, lines: ['Get your', '500%', 'bonus'] },
  { image: banner3, lines: ['Get your', '500%', 'bonus'] },
  { image: banner4, lines: ['Get your', '500%', 'bonus'] },
]
const viewport = ref<HTMLElement | null>(null)
const current = ref(0)
const viewportWidth = ref(0)
const visibleCount = ref(3)
const transitionEnabled = ref(true)
const dragging = ref(false)
const dragOffset = ref(0)
const pointerStart = ref(0)
let autoplayTimer: number | undefined
let resizeFrame = 0
let resizeObserver: ResizeObserver | undefined

const renderedBanners = [
  ...banners.slice(-CLONE_COUNT),
  ...banners,
  ...banners.slice(0, CLONE_COUNT),
]

const slideWidth = computed(() => {
  if (visibleCount.value === 1) return Math.min(328, viewportWidth.value)
  return (viewportWidth.value - GAP * (visibleCount.value - 1)) / visibleCount.value
})

const trackOffset = computed(() => {
  const position = CLONE_COUNT + current.value
  const centeredInset = visibleCount.value === 1 ? Math.max(0, (viewportWidth.value - slideWidth.value) / 2) : 0
  return centeredInset - position * (slideWidth.value + GAP) + dragOffset.value
})

const trackStyle = computed(() => ({
  '--hero-slide-width': `${slideWidth.value}px`,
  transform: `translate3d(${trackOffset.value}px, 0, 0)`,
  transition: transitionEnabled.value && !dragging.value
    ? 'transform 600ms cubic-bezier(.22, 1, .36, 1)'
    : 'none',
}))

const isFullSize = (renderedIndex: number) => {
  const slideStart = trackOffset.value + renderedIndex * (slideWidth.value + GAP)
  const slideEnd = slideStart + slideWidth.value
  const visibleWidth = Math.max(0, Math.min(slideEnd, viewportWidth.value) - Math.max(slideStart, 0))
  return slideWidth.value > 0 && visibleWidth / slideWidth.value >= .85
}

const slideMotionStyle = (renderedIndex: number) => {
  // Tablet layouts keep the neighbouring 328px banners at their full size.
  // The scale/opacity interpolation is an interaction state and should only
  // appear while the user is physically dragging the carousel.
  if (!dragging.value) {
    return {
      '--hero-slide-scale': '1',
      '--hero-slide-opacity': '1',
    }
  }

  const slideStart = trackOffset.value + renderedIndex * (slideWidth.value + GAP)
  const slideEnd = slideStart + slideWidth.value
  const visibleWidth = Math.max(0, Math.min(slideEnd, viewportWidth.value) - Math.max(slideStart, 0))
  const visibleRatio = slideWidth.value > 0 ? visibleWidth / slideWidth.value : 0
  const progress = Math.max(0, Math.min(1, (visibleRatio - .15) / .85))

  return {
    '--hero-slide-scale': (.75 + .25 * progress).toFixed(3),
    '--hero-slide-opacity': (.5 + .5 * progress).toFixed(3),
  }
}

const updateMeasurements = () => {
  const width = viewport.value?.clientWidth ?? 0
  const nextVisible = window.innerWidth >= 1200 ? 3 : window.innerWidth >= 1024 ? 2 : 1
  if (viewportWidth.value === width && visibleCount.value === nextVisible) return

  transitionEnabled.value = false
  viewportWidth.value = width
  visibleCount.value = nextVisible
  current.value = ((current.value % banners.length) + banners.length) % banners.length
  nextTick(() => requestAnimationFrame(() => { transitionEnabled.value = true }))
}

const scheduleMeasurement = () => {
  cancelAnimationFrame(resizeFrame)
  resizeFrame = requestAnimationFrame(updateMeasurements)
}

const move = (direction: -1 | 1) => {
  if (dragging.value) return
  transitionEnabled.value = true
  current.value += direction
}

const resetAutoplay = () => {
  window.clearInterval(autoplayTimer)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  autoplayTimer = window.setInterval(() => move(1), AUTOPLAY_DELAY)
}

const pauseAutoplay = () => {
  window.clearInterval(autoplayTimer)
}

const finishLoop = (event: TransitionEvent) => {
  if (event.propertyName !== 'transform') return
  if (current.value >= banners.length || current.value < 0) {
    transitionEnabled.value = false
    current.value = ((current.value % banners.length) + banners.length) % banners.length
    nextTick(() => requestAnimationFrame(() => { transitionEnabled.value = true }))
  }
}

const startDrag = (event: PointerEvent) => {
  if (event.pointerType === 'mouse' && event.button !== 0) return
  dragging.value = true
  pointerStart.value = event.clientX
  dragOffset.value = 0
  viewport.value?.setPointerCapture(event.pointerId)
  window.clearInterval(autoplayTimer)
}

const drag = (event: PointerEvent) => {
  if (!dragging.value) return
  const distance = event.clientX - pointerStart.value
  const oneSlide = slideWidth.value + GAP

  // A single gesture can reveal and select only the neighbouring banner.
  dragOffset.value = Math.max(-oneSlide, Math.min(oneSlide, distance))
}

const finishDrag = (event: PointerEvent) => {
  if (!dragging.value) return
  const distance = dragOffset.value
  dragging.value = false
  dragOffset.value = 0
  if (viewport.value?.hasPointerCapture(event.pointerId)) {
    viewport.value.releasePointerCapture(event.pointerId)
  }

  if (Math.abs(distance) > Math.min(72, slideWidth.value * .2)) move(distance < 0 ? 1 : -1)
  resetAutoplay()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    move(-1)
    resetAutoplay()
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    move(1)
    resetAutoplay()
  }
}

onMounted(() => {
  updateMeasurements()
  window.addEventListener('resize', scheduleMeasurement, { passive: true })
  resizeObserver = new ResizeObserver(scheduleMeasurement)
  if (viewport.value) resizeObserver.observe(viewport.value)
  resetAutoplay()
})

onBeforeUnmount(() => {
  window.clearInterval(autoplayTimer)
  cancelAnimationFrame(resizeFrame)
  resizeObserver?.disconnect()
  window.removeEventListener('resize', scheduleMeasurement)
})
</script>

<template>
  <section
    class="hero-carousel"
    aria-label="Промо-баннеры"
    @mouseenter="pauseAutoplay"
    @mouseleave="resetAutoplay"
  >
    <div
      ref="viewport"
      class="hero-carousel__viewport"
      :class="{
        'hero-carousel__viewport--dragging': dragging,
        'hero-carousel__viewport--teleporting': !transitionEnabled,
        'hero-carousel__viewport--contained': visibleCount > 1,
      }"
      tabindex="0"
      @keydown="handleKeydown"
      @pointerdown="startDrag"
      @pointermove="drag"
      @pointerup="finishDrag"
      @pointercancel="finishDrag"
    >
      <div class="hero-carousel__track" :style="trackStyle" @transitionend.self="finishLoop">
        <article
          v-for="(banner, index) in renderedBanners"
          :key="`${banner.image}-${index}`"
          class="hero-slide"
          :class="{ 'hero-slide--special': banner.image === banner1 }"
          :style="slideMotionStyle(index)"
          :aria-hidden="!isFullSize(index)"
        >
          <img :src="banner.image" alt="" draggable="false" />
          <p class="hero-slide__copy">
            <span v-for="line in banner.lines" :key="line">{{ line }}</span>
          </p>
        </article>
      </div>
    </div>
  </section>
</template>
