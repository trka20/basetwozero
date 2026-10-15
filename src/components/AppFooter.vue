<script setup lang="ts">
import logo from '../assets/brand/logo-desktop.svg'
import laptop from '../assets/footer/device-laptop.png'
import laptopScreen from '../assets/footer/device-screen.png'
import phoneScreen from '../assets/footer/device-phone-screen.png'
import gift from '../assets/footer/device-gift.png'
import macos from '../assets/footer/platform-macos.svg'
import android from '../assets/footer/platform-android.svg'
import ios from '../assets/footer/platform-ios.svg'
import platformArrow from '../assets/footer/platform-arrow.svg'
import scrollTop from '../assets/footer/scroll-top.svg'
import telegram from '../assets/footer/telegram.svg'
import tiktok from '../assets/footer/tiktok.svg'
import facebook from '../assets/footer/facebook.svg'
import gcb from '../assets/footer/gcb.svg'

const columns = [
  { title: 'Информация', links: ['Правила', 'Партнерская программа'] },
  { title: 'Казино', links: ['Live-казино', 'Слоты', 'Казино'] },
  { title: 'Спорт', links: ['Live', 'Pre-match', 'eSports'] },
  { title: 'Предложения', links: ['Бонусы', 'Промоакции', 'VIP Клуб'] },
]

const platforms = [
  { name: 'macOS', icon: macos },
  { name: 'Android', icon: android },
  { name: 'iOS', icon: ios },
]

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div class="footer-mobile-brand">
        <img :src="logo" alt="Winum" />
        <span />
        <button type="button" aria-label="Наверх" @click="scrollToTop"><img :src="scrollTop" alt="" /></button>
      </div>

      <div class="footer-top">
        <img class="footer-logo" :src="logo" alt="Winum" />
        <nav class="footer-links" aria-label="Навигация в футере">
          <div v-for="column in columns" :key="column.title" class="footer-column">
            <strong>{{ column.title }}</strong>
            <a v-for="link in column.links" :key="link" href="#">{{ link }}</a>
          </div>
        </nav>
        <div class="footer-controls">
          <button type="button">Русский <span>⌄</span></button>
          <button type="button">Поддержка <b>24/7</b></button>
          <div class="footer-contacts">
            <small>Коммерческие предложения<a href="mailto:business@Casino.xyz">business@Casino.xyz</a></small>
            <small>Партнерская программа<a href="mailto:partners@Casino.pro">partners@Casino.pro</a></small>
          </div>
        </div>
      </div>

      <section class="footer-app" aria-label="Скачать приложение">
        <div class="footer-devices" aria-hidden="true">
          <img class="footer-devices__laptop" :src="laptop" alt="" />
          <img class="footer-devices__screen" :src="laptopScreen" alt="" />
          <img class="footer-devices__gift" :src="gift" alt="" />
          <span class="footer-devices__phone"><img :src="phoneScreen" alt="" /></span>
          <span class="footer-devices__download">Скачать</span>
        </div>
        <h2>200 Points за установку приложения</h2>
        <div class="footer-platforms">
          <a v-for="platform in platforms" :key="platform.name" href="#">
            <span><img :src="platform.icon" alt="" /></span>
            <small>Приложение<strong>для {{ platform.name }}</strong></small>
            <img class="footer-platforms__arrow" :src="platformArrow" alt="" />
          </a>
        </div>
      </section>

      <div class="footer-legal">
        <p>© 2026 01tech. 01tech.pro operated by 01tech N.V. which is registered at Dr. H. Fergusonweg 1, Curaçao, with company number 147039, and having gaming license 8048/JAZ2018-040 and all rights to operate the gaming software. MFI INVESTMENTS LIMITED, a company, whose registered office is at 3, Chytron Street, Flat/Office 301, P.C. 1075 Nicosia, Cyprus with company number HE386738.EU company MFI Investments Ltd is providing payment services as an agent according to the license agreement concluded between MFI INVESTMENTS LIMITED and 01tech N.V.</p>
        <p>Cyprus with company number HE386738.EU company MFI Investments Ltd is providing payment services as an agent according to the license agreement concluded between MFI INVESTMENTS LIMITED and 01tech N.V.</p>
        <p>Investments Ltd is providing payment services as an agent according to the license agreement concluded between MFI INVESTMENTS LIMITED and 01tech N.V.</p>
      </div>

      <div class="footer-bottom">
        <div class="socials">
          <a href="#" aria-label="Telegram"><img :src="telegram" alt="" /></a>
          <a href="#" aria-label="Instagram"><span class="instagram-mark">◎</span></a>
          <a href="#" aria-label="TikTok"><img :src="tiktok" alt="" /></a>
          <a href="#" aria-label="Facebook"><img :src="facebook" alt="" /></a>
        </div>
        <div class="age"><img :src="gcb" alt="GCB" /><strong>18+</strong></div>
      </div>
    </div>
  </footer>
</template>
