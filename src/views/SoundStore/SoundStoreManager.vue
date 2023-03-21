<template>
  <div class="h-100">
    <v-base-header image="/img/sound-store/banner.png" />
    <v-container>

      <div v-if="is_account" class="CuratorStats mt--4 mb-4 mt-2">
        <v-row v-if="loadingStats">
          <v-col class="text-center">
            <v-progress-circular indeterminate size="32" color="purple"></v-progress-circular>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="6" xl="3">
            <StatsCard
              title="Status"
              color="#ee378e"
              :stat="status"
              icon="mdi-check-all"
              class="mb-4 mb-xl-0"
            />
          </v-col>
          <v-col cols="6" xl="3">
            <StatsCard
              title="Offers"
              color="#3F51B5"
              :stat="offers"
              icon="mdi-timer-sand-full"
              class="mb-4 mb-xl-0"
            />
          </v-col>
          <v-col cols="6" xl="3">
            <StatsCard
              title="Total Orders"
              color="#0f1d3a"
              :stat="orders"
              icon="mdi-account-multiple"
              class="mb-4 mb-xl-0"
            />
          </v-col>
          <v-col cols="6" xl="3">
            <StatsCard
              title="Payout"
              color="#69F0AE"
              :stat="payout_amount"
              icon="mdi-currency-usd"
              class="mb-4 mb-xl-0"
            />
          </v-col>
        </v-row>
      </div>
      <payout-modal :payout-amount="payout_amount" :last-payout="last_payout" type="sound-store" ref="payoutModal"></payout-modal>


      <v-card :flat="flat">
        <div class="p-4" v-if="!is_account">
          <v-row>
            <v-col md="6" offset-md="3">
              <sound-store-register-widget />
            </v-col>
          </v-row>
        </div>
        <div v-else>
          <v-row v-if="is_account">
            <v-col cols="12" class="text-center">
              <v-btn class="m-1 my-md-2 mx-md-4" color="primary" :href="`${mainUrl}tools/sound-store/${encodeURI(display_name)}`" target="_new">Public Beat Profile</v-btn>
              <v-btn class="m-1 my-md-2 mx-md-4" color="primary" @click="$refs.sampleModal.openModal()">Add Sample / Pack</v-btn>
              <v-btn class="m-1 my-md-2 mx-md-4" color="primary" @click="$refs.beatModal.openModal()">Add Beat</v-btn>
              <v-btn class="m-1 my-md-2 mx-md-4" color="success" @click="openPayoutModal(true)">
                Payout
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-if="is_account">
            <v-col cols="12">
              <v-toolbar color="primary" dark>
                <v-toolbar-title>Sound Store Manager</v-toolbar-title>
              </v-toolbar>
              <v-tabs vertical v-model="tab">
                <v-tab href="#orders">
                  Orders
                </v-tab>
                <v-tab href="#offers">
                  Offers
                </v-tab>
                <v-tab href="#samples">
                  Samples
                </v-tab>
                <v-tab href="#beats">
                  Beats
                </v-tab>
                <v-tab-item class="p-2" value="orders">
                  <orders />
                </v-tab-item>
                <v-tab-item class="p-2" value="offers">
                  <offers />
                </v-tab-item>
                <v-tab-item class="p-2" value="samples">
                  <samples />
                </v-tab-item>
                <v-tab-item class="p-2" value="beats">
                  <beats />
                </v-tab-item>
              </v-tabs>
            </v-col>
          </v-row>
        </div>
      </v-card>

      <v-row class="mt-10 mb-5">
        <v-col cols="12">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <h2 class="distributionsub-panel-heading">How does this management portal work?</h2>
                <template v-slot:actions>
                  <v-icon color="#121D3B">
                    mdi-plus
                  </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <dl>
                  <dt class="mb-2">In here you can see all your orders and manage everything from the mini left nav</dt>
                  <dd class="ml-4"><strong>Orders:</strong> View all your orders and more</dd>
                  <dd class="ml-4"><strong>Offers:</strong> See pending offers, respond to offers, and easily negotiate prices and sales</dd>
                  <dd class="ml-4"><strong>Samples:</strong> List samples by packs or individual</dd>
                  <dd class="ml-4"><strong>Beats:</strong> List your beats for sale</dd>
                </dl>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <h2 class="distributionsub-panel-heading">How do I sign agreements?</h2>
                <template v-slot:actions>
                  <v-icon color="#121D3B">
                    mdi-plus
                  </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <dl>
                  <dd>
                    When you create your account, we automatically create the agreements for you based on the information when you select for each beat/sample/pack. When an artist makes a purchase our
                    system automatically fills out the information and processes the license agreement.
                  </dd>
                </dl>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <h2 class="distributionsub-panel-heading">How do I get paid?</h2>
                <template v-slot:actions>
                  <v-icon color="#121D3B">
                    mdi-plus
                  </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <dl>
                  <dd>
                    We collect all the money for you and when your payout is more then $20 you are able to easily request a payout through our payout system directly to your PayPal
                  </dd>
                </dl>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
    <beat-modal ref="beatModal" />
    <sample-modal ref="sampleModal" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PayoutModal from '@/components/PayoutModal'
import BeatModal from '@/components/SoundStore/Manager/BeatModal'
import SampleModal from '@/components/SoundStore/Manager/SampleModal'
import SoundStoreRegisterWidget from '@/components/SoundStore/SoundStoreRegisterWidget'
import Beats from '@/components/SoundStore/Manager/Beats'
import Samples from '@/components/SoundStore/Manager/Samples'
import Orders from '@/components/SoundStore/Manager/Orders'
import Vue from 'vue'
import Offers from '@/components/SoundStore/Manager/Offers'
import config from '@/config'

export default {
  components: {
    PayoutModal,
    SoundStoreRegisterWidget,
    Beats,
    Samples,
    Orders,
    Offers,
    BeatModal,
    SampleModal
  },
  metaInfo () {
    return {
      title: 'Sound Store',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content:
            'Artist Republik is a 360 degree platform offering artist submitted beats to support your sound! We offer mastering, distribution, playlisting, and more!'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'Sound Store | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'og:description',
          name: 'og:description',
          content:
            'Artist Republik is a 360 degree platform offering artist submitted beats to support your sound! We offer mastering, distribution, playlisting, and more!'
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
            'Sound Store | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Artist Republik is a 360 degree platform offering artist submitted beats to support your sound! We offer mastering, distribution, playlisting, and more!'
        }
      ]
    }
  },
  data: function () {
    return {
      mainUrl: config.MAIN_URL,
      status: '',
      offers: 0,
      orders: 0,
      payout_amount: 0,
      last_payout: '',
      loadingStats: false
    }
  },
  created: async function () {
    this.getSoundStats()
  },
  methods: {
    openPayoutModal () {
      this.$refs.payoutModal.openModal()
    },

    getSoundStats: async function () {
      this.loadingStats = true
      try {

        let { data: { data } } = await Vue.$http.get('v1/sound-store/stats')

        this.status = this.uppercase(data.status)
        this.offers = data.offers
        this.orders = data.orders
        this.payout_amount = data.payout_amount
        this.last_payout = data.last_payout
      } catch (err) {
        console.error(err)
        this.$sentry.captureException(err)
      }
      this.loadingStats = false
    },
    payoutSucceeded: function () {
      this.getSoundStats()
    }

  },
  computed: {
    ...mapGetters({
      is_account: 'getIsSoundUser',
      display_name: 'getSoundUserDisplayName'
    }),
    flat: function () {
      return !this.is_account
    },
    tab: {
      set: function (tab) {
        this.$router.replace({ query: { ...this.$route.query, tab } })
      },
      get: function () {
        return this.$route.query.tab
      }
    }
  }
}
</script>

<style scoped lang="scss">
ul {
  margin: 0;
  padding: 0;
  list-style-position: inside;
}
</style>
