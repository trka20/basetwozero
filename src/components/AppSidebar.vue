<script setup lang="ts">
import casinoIcon from '../assets/icons/casino.svg'
import sportIcon from '../assets/icons/sport.svg'
import menuIcon from '../assets/sidebar/menu.svg'
import searchIcon from '../assets/sidebar/search.svg'
import wheelIcon from '../assets/sidebar/wheel.png'
import missionsIcon from '../assets/sidebar/missions.png'
import lootboxIcon from '../assets/sidebar/lootbox.png'
import homeIcon from '../assets/sidebar/home.svg'
import heartIcon from '../assets/sidebar/heart.svg'
import newIcon from '../assets/sidebar/new.svg'
import clockIcon from '../assets/sidebar/clock.svg'
import giftIcon from '../assets/sidebar/gift.svg'
import pointsIcon from '../assets/sidebar/winum-points.png'
import promosIcon from '../assets/sidebar/promos.svg'
import gamesIcon from '../assets/sidebar/games.svg'
import chevronIcon from '../assets/sidebar/chevron.svg'
import loyaltyIcon from '../assets/sidebar/loyalty.svg'
import vipIcon from '../assets/sidebar/vip.svg'
import userIcon from '../assets/sidebar/user.svg'
import fileIcon from '../assets/sidebar/file.svg'
import supportIcon from '../assets/sidebar/support.svg'

defineProps<{ collapsed: boolean }>()
defineEmits<{ toggle: [] }>()

interface SidebarItem {
  label: string
  icon: string
  active?: boolean
  dot?: boolean
  count?: string
  expandable?: boolean
  iconClass?: string
  compactHidden?: boolean
}

const primaryItems: SidebarItem[] = [
  { label: 'Главная', icon: homeIcon, active: true },
  { label: 'Избранное', icon: heartIcon },
  { label: 'Новые игры', icon: newIcon },
  { label: 'Недавние', icon: clockIcon },
]

const rewardItems: SidebarItem[] = [
  { label: 'Бонусы', icon: giftIcon, dot: true },
  { label: 'Winum Points', icon: pointsIcon, iconClass: 'sidebar-item__icon--points' },
  { label: 'Акции', icon: promosIcon },
]

const groups: SidebarItem[][] = [
  primaryItems,
  rewardItems,
  [{ label: 'Все игры', icon: gamesIcon, expandable: true }],
  [
    { label: 'Program Loyalty', icon: loyaltyIcon, compactHidden: true },
    { label: 'VIP club', icon: vipIcon },
  ],
  [{ label: 'Профиль', icon: userIcon, expandable: true }],
  [
    { label: 'Правила', icon: fileIcon },
    { label: 'Поддержка', icon: supportIcon, count: '24/7' },
  ],
]
</script>

<template>
  <aside class="app-sidebar" :class="{ 'app-sidebar--collapsed': collapsed }">
    <div class="sidebar-switcher">
      <button class="icon-button" type="button" aria-label="Переключить сайдбар" @click="$emit('toggle')">
        <img :src="menuIcon" alt="" />
      </button>
      <div class="sidebar-tabs">
        <button type="button"><img :src="casinoIcon" alt="" /><span>Казино</span></button>
        <button type="button"><img :src="sportIcon" alt="" /><span>Спорт</span></button>
      </div>
    </div>

    <div class="sidebar-search">
      <label class="sidebar-search__control">
        <img :src="searchIcon" alt="" />
        <input type="search" placeholder="Поиск" aria-label="Поиск" autocomplete="off" />
      </label>
    </div>

    <section class="sidebar-featured" aria-label="Игровые разделы">
      <a class="sidebar-featured__wheel" href="#">
        <img :src="wheelIcon" alt="" />
        <span>Колесо Фортуны</span>
        <small>TOP</small>
      </a>
      <div class="sidebar-featured__pair">
        <a href="#"><i><img :src="missionsIcon" alt="" /></i><span>Миссии</span></a>
        <a href="#"><i><img :src="lootboxIcon" alt="" /></i><span>Лутбокс</span></a>
      </div>
    </section>

    <nav aria-label="Основная навигация">
      <ul v-for="(group, index) in groups" :key="index" class="sidebar-group">
        <li v-for="item in group" :key="item.label">
          <div class="sidebar-row" :class="{ active: item.active, 'sidebar-row--compact-hidden': item.compactHidden }">
            <span v-if="item.active" class="sidebar-active-marker" aria-hidden="true" />
            <a href="#" :aria-current="item.active ? 'page' : undefined">
              <img class="sidebar-item__icon" :class="item.iconClass" :src="item.icon" alt="" />
              <span class="sidebar-item__label">{{ item.label }}</span>
              <i v-if="item.dot" class="sidebar-item__dot" aria-label="Есть обновление" />
              <small v-if="item.count" class="sidebar-item__badge">{{ item.count }}</small>
            </a>
            <button v-if="item.expandable" class="sidebar-item__expand" type="button" :aria-label="`Раскрыть ${item.label}`">
              <img :src="chevronIcon" alt="" />
            </button>
          </div>
        </li>
      </ul>
    </nav>
  </aside>
</template>
