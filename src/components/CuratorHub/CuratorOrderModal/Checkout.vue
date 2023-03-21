<template>
  <div>
    <h3 style="text-align: center; padding-bottom: 25px">
      Orders Processed: {{ orderCount }}
    </h3>
    <div v-if="paymentSuccess">
      <div class="card">
        <div class="card-body text-center">
          <div>
            <v-icon aria-hidden="true"> mdi-check-circle-outline</v-icon>
          </div>
          <h3>Awesome!</h3>
          <p class="card-text">
            Your song has been sent to the playlist owners for review. Stay
            tuned to your email for updates!
          </p>
          <p>
            Please allow 1 - 4 business days for your selected Curator to review
            each of your submissions to their playlists. If your submission is
            approved, the Curator may take up to 7 days to add your submission
            to their playlist.
          </p>
        </div>

        <Feedback :from="'playlisting'" />
      </div>
    </div>
    <v-container fluid v-else>
      <v-row>
        <v-col cols="12" md="6">
          <coupon-code
            service="playlist-republik"
            :productType="productType"
            @set-coupon="setCoupon"
          />
          <payment
            class="payment-wrap"
            type="curatorcheckout"
            service="playlist-republik"
            :price="Math.ceil(total / 100)"
            :payment-url="paymentUrl"
            :payment-data="paymentData"
            @payment-success="onPaymentSuccess"
            :show-payment-methods="total > 0"
            :payment-method-url="paymentUrl"
            payment-update-url="v1/service/playlist-republik/payment"
          />
        </v-col>
        <v-col cols="12" md="6">
          <playlist
            v-for="playlist in playlists"
            :key="playlist.id"
            :playlist="playlist"
            :view-only="true"
          />
          <div v-if="total" class="row flex-column total-price-parent">
            <div class="col" v-if="couponData.id">
              <p class="text-right total-price p-2 m-0">
                Sub Total Price: {{ subTotal | centsToDollar }}
              </p>
              <p class="text-right total-price p-2 m-0">
                Discount: -{{ couponData.price | centsToDollar }}
              </p>
            </div>
            <div class="col">
              <p class="text-right total-price p-2 m-0">
                Processing Fee: {{ processingFee | centsToDollar }}
              </p>
              <p class="text-right total-price p-2 m-0">
                Total Price: {{ total | centsToDollar }}
              </p>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn dark v-if="!paymentSuccess" color="primary" @click="doBack">
            Back
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
//TODO show track information
import { mapGetters, mapMutations } from 'vuex'
import Vue from 'vue'
import Playlist from '@/components/CuratorHub/CuratorOrderModal/Playlist'
import Payment from '@/components/Payment/Payment'
import Feedback from '@/components/Feedback'
import CouponCode from '@/components/CouponCode'

export default {
  components: {
    Playlist,
    Payment,
    Feedback,
    CouponCode
  },
  props: {
    track: Object
  },
  data: function () {
    return {
      paymentUrl: 'v1/service/playlist-republik/curator/order',
      paymentSuccess: false,
      couponData: {},
      orderCount: '',
      processingFee: 65
    }
  },
  computed: {
    ...mapGetters({
      playlists: 'getCuratorOrderCart',
      user: 'getUser'
    }),
    subTotal: function () {
      return this.playlists.reduce((accum, val) => {
        accum += val.price
        return accum
      }, 0)
    },
    total: function () {
      if (this.couponData.id)
        return this.subTotal - this.couponData.price + this.processingFee
      else return this.subTotal + this.processingFee
    },
    paymentData: function () {
      let playlistIds = this.playlists.reduce((accum, val) => {
        accum.push(val.id)
        return accum
      }, [])
      return {
        user_track_uuid: this.track.uuid,
        playlists: playlistIds,
        email: this.user.email,
        coupon_id: this.couponData.id ? this.couponData.id : ''
      }
    },
    productType: function () {
      let playlistIds = this.playlists.reduce((accum, val) => {
        accum.push(val.id)
        return accum
      }, [])
      return {
        product_type: 'curator',
        playlist_ids: playlistIds
      }
    }
  },
  methods: {
    doBack: function () {
      this.$emit('back-step')
    },
    ...mapMutations(['setPurchasedPlaylistIds']),
    onPaymentSuccess: function () {
      //TODO clear curator order cart and display
      let playlistIds = this.playlists.reduce((accum, val) => {
        accum.push(val.id)
        return accum
      }, [])
      this.setPurchasedPlaylistIds(playlistIds)
      this.$store.dispatch('clearCruratorCart')

      this.paymentSuccess = true
      this.$emit('payment-success')
    },
    formatPrice (value) {
      let val = (value / 1).toFixed(2).replace('.', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    setCoupon: function (data) {
      this.couponData = data
    }
  },
  created: async function () {
    this.$store.dispatch('updateIntentStep', 'checkout')
    this.processingFee = await this.getProcessingFee(this.subTotal)
    try {
      let res = await Vue.$http.get(`v1/service/playlist-republik/order/stats`)
      this.orderCount = res.data.order_count
    } catch (err) {
      console.error(err)
      this.$sentry.captureException(err)
    }
  }
}
</script>

<style lang="scss" scoped>
.checkout-wrap {
  display: flex;
  justify-content: space-between;

  .payment-wrap {
    width: 50%;
    margin-right: 15px;
  }

  .playlists-wrap {
    flex-grow: 1;
  }
}

.fa-6 {
  font-size: 5em;
}

.total-price {
  font-weight: bold;
}

.total-price-parent {
  background-color: #f8f9fe;
  margin-bottom: 10px;
}
</style>
