<template>
  <div class="h-100">
    <header class="header">
      <picture>
        <source
          media="(max-width: 1199px)"
          srcset="/img/instagram-placement/banner_sm.webp 1x,
                        /img/instagram-placement/banner_sm.webp 2x,
                        /img/instagram-placement/banner_sm.webp 3x"
          type="image/webp"
        >
        <source
          media="(max-width: 1199px)"
          srcset="/img/instagram-placement/banner_sm.jpg 1x,
                        /img/instagram-placement/banner_sm.jpg 2x,
                        /img/instagram-placement/banner_sm.jpg 3x"
          type="image/jpg"
        >
        <source
          media="(min-width: 1200px)"
          srcset="/img/instagram-placement/banner_sm.webp 532w,
                        /img/instagram-placement/banner_md.webp 1600w,
                        /img/instagram-placement/banner.webp 2460w"
          type="image/webp" sizes="100vw"
        >
        <source
          media="(min-width: 1200px)"
          srcset="/img/instagram-placement/banner_sm.jpg 532w,
                        /img/instagram-placement/banner_md.jpg 1600w,
                        /img/instagram-placement/banner.jpg 2460w"
          type="image/jpg" sizes="100vw"
        >
        <img src="/img/instagram-placement/banner.jpg" class="w-100 h-auto" alt="Instagram Placement" loading="lazy">
      </picture>
    </header>
    <v-container fluid>
      <v-row v-if="!instagram_placement_manager.is_account">
        <v-spacer />
        <v-col cols="12" lg="6" xl="4" class="py-1">
          <order-widget />
        </v-col>
        <v-col cols="12" lg="6" xl="4" class="py-1">
          <become-manager />
        </v-col>
        <v-spacer />
      </v-row>
      <div v-else>
        <v-col cols="12" class="py-1">
          <stats-widgets
            :statData="statData"
            :loading="loading"
            :columns="[
              {name: 'status', title: 'Status', color: '#7f2450', filter: (value) => this.uppercase(value), icon: 'mdi-flare'},
              {name: 'orders_completed', title: 'Complete', color: '#ee378e', icon: 'mdi-check-all'},
              {name: 'orders_pending', title: 'Pending', color: '#3F51B5', icon: 'mdi-timer-sand-full'},
              {name: 'total_orders', title: 'Total', color: '#0f1d3a', icon: 'mdi-account-multiple'},
              {name: 'payout_amount', title: 'Payout', color: '#69F0AE', icon: 'mdi-currency-usd'}
            ]"
          >
          </stats-widgets>
          <payout-modal :payout-amount="statData.payout_amount" :last-payout="statData.last_payout" type="instagram-placement-account" ref="payoutModal"></payout-modal>
        </v-col>
        <div class="d-flex my-4">
          <v-btn color="primary" @click="openAccountModal">Modify Account</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green" dark @click="openPayoutModal">Payout</v-btn>
        </div>
        <orders-table />
      </div>
    </v-container>
    <become-manager-modal ref="accountModal" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BecomeManager from '@/components/InstagramPlacement/BecomeManager'
import OrderWidget from '@/components/InstagramPlacement/OrderWidget'
import StatsWidgets from '@/components/StatsWidgets'
import PayoutModal from '@/components/PayoutModal'
import BecomeManagerModal from '@/components/InstagramPlacement/BecomeManagerModal'
import OrdersTable from '@/components/InstagramPlacement/OrdersTable'
import Vue from 'vue'

export default {
  components: {
    BecomeManager,
    OrderWidget,
    StatsWidgets,
    PayoutModal,
    BecomeManagerModal,
    OrdersTable
  },
  data () {
    return {
      url: 'v1/instagram-placement/stats',
      statData: {},
      loading: false
    }
  },
  metaInfo () {
    return {
      title: 'Instagram Placement',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content:
            'Artist Republik is a 360 degree platform offering social placement to help launch your career! We offer reviews, distribution, playlisting, promotion and more!'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content:
            'Instagram Placement | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content:
            'Artist Republik is a 360 degree platform offering social placement to help launch your career! We offer reviews, distribution, playlisting, promotion and more!'
        },
        {
          vmid: 'og:url',
          property: 'og:url',
          content: 'https://app.artistrepublik.com' + this.$route.fullPath
        },
        {
          vmid: 'twitter:title',
          property: 'twitter:title',
          content:
            'Instagram Placement | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Artist Republik is a 360 degree platform offering social placement to help launch your career! We offer reviews, distribution, playlisting, promotion and more!'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      instagram_placement_manager: 'getInstagramPlacementAccount'
    })
  },
  methods: {
    openPayoutModal: function () {
      this.$refs.payoutModal.openModal()
    },
    openAccountModal: function () {
      this.$refs.accountModal.openModal()
    }
  },
  mounted: async function () {
    this.loading = true
    try {
      let { data: { data } } = await Vue.$http.get(this.url)
      this.statData = data
    } catch (err) {
      this.throwError(err)
    }
    this.loading = false
  }
}
</script>

<style>

</style>
