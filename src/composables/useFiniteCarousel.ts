import { onBeforeUnmount, onMounted, reactive } from 'vue'

type TrackElement = unknown

type CarouselEdges = {
  atStart: boolean
  atEnd: boolean
}

const EDGE_TOLERANCE = 2
const DRAG_THRESHOLD = 6
const MAX_DRAG_STEPS = 3
const VELOCITY_PROJECTION_MS = 220
const MIN_SETTLE_DURATION = 420
const MAX_SETTLE_DURATION = 560

type DragState = {
  pointerId: number
  startX: number
  startY: number
  startScrollLeft: number
  startIndex: number
  step: number
  lastX: number
  lastTime: number
  velocityX: number
  axis: 'pending' | 'horizontal'
  moved: boolean
}

type ScrollAnimation = {
  frame: number
  target: number
}

export function useFiniteCarousel() {
  const tracks = new Map<string, HTMLElement>()
  const cleanupHandlers = new Map<string, () => void>()
  const animationFrames = new Map<string, number>()
  const scrollAnimations = new Map<string, ScrollAnimation>()
  const edges = reactive<Record<string, CarouselEdges>>({})

  const stopScrollAnimation = (id: string, commitTarget = false) => {
    const animation = scrollAnimations.get(id)
    const track = tracks.get(id)
    if (!animation) return

    cancelAnimationFrame(animation.frame)
    if (commitTarget && track) track.scrollLeft = animation.target
    track?.classList.remove('card-track--settling')
    scrollAnimations.delete(id)
  }

  const animateTo = (id: string, requestedTarget: number) => {
    const track = tracks.get(id)
    if (!track) return

    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth)
    const target = Math.min(maxScroll, Math.max(0, requestedTarget))
    stopScrollAnimation(id)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || Math.abs(track.scrollLeft - target) < .5) {
      track.scrollLeft = target
      scheduleUpdate(id)
      return
    }

    const start = track.scrollLeft
    const startedAt = performance.now()
    const distance = Math.abs(target - start)
    const duration = Math.min(MAX_SETTLE_DURATION, MIN_SETTLE_DURATION + distance * .18)
    track.classList.add('card-track--settling')

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      track.scrollLeft = start + (target - start) * eased
      scheduleUpdate(id)

      if (progress < 1) {
        const animation = scrollAnimations.get(id)
        if (animation) animation.frame = requestAnimationFrame(tick)
        return
      }

      track.scrollLeft = target
      track.classList.remove('card-track--settling')
      scrollAnimations.delete(id)
      scheduleUpdate(id)
    }

    scrollAnimations.set(id, { frame: requestAnimationFrame(tick), target })
  }

  const updateItemMotion = (id: string) => {
    const track = tracks.get(id)
    if (!track) return

    const viewportStart = track.scrollLeft
    const viewportEnd = viewportStart + track.clientWidth
    const trackStyles = window.getComputedStyle(track)
    const gap = Number.parseFloat(trackStyles.columnGap || trackStyles.gap) || 0

    for (const [index, child] of Array.from(track.children).entries()) {
      if (!(child instanceof HTMLElement)) continue

      const itemWidth = child.offsetWidth
      const itemStart = index * (itemWidth + gap)
      const itemEnd = itemStart + itemWidth
      const visibleWidth = Math.max(0, Math.min(itemEnd, viewportEnd) - Math.max(itemStart, viewportStart))
      const visibleRatio = itemWidth > 0 ? visibleWidth / itemWidth : 0
      const progress = Math.max(0, Math.min(1, (visibleRatio - .15) / .85))
      const scale = .75 + .25 * progress
      const opacity = .5 + .5 * progress

      child.style.setProperty('--carousel-item-scale', scale.toFixed(3))
      child.style.setProperty('--carousel-item-opacity', opacity.toFixed(3))
    }
  }

  const scheduleUpdate = (id: string) => {
    const currentFrame = animationFrames.get(id)
    if (currentFrame) cancelAnimationFrame(currentFrame)
    animationFrames.set(id, requestAnimationFrame(() => {
      animationFrames.delete(id)
      updateEdges(id)
      updateItemMotion(id)
    }))
  }

  const updateEdges = (id: string) => {
    const track = tracks.get(id)
    if (!track) return

    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth)
    const atStart = track.scrollLeft <= EDGE_TOLERANCE
    const atEnd = maxScroll <= EDGE_TOLERANCE || track.scrollLeft >= maxScroll - EDGE_TOLERANCE
    const current = edges[id]

    if (current?.atStart === atStart && current.atEnd === atEnd) return
    edges[id] = { atStart, atEnd }
  }

  const unregisterTrack = (id: string) => {
    stopScrollAnimation(id)
    cleanupHandlers.get(id)?.()
    const frame = animationFrames.get(id)
    if (frame) cancelAnimationFrame(frame)
    tracks.delete(id)
    cleanupHandlers.delete(id)
    animationFrames.delete(id)
  }

  const setTrack = (id: string, element: TrackElement) => {
    if (!(element instanceof HTMLElement)) return
    if (tracks.get(id) === element) return

    unregisterTrack(id)

    let dragState: DragState | null = null

    const onScroll = () => scheduleUpdate(id)
    const onDragStart = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      // Match the hero carousel: a new gesture immediately commits the
      // previous destination instead of waiting for its easing to finish.
      stopScrollAnimation(id, true)
      const firstItem = element.firstElementChild
      if (!(firstItem instanceof HTMLElement)) return
      const styles = window.getComputedStyle(element)
      const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0
      const step = firstItem.offsetWidth + gap
      if (step <= 0) return
      const maxScroll = Math.max(0, element.scrollWidth - element.clientWidth)
      const atEnd = maxScroll > 0 && element.scrollLeft >= maxScroll - EDGE_TOLERANCE

      dragState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startScrollLeft: element.scrollLeft,
        startIndex: atEnd ? Math.ceil(element.scrollLeft / step) : Math.round(element.scrollLeft / step),
        step,
        lastX: event.clientX,
        lastTime: event.timeStamp,
        velocityX: 0,
        axis: 'pending',
        moved: false,
      }
      element.setPointerCapture(event.pointerId)
      element.classList.add('card-track--dragging')
    }
    const onDragMove = (event: PointerEvent) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return
      const deltaX = event.clientX - dragState.startX
      const deltaY = event.clientY - dragState.startY

      if (dragState.axis === 'pending' && Math.abs(deltaY) > DRAG_THRESHOLD && Math.abs(deltaY) > Math.abs(deltaX)) {
        dragState = null
        element.classList.remove('card-track--dragging')
        if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId)
        return
      }
      if (!dragState.moved && Math.abs(deltaX) < DRAG_THRESHOLD) return

      const elapsed = event.timeStamp - dragState.lastTime
      if (elapsed > 0) {
        const nextVelocity = (event.clientX - dragState.lastX) / elapsed
        dragState.velocityX = dragState.moved
          ? dragState.velocityX * .35 + nextVelocity * .65
          : nextVelocity
      }
      dragState.lastX = event.clientX
      dragState.lastTime = event.timeStamp
      dragState.axis = 'horizontal'
      dragState.moved = true
      const maxScroll = Math.max(0, element.scrollWidth - element.clientWidth)
      const unclamped = dragState.startScrollLeft - deltaX
      const gestureRange = dragState.step * MAX_DRAG_STEPS
      const gestureMin = Math.max(0, dragState.startScrollLeft - gestureRange)
      const gestureMax = Math.min(maxScroll, dragState.startScrollLeft + gestureRange)
      element.scrollLeft = Math.max(gestureMin, Math.min(gestureMax, unclamped))
      scheduleUpdate(id)
    }
    const onDragEnd = (event: PointerEvent) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return
      const state = dragState
      dragState = null
      element.classList.remove('card-track--dragging')
      if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId)

      const distance = event.clientX - state.startX
      const threshold = Math.min(48, state.step * .2)
      const velocity = event.timeStamp - state.lastTime <= 80 ? state.velocityX : 0
      const projectedDistance = distance + velocity * VELOCITY_PROJECTION_MS
      const hasIntent = state.moved && (Math.abs(distance) >= threshold || Math.abs(velocity) >= .25)
      const direction = hasIntent ? (projectedDistance < 0 ? 1 : -1) : 0
      const stepCount = hasIntent
        ? Math.min(MAX_DRAG_STEPS, Math.max(1, Math.round(Math.abs(projectedDistance) / state.step)))
        : 0
      const maxIndex = Math.max(0, Math.ceil((element.scrollWidth - element.clientWidth) / state.step))
      const targetIndex = Math.min(maxIndex, Math.max(0, state.startIndex + direction * stepCount))
      animateTo(id, targetIndex * state.step)
      scheduleUpdate(id)
    }
    const preventImageDrag = (event: DragEvent) => event.preventDefault()

    tracks.set(id, element)
    element.addEventListener('scroll', onScroll, { passive: true })
    element.addEventListener('pointerdown', onDragStart)
    element.addEventListener('pointermove', onDragMove)
    element.addEventListener('pointerup', onDragEnd)
    element.addEventListener('pointercancel', onDragEnd)
    element.addEventListener('dragstart', preventImageDrag)
    cleanupHandlers.set(id, () => {
      element.removeEventListener('scroll', onScroll)
      element.removeEventListener('pointerdown', onDragStart)
      element.removeEventListener('pointermove', onDragMove)
      element.removeEventListener('pointerup', onDragEnd)
      element.removeEventListener('pointercancel', onDragEnd)
      element.removeEventListener('dragstart', preventImageDrag)
    })
    requestAnimationFrame(() => scheduleUpdate(id))
  }

  const move = (id: string, direction: -1 | 1) => {
    const track = tracks.get(id)
    const firstItem = track?.firstElementChild
    if (!track || !(firstItem instanceof HTMLElement)) return

    const styles = window.getComputedStyle(track)
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0
    const itemWidth = firstItem.offsetWidth
    const step = itemWidth + gap
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth)
    const activeTarget = scrollAnimations.get(id)?.target
    const currentIndex = Math.round((activeTarget ?? track.scrollLeft) / step)
    const nextLeft = Math.min(maxScroll, Math.max(0, (currentIndex + direction) * step))

    animateTo(id, nextLeft)
  }

  const updateAll = () => {
    for (const id of tracks.keys()) scheduleUpdate(id)
  }

  onMounted(() => {
    window.addEventListener('resize', updateAll, { passive: true })
    updateAll()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateAll)
    for (const id of [...tracks.keys()]) unregisterTrack(id)
  })

  return { edges, move, setTrack }
}
