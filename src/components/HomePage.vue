<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import AppFooter from './AppFooter.vue'
import HeroCarousel from './HeroCarousel.vue'
import PrizeCarousel from './PrizeCarousel.vue'
import { useFiniteCarousel } from '../composables/useFiniteCarousel'
import casinoImage from '../assets/categories/casino.png'
import sportImage from '../assets/categories/sport.png'
import wheelImage from '../assets/categories/wheel.png'
import bonusImage from '../assets/categories/bonus.png'
import goldenJoker from '../assets/games/golden-joker.png'
import destinyDragon from '../assets/games/destiny-dragon.png'
import cash from '../assets/games/cash.png'
import witch from '../assets/games/witch.png'
import kingCarrot from '../assets/games/king-carrot.png'
import neko from '../assets/games/neko.png'
import wild from '../assets/games/wild.png'
import gameCIrs from '../assets/games/framer/cIrsFWwClDRo2NnJQQuy470w.png'
import gameZxCO from '../assets/games/framer/zxCOJ12jxxrxjLRc5pb11HvA0I.png'
import gameHNOZ from '../assets/games/framer/hNOZngoYXIajJL0S9CzyATutSU.png'
import game4fx from '../assets/games/framer/4fxIdlm03xxL9R9Yk8vgB2gwTA.png'
import gameVBZ from '../assets/games/framer/VBZpEk5BOjc0lVUKURJjJKXS3M.png'
import game5iu from '../assets/games/framer/5iuZrldgUJ9bLkSDfxpcZyhrs.png'
import game5VW from '../assets/games/framer/5VWQpxNj8k0q7k12wLfX1rrksU.png'
import gameHgKg from '../assets/games/framer/HgKgTuTiJAtgVDmDEBNpb0AEww.jpg'
import gameASKX from '../assets/games/framer/ASKX7xr1VUFMNKBEpIRl1mvvRQ.jpg'
import gameZ2DY from '../assets/games/framer/z2DYZCB4AIJGVWt1GlW0giJL8M.jpg'
import gameULew from '../assets/games/framer/uLewZkcagTJCdYuwD45009fM.jpg'
import gameYwXs from '../assets/games/framer/ywXsn6HHdbWyN2FtYtogkGd4TF0.jpg'
import gameYx2Q from '../assets/games/framer/yx2QCVCT5sAg9v9e6kaeWvgaUM.jpg'
import gameFBV3 from '../assets/games/framer/fBV3LyOUxY3qWgDrxDPIWyInLGg.jpg'
import gameMVmb from '../assets/games/framer/MVmbcTeE3FMPg8CX06z06lDreU.jpg'
import gameA3ai from '../assets/games/framer/a3aipHFy7qTwdxRtO6uYFnOboQQ.jpg'
import gameXel2 from '../assets/games/framer/Xel2SLVDxTiJy88VVm8g9GSS8.jpg'
import gameV1RS from '../assets/games/framer/v1RSOByXaLqsgTYY1RqhYmk0zI.jpg'
import game5yH4 from '../assets/games/framer/5yH44cAw4TLtd4tRjUNscwnrg.jpg'
import football from '../assets/sports/framer-football.png'
import tennis from '../assets/sports/framer-tennis.png'
import hockey from '../assets/sports/framer-hockey.png'
import baseball from '../assets/sports/framer-baseball.png'
import basketball from '../assets/sports/framer-basketball.png'
import volleyball from '../assets/sports/framer-volleyball.png'
import tableTennis from '../assets/sports/framer-table-tennis.png'
import cs2 from '../assets/sports/framer-cs2.png'
import lol from '../assets/sports/framer-lol.png'
import dota2 from '../assets/sports/framer-dota-2.png'
import slotsIcon from '../assets/section-icons/slots.svg'
import liveIcon from '../assets/section-icons/live.svg'
import sportIcon from '../assets/section-icons/sport.svg'
import popularIcon from '../assets/section-icons/popular.svg'
import cupIcon from '../assets/section-icons/cup.svg'
import prizeLiveIcon from '../assets/section-icons/prize-live.svg'
import flagIcon from '../assets/section-icons/flag.svg'
import arrowLeft from '../assets/icons/arrow-left.svg'
import arrowRight from '../assets/icons/arrow-right.svg'
import arrowForward from '../assets/icons/arrow-forward.svg'
import flashIcon from '../assets/icons/flash.svg'
import provider2by2 from '../assets/providers/2by2.svg'
import providerSpin from '../assets/providers/spin.svg'
import providerPlayer from '../assets/providers/player.svg'
import providerAinsworth from '../assets/providers/ainsworth.svg'
import providerPlaybro from '../assets/providers/playbro.svg'
import providerRedtiger from '../assets/providers/redtiger.svg'
import provider07 from '../assets/providers/framer/provider-07.png'
import provider08 from '../assets/providers/framer/provider-08.png'
import provider09 from '../assets/providers/framer/provider-09.png'
import provider10 from '../assets/providers/framer/provider-10.png'
import provider11 from '../assets/providers/framer/provider-11.png'
import provider12 from '../assets/providers/framer/provider-12.png'
import provider13 from '../assets/providers/framer/provider-13.png'
import provider14 from '../assets/providers/framer/provider-14.png'
import provider16 from '../assets/providers/framer/provider-16.png'
import provider17 from '../assets/providers/framer/provider-17.png'
import tableUser from '../assets/table/user.svg'
import btc from '../assets/table/btc.svg'
import usdt from '../assets/table/usdt.svg'
import eth from '../assets/table/eth.svg'

type Card = { image: string; label: string; provider?: string; badge?: string }

const categoryLinks = [
  { label: 'Казино', image: casinoImage, modifier: 'casino' },
  { label: 'Спорт', image: sportImage, modifier: 'sport' },
  { label: 'Колесо фортуны', image: wheelImage, modifier: 'wheel' },
  { label: 'Бонусы', image: bonusImage, modifier: 'bonus' },
]

const games: Card[] = [
  { image: goldenJoker, label: 'Golden Joker', provider: 'Tadagaming' },
  { image: destinyDragon, label: 'Destiny Dragon', provider: 'Amigo Gaming' },
  { image: cash, label: 'Lights, Camera, Cash!', provider: 'NetEnt' },
  { image: witch, label: "Witches’s Night", provider: 'Tadagaming' },
  { image: kingCarrot, label: 'King Carrot', provider: 'Hacksaw Gaming' },
  { image: neko, label: 'Neko Fortune', provider: 'Tadagaming' },
  { image: wild, label: 'Wild Racer', provider: 'Tadagaming' },
  { image: destinyDragon, label: 'Destiny Dragon', provider: 'Amigo Gaming' },
]

const framerGame = (image: string, label: string): Card => ({ image, label })

const slotGames: Card[] = [
  gameCIrs, gameZxCO, gameHNOZ, game4fx, gameVBZ, game5iu, game5VW, gameHgKg, gameASKX, gameZ2DY,
  gameULew, gameYwXs, gameYx2Q, gameYwXs, gameFBV3, gameMVmb, gameA3ai, gameXel2, gameV1RS, game5yH4,
].map((image, index) => framerGame(image, `Slot game ${index + 1}`))

const liveGames: Card[] = [
  gameULew, gameXel2, gameYx2Q, gameYwXs, gameCIrs, gameZxCO, gameHNOZ, game4fx, gameVBZ, game5iu,
  game5VW, gameHgKg, gameASKX, gameZ2DY, gameYwXs, gameFBV3, gameMVmb, gameA3ai, gameV1RS, game5yH4,
].map((image, index) => framerGame(image, `Live casino game ${index + 1}`))

const popularGames: Card[] = [
  gameMVmb, gameV1RS, gameCIrs, gameYwXs, gameZxCO, gameHNOZ, game4fx, gameVBZ, game5iu, game5VW,
  gameHgKg, gameASKX, gameZ2DY, gameULew, gameYwXs, gameYx2Q, gameFBV3, gameA3ai, gameXel2, game5yH4,
].map((image, index) => framerGame(image, `Popular game ${index + 1}`))

const sports: Card[] = [
  { image: football, label: 'Футбол', badge: 'TOP' },
  { image: tennis, label: 'Теннис', badge: 'TOP' },
  { image: hockey, label: 'Хоккей' },
  { image: baseball, label: 'Бейсбол' },
  { image: basketball, label: 'Баскетбол' },
  { image: volleyball, label: 'Волейбол' },
  { image: tableTennis, label: 'Настольный теннис' },
  { image: cs2, label: 'CS2' },
  { image: lol, label: 'LoL' },
  { image: dota2, label: 'Dota 2' },
]

const providers = [
  provider2by2, providerSpin, providerPlayer, providerAinsworth, providerPlaybro, providerRedtiger,
  provider07, provider08, provider09, provider10, provider11, provider12, provider13, provider14,
  provider14, provider16, provider17,
]
const currencies = [btc, usdt, usdt, eth, btc, usdt, usdt, eth, usdt, eth]
const tableGames = [destinyDragon, goldenJoker, goldenJoker, witch, destinyDragon, goldenJoker, goldenJoker, witch, goldenJoker, witch]

let rowId = 0
const makeRow = (index: number) => ({
  id: rowId++,
  game: ['Destiny Dragon', 'Golden', 'Joker Bombs', "Witches’s Night"][index % 4],
  image: tableGames[index],
  currency: currencies[index],
  stake: index === 1 ? '1 853,00 $' : index === 3 ? '3,00 $' : '853,00 $',
  multiplier: index % 3 === 1 ? '15,00x' : index % 3 === 2 ? '0,70x' : '6,00x',
  payout: index === 1 ? '24 999,00 $' : index % 3 === 2 ? '-356,00 $' : index === 3 ? '18,00 $' : '5 118,00 $',
  negative: index % 3 === 2,
})
const rows = ref([
  makeRow(10 % tableGames.length),
  ...Array.from({ length: 10 }, (_, index) => makeRow(index)),
])
const rowsAnimating = ref(false)
let nextRow = 11
let rowsTimer: number | undefined

const finishRowsAnimation = (event: TransitionEvent) => {
  if (event.target !== event.currentTarget || event.propertyName !== 'transform' || !rowsAnimating.value) return

  rows.value = [
    makeRow(nextRow % tableGames.length),
    ...rows.value.slice(0, 10),
  ]
  nextRow += 1
  rowsAnimating.value = false
}

const prizeAmounts = ['$ 1,240', '$ 3,875', '$ 7,560', '$ 12,480', '$ 19,919', '$ 24,600', '$ 31,250']
const prizeUsers = ['a****@mail.ru', 'm****@gmail.com', 'd****@mail.ru', 'k****@gmail.com']

const shuffle = <T,>(items: T[]) => {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[target]] = [result[target], result[index]]
  }
  return result
}

const highlightedPrize = Math.floor(Math.random() * games.length)
const prizeGames = shuffle(games).map((game, index) => ({
  image: game.image,
  game: game.label,
  amount: prizeAmounts[Math.floor(Math.random() * prizeAmounts.length)],
  username: prizeUsers[Math.floor(Math.random() * prizeUsers.length)],
  highlighted: index === highlightedPrize,
}))

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  rowsTimer = window.setInterval(() => {
    if (!rowsAnimating.value) rowsAnimating.value = true
  }, 2500)
})

onBeforeUnmount(() => window.clearInterval(rowsTimer))

const gameSections = [
  { id: 'slots', title: 'Слоты', icon: slotsIcon, cards: slotGames },
  { id: 'live', title: 'Live казино', icon: liveIcon, cards: liveGames },
]

const { edges: carouselEdges, move: moveCarousel, setTrack: setCarouselTrack } = useFiniteCarousel()

</script>

<template>
  <main class="home-page">
    <HeroCarousel class="page-reveal page-reveal--hero" />

    <section class="category-links page-reveal page-reveal--categories" aria-label="Основные разделы">
      <a v-for="item in categoryLinks" :key="item.label" :class="`category-link category-link--${item.modifier}`" href="#">
        <span class="category-links__image"><img :src="item.image" alt="" /></span>
        <span class="category-links__copy">
          <strong>{{ item.label }}</strong>
          <small><span>Перейти</span><img :src="arrowForward" alt="" /></small>
        </span>
      </a>
    </section>

    <section
      v-for="(section, sectionIndex) in gameSections"
      :key="section.id"
      class="home-section page-reveal"
      :style="{ '--page-reveal-delay': `${200 + sectionIndex * 100}ms` }"
    >
      <div class="section-heading">
        <h2><img :src="section.icon" alt="" />{{ section.title }}</h2>
        <div class="section-heading__actions"><button type="button" class="section-all-button">Все<img :src="arrowForward" alt="" /></button><button type="button" aria-label="Назад" :disabled="carouselEdges[section.id]?.atStart ?? true" @click="moveCarousel(section.id, -1)"><img :src="arrowLeft" alt="" /></button><button type="button" aria-label="Вперёд" :disabled="carouselEdges[section.id]?.atEnd ?? true" @click="moveCarousel(section.id, 1)"><img :src="arrowRight" alt="" /></button></div>
      </div>
      <div :ref="(element) => setCarouselTrack(section.id, element)" class="card-track game-track" tabindex="0" @keydown.left.prevent="moveCarousel(section.id, -1)" @keydown.right.prevent="moveCarousel(section.id, 1)">
        <article v-for="(card, index) in section.cards" :key="`${section.title}-${index}-${card.image}`" class="game-card carousel-item-motion">
          <img :src="card.image" :alt="card.label" />
        </article>
      </div>
    </section>

    <section class="home-section home-section--sports page-reveal page-reveal--sports">
      <div class="section-heading">
        <h2><img :src="sportIcon" alt="" />Виды спорта</h2>
        <div class="section-heading__actions"><button type="button" class="section-all-button">Все<img :src="arrowForward" alt="" /></button><button type="button" aria-label="Назад" :disabled="carouselEdges.sports?.atStart ?? true" @click="moveCarousel('sports', -1)"><img :src="arrowLeft" alt="" /></button><button type="button" aria-label="Вперёд" :disabled="carouselEdges.sports?.atEnd ?? true" @click="moveCarousel('sports', 1)"><img :src="arrowRight" alt="" /></button></div>
      </div>
      <div :ref="(element) => setCarouselTrack('sports', element)" class="card-track sport-track" tabindex="0" @keydown.left.prevent="moveCarousel('sports', -1)" @keydown.right.prevent="moveCarousel('sports', 1)">
        <article v-for="card in sports" :key="card.image" class="sport-card carousel-item-motion">
          <div>
            <img :src="card.image" :alt="card.label" />
            <span v-if="card.badge" class="sport-badge"><b>{{ card.badge }}</b><i><img :src="flashIcon" alt="" /></i></span>
          </div>
          <strong>{{ card.label }}</strong>
        </article>
      </div>
    </section>

    <section class="home-section page-reveal page-reveal--popular">
      <div class="section-heading">
        <h2><img :src="popularIcon" alt="" />Популярные игры</h2>
        <div class="section-heading__actions"><button type="button" class="section-all-button">Все<img :src="arrowForward" alt="" /></button><button type="button" aria-label="Назад" :disabled="carouselEdges.popular?.atStart ?? true" @click="moveCarousel('popular', -1)"><img :src="arrowLeft" alt="" /></button><button type="button" aria-label="Вперёд" :disabled="carouselEdges.popular?.atEnd ?? true" @click="moveCarousel('popular', 1)"><img :src="arrowRight" alt="" /></button></div>
      </div>
      <div :ref="(element) => setCarouselTrack('popular', element)" class="card-track game-track" tabindex="0" @keydown.left.prevent="moveCarousel('popular', -1)" @keydown.right.prevent="moveCarousel('popular', 1)">
        <article v-for="(card, index) in popularGames" :key="`popular-${index}-${card.image}`" class="game-card carousel-item-motion"><img :src="card.image" :alt="card.label" /></article>
      </div>
    </section>

    <section class="home-section page-reveal page-reveal--wins">
      <div class="section-heading prize-heading">
        <h2><img :src="cupIcon" alt="" />Последние выигрыши</h2>
        <div class="online"><strong>41 312</strong><span>Игроков онлайн</span><i><img :src="prizeLiveIcon" alt="" /></i></div>
      </div>
      <PrizeCarousel :prizes="prizeGames" />
    </section>

    <section class="home-section page-reveal page-reveal--providers">
      <div class="section-heading">
        <h2><img :src="flagIcon" alt="" />Провайдеры</h2>
        <div class="section-heading__actions"><button type="button" aria-label="Назад" :disabled="carouselEdges.providers?.atStart ?? true" @click="moveCarousel('providers', -1)"><img :src="arrowLeft" alt="" /></button><button type="button" aria-label="Вперёд" :disabled="carouselEdges.providers?.atEnd ?? true" @click="moveCarousel('providers', 1)"><img :src="arrowRight" alt="" /></button></div>
      </div>
      <div :ref="(element) => setCarouselTrack('providers', element)" class="card-track provider-track" tabindex="0" @keydown.left.prevent="moveCarousel('providers', -1)" @keydown.right.prevent="moveCarousel('providers', 1)">
        <div v-for="provider in providers" :key="provider" class="provider-card carousel-item-motion"><img :src="provider" alt="" /></div>
      </div>
    </section>

    <section class="leaderboard page-reveal page-reveal--leaderboard">
      <header>
        <div class="segmented"><button class="active" type="button">Последние ставки</button><button type="button">Крупные ставки</button></div>
        <div class="segmented leaderboard__limit"><button class="active" type="button">10</button><button type="button">20</button><button type="button">30</button></div>
      </header>
      <div class="leaderboard__labels"><span>Пользователь</span><span>Игра</span><span>Сумма ставки</span><span>Множитель</span><span>Выплата</span></div>
      <div class="leaderboard__rows">
        <div
          class="leaderboard__track"
          :class="{ 'leaderboard__track--animating': rowsAnimating }"
          @transitionend="finishRowsAnimation"
        >
          <div v-for="row in rows" :key="row.id" class="leaderboard-row">
            <span class="player"><img :src="tableUser" alt="" />a****@mail.ru</span>
            <span class="table-game"><img :src="row.image" alt="" />{{ row.game }}</span>
            <strong><img :src="row.currency" alt="" />{{ row.stake }}</strong>
            <span>{{ row.multiplier }}</span>
            <strong :class="{ negative: row.negative }"><img :src="row.currency" alt="" />{{ row.payout }}</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="seo-card page-reveal page-reveal--seo">
      <h2>Casino — Where Big Wins Begin</h2>
      <p>The importance of Search Engine Optimization (SEO) in the modern world cannot be underestimated.<br />SEO not only improves a website’s visibility in search results but also increases its relevance for potential visitors. Through strategic use of keywords, content optimization, and technical enhancements, a website can achieve significant growth in both traffic and conversions.</p>
      <button type="button">Показать еще</button>
    </section>
  </main>

  <AppFooter />
</template>
