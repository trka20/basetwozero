<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import BottomNav from './components/BottomNav.vue'
import HomePage from './components/HomePage.vue'

const STORAGE_KEY = 'basetwozero:sidebar-collapsed'
const isSidebarCollapsed = ref(false)

onMounted(() => {
  isSidebarCollapsed.value = window.localStorage.getItem(STORAGE_KEY) === 'true'
})

watch(isSidebarCollapsed, (value) => {
  window.localStorage.setItem(STORAGE_KEY, String(value))
})
</script>

<template>
  <div class="app-shell" :class="{ 'sidebar-is-collapsed': isSidebarCollapsed }">
    <AppSidebar
      :collapsed="isSidebarCollapsed"
      @toggle="isSidebarCollapsed = !isSidebarCollapsed"
    />

    <div class="app-column">
      <AppHeader />

      <HomePage />
    </div>

    <BottomNav />
  </div>
</template>
