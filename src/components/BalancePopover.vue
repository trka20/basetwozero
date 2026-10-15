<script setup lang="ts">
import arrowBottomIcon from '../assets/popovers/balance/arrow-bottom.svg'
import arrowForwardIcon from '../assets/popovers/balance/arrow-forward.svg'
import btcIcon from '../assets/popovers/balance/btc.svg'
import closeIcon from '../assets/popovers/balance/close.svg'
import ethIcon from '../assets/popovers/balance/eth.svg'
import freebetIcon from '../assets/popovers/balance/freebet.png'
import infoIcon from '../assets/popovers/balance/info.svg'
import ltcIcon from '../assets/popovers/balance/ltc.svg'
import plusCircleIcon from '../assets/popovers/balance/plus-circle.svg'
import plusIcon from '../assets/popovers/balance/plus.svg'
import sportAccountIcon from '../assets/popovers/balance/sport-account.png'
import trxIcon from '../assets/popovers/balance/trx.svg'
import usdtIcon from '../assets/popovers/balance/usdt.svg'

defineProps<{ anchorLeft: number }>()
const emit = defineEmits<{ close: [] }>()

const accounts = [
  { name: 'Bitcoin', ticker: 'BTC', amount: '853,00 $', icon: btcIcon },
  { name: 'Etherium', ticker: 'ETH', amount: '853,00 $', icon: ethIcon },
  { name: 'USDT', ticker: 'USDT', amount: '853,00 $', icon: usdtIcon },
  { name: 'TRON', ticker: 'TRX', amount: '853,00 $', icon: trxIcon },
  { name: 'Litecoin', ticker: 'LTC', amount: '853,00 $', icon: ltcIcon },
]
</script>

<template>
  <div class="popover-layer" @mousedown.self="emit('close')">
    <section
      class="account-popover balance-popover"
      :style="{ '--anchor-left': `${anchorLeft}px` }"
      role="dialog"
      aria-label="Баланс"
      @mousedown.stop
    >
      <header class="account-popover__mobile-header">
        <h2>Баланс</h2>
        <button type="button" aria-label="Закрыть баланс" @click="emit('close')">
          <img :src="closeIcon" alt="" />
        </button>
      </header>

      <div class="balance-popover__scroll">
        <div class="balance-summary">
          <div class="balance-summary__caption"><span>Счет</span><i></i><span>Bitcoin</span></div>
          <strong>2,00 BTC</strong>
        </div>

        <div class="balance-actions">
          <button class="balance-actions__deposit" type="button"><img :src="plusIcon" alt="" />Пополнить</button>
          <button type="button">Вывести</button>
        </div>

        <div class="balance-divider"></div>

        <div class="bonus-grid">
          <article class="bonus-card">
            <div><p>Casino Bonus <img :src="infoIcon" alt="" /></p><strong><img :src="sportAccountIcon" alt="" />8 206,33 $ <img class="bonus-card__arrow" :src="arrowForwardIcon" alt="" /></strong></div>
            <span class="bonus-progress">66%</span>
          </article>
          <article class="bonus-card">
            <div><p>Спортивный бонус</p><strong><img :src="sportAccountIcon" alt="" />8 206,33 $ <img class="bonus-card__arrow" :src="arrowForwardIcon" alt="" /></strong></div>
            <span class="bonus-progress">66%</span>
          </article>
          <article class="bonus-card bonus-card--wide bonus-card--timer">
            <div><p>Free bet</p><strong><img class="bonus-card__freebet" :src="freebetIcon" alt="" />100,00 $ <img class="bonus-card__arrow" :src="arrowForwardIcon" alt="" /></strong></div>
            <span class="bonus-timer">
              <small>Available</small>
              <span class="bonus-timer__count"><b>7</b><b>23</b><b>29</b><b>10</b></span>
            </span>
          </article>
          <article class="bonus-card bonus-card--wide bonus-card--points-row">
            <div><p>Winum Points</p><strong><img :src="sportAccountIcon" alt="" />12 245 <img class="bonus-card__arrow" :src="arrowForwardIcon" alt="" /></strong></div>
          </article>
        </div>

        <div class="balance-divider"></div>

        <div class="accounts-heading"><strong>Все счета</strong><button type="button">Добавить <img :src="plusCircleIcon" alt="" /></button></div>
        <div class="accounts-list">
          <button v-for="account in accounts" :key="account.ticker" type="button">
            <img :src="account.icon" alt="" />
            <span><strong>{{ account.name }}</strong><small>{{ account.ticker }}</small></span>
            <b>{{ account.amount }}</b>
          </button>
        </div>
      </div>

      <button class="balance-currency" type="button">
        <span>Баланс в валюте</span><img :src="arrowBottomIcon" alt="" /><i></i>
      </button>
    </section>
  </div>
</template>
