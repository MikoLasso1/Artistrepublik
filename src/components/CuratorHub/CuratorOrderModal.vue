<template>
  <div>
    <v-dialog
      id="curator-order-modal"
      v-model="curatorDialog"
      max-width="1000"
    >
      <v-card>
        <v-card-title>
          <h2 v-if="step === 1" class="h2 mb-0">Terms and Conditions</h2>
          <h2 v-if="step === 2" class="h2 mb-0">Song Information</h2>
          <h2 v-if="step === 3" class="h2 mb-0">Select Playlists</h2>
          <h2 v-if="step === 4 || step === 6" class="h2 mb-0">Checkout</h2>
          <h2 v-if="step === 5" class="h2 mb-0"></h2>
          <v-spacer />
          <v-btn text @click="onHideCuratorModal">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-subtitle>
          Curator
        </v-card-subtitle>
        <v-card-text refs="curatorOrderSection">
          <features-terms-and-conditions v-if="step === 1" @next-step="onNextStep" />
          <song-information
            v-if="step === 2"
            :track="track"
            @next-step="onNextStep"
            @track-info="onTrackInfoSave"
            @back-step="onBackStep"
          />
          <select-playlists v-if="step === 3" :track="track" @next-step="onNextStep" @back-step="onBackStep" :cart-key="trackCartKey" />
          <curator-order-upsell v-if="step === 4" :track="track" @next-step="onNextStep" :cart-key="trackCartKey" @back-step="onBackStep" />
          <checkout v-if="step === 5" @payment-success="paymentSuccess" :track="track" @back-step="onBackStep" />
          <OrderSuccess v-if="step === 6" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Vue from 'vue'
import FeaturesTermsAndConditions from '@/components/CuratorHub/CuratorOrderModal/FeaturesTermsAndConditions'
import SongInformation from '@/components/CuratorHub/CuratorOrderModal/SongInformation'
import SelectPlaylists from '@/components/CuratorHub/CuratorOrderModal/SelectPlaylists'
import Checkout from '@/components/CuratorHub/CuratorOrderModal/Checkout'
import CuratorOrderUpsell from '@/components/CuratorHub/CuratorOrderModal/CuratorOrderUpsell'
import OrderSuccess from '@/components/CuratorHub/CuratorOrderModal/OrderSuccess'

export default {
  components: {
    FeaturesTermsAndConditions,
    SongInformation,
    SelectPlaylists,
    Checkout,
    CuratorOrderUpsell,
    OrderSuccess,
  },
  props: {
    cartKey: String,
  },
  data: function () {
    return {
      step: 1,
      track: null,
      trackCartKey: null,
      curatorDialog: false,
      successMessage: false,
    }
  },
  computed: {},
  created: function () {
    if (!this.cartKey) {
      Vue.$http
        .get('v1/service/playlist-republik/curator/order/has-ordered')
        .then(response => {
          if (response.data.data.has_ordered) {
            this.step = 2
          }
        })
        .catch(err => this.$sentry.captureException(err))

      this.$store.dispatch('clearCruratorCart')
    }
  },
  methods: {
    paymentSuccess: function () {
      this.step++
      this.$store.dispatch('clearCruratorCart')
      this.track = null
    },
    onNextStep: function () {
      this.step++
    },
    onBackStep: function () {
      this.step--
    },
    onTrackInfoSave: function (track) {
      this.track = track
      if (track.key !== undefined && track.key !== '') {
        this.trackCartKey = track.key
      }
    },
    openCuratorModal () {
      this.curatorDialog = true
    },
    onHideCuratorModal () {
      this.$store.dispatch('clearCruratorCart')
      this.$store.commit('setIntent', null)
      this.track = null
      this.curatorDialog = false
    },
  },
  mounted: async function () {
    if (this.cartKey) {
      try {
        let { data: { data } } = await Vue.$http.get(`v1/cart/${this.cartKey}`)
        this.track = data.cartable
        if (data.items.length > 0) {
          data.items.forEach(v => {
            this.$store.commit('addPlaylistToCart', v.item)
          })
          this.step = 4
        } else {
          this.step = 2
        }
      } catch (err) {
        this.throwError(err)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.card {
  border: none;
}

.card-body {
  min-height: 501px;
}
</style>
<style>
.v-dialog.v-dialog--active {
  overflow-y: auto;
}

.v-dialog.v-dialog--active::-webkit-scrollbar {
  width: 11px;
  scrollbar-width: thin;
  scrollbar-color: rgb(220, 209, 223) #eae5eb;
}

.v-dialog.v-dialog--activel::-webkit-scrollbar-track {
  background: #eae5eb;
}

.v-dialog.v-dialog--active::-webkit-scrollbar-thumb {
  background-color: rgb(220, 209, 223);
  border-radius: 6px;
  border: 3px solid rgb(220, 209, 223);
}
</style>
