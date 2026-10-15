<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import logoDesktop from '../assets/brand/logo-desktop.svg'
import logoMobile from '../assets/brand/logo-mobile.svg'
import chevronIcon from '../assets/icons/chevron-down.svg'
import rubIcon from '../assets/icons/rub.svg'
import userIcon from '../assets/icons/user.svg'
import walletIcon from '../assets/icons/wallet.svg'
import BalancePopover from './BalancePopover.vue'
import ProfilePopover from './ProfilePopover.vue'

type OpenPopover = 'balance' | 'profile' | null

const openPopover = ref<OpenPopover>(null)
const balanceButton = ref<HTMLButtonElement | null>(null)
const profileButton = ref<HTMLButtonElement | null>(null)
const balanceAnchorLeft = ref(0)
const profileAnchorRight = ref(40)

function updateAnchors() {
  if (balanceButton.value) {
    const rect = balanceButton.value.getBoundingClientRect()
    balanceAnchorLeft.value = rect.left + rect.width / 2
  }
  if (profileButton.value) {
    const rect = profileButton.value.getBoundingClientRect()
    profileAnchorRight.value = window.innerWidth - rect.right
  }
}

function togglePopover(target: Exclude<OpenPopover, null>) {
  openPopover.value = openPopover.value === target ? null : target
  void nextTick(updateAnchors)
}

function closePopover() {
  openPopover.value = null
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closePopover()
}

watch(openPopover, (value) => {
  const shouldLock = value !== null && window.matchMedia('(max-width: 1023px)').matches
  document.documentElement.classList.toggle('popover-is-open', shouldLock)
})

onMounted(() => {
  updateAnchors()
  window.addEventListener('resize', updateAnchors)
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('popover-is-open')
  window.removeEventListener('resize', updateAnchors)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <header class="app-header">
    <div class="app-header__content">
      <a class="brand-logo" href="#" aria-label="Winum — на главную">
        <picture>
          <source media="(max-width: 767px)" :srcset="logoMobile" />
          <img :src="logoDesktop" alt="Winum" />
        </picture>
      </a>
      <div class="account-actions">
        <button
          ref="balanceButton"
          class="balance-button"
          :class="{ 'is-open': openPopover === 'balance' }"
          type="button"
          aria-label="Открыть баланс"
          :aria-expanded="openPopover === 'balance'"
          @click="togglePopover('balance')"
        >
          <img :src="rubIcon" alt="" /><strong>95 000,00</strong><img class="balance-button__chevron" :src="chevronIcon" alt="" />
        </button>
        <button class="deposit-button" type="button"><img :src="walletIcon" alt="" /><span>Пополнить</span></button>
      </div>
      <button
        ref="profileButton"
        class="profile-button"
        type="button"
        aria-label="Открыть профиль"
        :aria-expanded="openPopover === 'profile'"
        @click="togglePopover('profile')"
      >
        <img :src="userIcon" alt="" /><span>3</span>
      </button>
    </div>
  </header>

  <Teleport to="body">
    <Transition name="account-popover">
      <BalancePopover
        v-if="openPopover === 'balance'"
        :anchor-left="balanceAnchorLeft"
        @close="closePopover"
      />
    </Transition>
    <Transition name="account-popover">
      <ProfilePopover
        v-if="openPopover === 'profile'"
        :anchor-right="profileAnchorRight"
        @close="closePopover"
      />
    </Transition>
  </Teleport>
</template>
