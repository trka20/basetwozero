<script setup lang="ts">
import logoDesktop from '../assets/brand/logo-desktop.svg'
import logoMobile from '../assets/brand/logo-mobile.svg'
import chevronIcon from '../assets/icons/chevron-down.svg'
import rubIcon from '../assets/icons/rub.svg'
import userIcon from '../assets/icons/user.svg'
import walletIcon from '../assets/icons/wallet.svg'
</script>

<template>
  <header class="app-header">
    <div class="app-header__content">
      <picture class="brand-logo">
        <source media="(max-width: 767px)" :srcset="logoMobile" />
        <img :src="logoDesktop" alt="Winum" />
      </picture>
      <div class="account-actions">
        <button class="balance-button" type="button" aria-label="Открыть баланс">
          <img :src="rubIcon" alt="" /><strong>95 000,00</strong><img class="balance-button__chevron" :src="chevronIcon" alt="" />
        </button>
        <button class="deposit-button" type="button"><img :src="walletIcon" alt="" /><span>Пополнить</span></button>
      </div>
      <button class="profile-button" type="button" aria-label="Открыть профиль">
        <img :src="userIcon" alt="" /><span>3</span>
      </button>
    </div>
  </header>
</template>
