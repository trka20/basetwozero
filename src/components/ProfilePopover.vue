<script setup lang="ts">
import arrowIcon from '../assets/popovers/profile/arrow-forward.svg'
import bellIcon from '../assets/popovers/profile/bell.svg'
import closeIcon from '../assets/popovers/profile/close.svg'
import giftIcon from '../assets/popovers/profile/gift.svg'
import headsetIcon from '../assets/popovers/profile/headset.svg'
import historyIcon from '../assets/popovers/profile/history.svg'
import logoutIcon from '../assets/popovers/profile/logout.svg'
import paymentHistoryIcon from '../assets/popovers/profile/payment-history.svg'
import settingsIcon from '../assets/popovers/profile/settings.svg'
import ticketIcon from '../assets/popovers/profile/ticket.svg'
import userIcon from '../assets/popovers/profile/user.svg'
import walletIcon from '../assets/popovers/profile/wallet.svg'

defineProps<{ anchorRight: number }>()
const emit = defineEmits<{ close: [] }>()

const menuItems = [
  { label: 'Баланс', icon: walletIcon },
  { label: 'Уведомления', icon: bellIcon, badge: '3' },
  { label: 'Бонусы', icon: giftIcon },
  { label: 'Ваучеры', icon: ticketIcon },
  { label: 'История ставок', icon: historyIcon },
  { label: 'История платежей', icon: paymentHistoryIcon },
  { label: 'Настройки', icon: settingsIcon },
  { label: 'Поддержка', icon: headsetIcon, badge: '24/7' },
  { label: 'Выход', icon: logoutIcon },
]
</script>

<template>
  <div class="popover-layer" @mousedown.self="emit('close')">
    <section
      class="account-popover profile-popover"
      :style="{ '--anchor-right': `${anchorRight}px` }"
      role="dialog"
      aria-label="Профиль"
      @mousedown.stop
    >
      <header class="account-popover__mobile-header">
        <h2>Профиль</h2>
        <button type="button" aria-label="Закрыть профиль" @click="emit('close')">
          <img :src="closeIcon" alt="" />
        </button>
      </header>

      <div class="profile-popover__content">
        <button class="profile-summary" type="button">
          <span class="profile-summary__avatar"><img :src="userIcon" alt="" /></span>
          <span class="profile-summary__copy"><strong>Edward</strong><small>ID 2148600</small></span>
          <span class="profile-summary__arrow"><img :src="arrowIcon" alt="" /></span>
        </button>

        <nav class="profile-menu" aria-label="Меню профиля">
          <button v-for="item in menuItems" :key="item.label" type="button">
            <span class="profile-menu__icon"><img :src="item.icon" alt="" /></span>
            <span class="profile-menu__label">{{ item.label }}</span>
            <small v-if="item.badge">{{ item.badge }}</small>
          </button>
        </nav>
      </div>
    </section>
  </div>
</template>
