import { onBeforeUnmount, onMounted, reactive } from 'vue'

type TrackElement = unknown

type CarouselEdges = {
  atStart: boolean
  atEnd: boolean
}

const EDGE_TOLERANCE = 2
const DRAG_THRESHOLD = 6
const canDragTrack = () => window.matchMedia('(max-width: 1023px)').matches

type DragState = {
  pointerId: number
  startX: number
  startY: number
  startScrollLeft: number
  moved: boolean
}

export function useFiniteCarousel() {
  const tracks = new Map<string, HTMLElement>()
  const cleanupHandlers = new Map<string, () => void>()
  const animationFrames = new Map<string, number>()
  const edges = reactive<Record<string, CarouselEdges>>({})

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

      child.classList.add('carousel-item-motion')
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
      if (!canDragTrack()) return
      if (event.pointerType === 'mouse' && event.button !== 0) return
      dragState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startScrollLeft: element.scrollLeft,
        moved: false,
      }
      element.setPointerCapture(event.pointerId)
      element.classList.add('card-track--dragging')
    }
    const onDragMove = (event: PointerEvent) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return
      if (!canDragTrack()) {
        dragState = null
        element.classList.remove('card-track--dragging')
        if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId)
        return
      }
      const deltaX = event.clientX - dragState.startX
      const deltaY = event.clientY - dragState.startY

      if (!dragState.moved && Math.abs(deltaX) < DRAG_THRESHOLD) return
      if (!dragState.moved && Math.abs(deltaY) > Math.abs(deltaX)) return

      dragState.moved = true
      element.scrollLeft = dragState.startScrollLeft - deltaX
      scheduleUpdate(id)
    }
    const onDragEnd = (event: PointerEvent) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return
      const moved = dragState.moved
      dragState = null
      element.classList.remove('card-track--dragging')
      if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId)

      if (moved) {
        const firstItem = element.firstElementChild
        if (firstItem instanceof HTMLElement) {
          const styles = window.getComputedStyle(element)
          const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0
          const step = firstItem.offsetWidth + gap
          const target = Math.round(element.scrollLeft / step) * step
          element.scrollTo({ left: target, behavior: 'smooth' })
        }
      }
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
    const itemsPerStep = window.matchMedia('(max-width: 767px)').matches ? 2 : 3
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth)
    const nextLeft = Math.min(maxScroll, Math.max(0, track.scrollLeft + direction * (itemWidth + gap) * itemsPerStep))

    track.scrollTo({ left: nextLeft, behavior: 'smooth' })
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
