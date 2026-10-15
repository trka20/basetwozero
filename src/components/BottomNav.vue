<script setup lang="ts">
import giftIcon from '../assets/icons/tabbar-gift.svg'
import menuIcon from '../assets/icons/tabbar-menu.svg'
import searchIcon from '../assets/icons/tabbar-search.svg'
import sportIcon from '../assets/icons/tabbar-sport.svg'
import walletIcon from '../assets/icons/tabbar-wallet.svg'

const items = [
  { label: 'Меню', icon: menuIcon },
  { label: 'Поиск', icon: searchIcon },
  { label: 'Депозит', icon: walletIcon },
  { label: 'Бонусы', icon: giftIcon },
  { label: 'Спорт', icon: sportIcon },
]
</script>

<template>
  <nav class="bottom-nav" aria-label="Мобильная навигация">
    <button v-for="item in items" :key="item.label" type="button"><img :src="item.icon" alt="" /><span>{{ item.label }}</span></button>
  </nav>
</template>
