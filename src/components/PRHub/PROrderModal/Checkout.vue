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
            Your blog post has been sent to the outlet managers. Stay tuned to
            your email for updates!
          </p>
        </div>

        <Feedback :from="'blog promo'" />
      </div>
    </div>
    <div v-else>
      <div class="row">
        <div class="col-md-6">
          <payment
            class="payment-wrap"
            :payment-url="paymentUrl"
            :payment-data="paymentData"
            v-on:payment-success="onPaymentSuccess"
            type="pressreleasecheckout"
            :price="Math.ceil(total)"
          >
          </payment>
        </div>
        <div class="col-md-6">
          <div class="option" v-for="option in options" v-bind:key="option.id">
            <div class="col-4">
              <img
                :src="option.outlet.img_url"
                class=""
                alt="outlet image"
                loading="lazy"
              />
            </div>
            <div class="pr-info text-right col-8">
              <p class="text-break">
                <span>Outlet Name:</span> {{ option.outlet.name }}
              </p>
              <p><span>Option:</span> {{ option.type }}</p>
              <p><span>Price:</span> ${{ formatPrice(option.price_fee) }}</p>
            </div>
          </div>
          <div class="row total-price-parent" v-if="total">
            <div class="col col-12">
              <p class="text-right total-price p-2 m-0">
                Processing Fee: {{ processingFee | centsToDollar }}
              </p>
            </div>
            <div class="col">
              <p class="text-right total-price p-2 m-0">
                Total Price: ${{ formatPrice(totalWithfee) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-btn
      dark color="primary" @click="doBack" v-if="!paymentSuccess"
    >Back
    </v-btn
    >
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Payment from '@/components/Payment/Payment'
import Feedback from '@/components/Feedback'

export default {
  props: {
    pressRelease: Object
  },
  components: {
    Payment,
    Feedback
  },
  data: function () {
    return {
      paymentUrl: 'v1/press-release/order',
      paymentSuccess: false,
      orderCount: '',
      processingFee: 65
    }
  },
  computed: {
    ...mapGetters({
      options: 'getPROrderCart'
    }),
    total: function () {
      return this.options.reduce((accum, val) => {
        accum += val.price_fee
        return accum
      }, 0)
    },
    totalWithfee: function () {
      return this.total + this.processingFee / 100
    },
    paymentData: function () {
      let optionIds = this.options.reduce((accum, val) => {
        accum.push(val.id)
        return accum
      }, [])
      return {
        press_release_id: this.pressRelease.id,
        press_release_outlet_option_ids: optionIds
      }
    }
  },
  methods: {
    doBack: function () {
      this.$emit('back-step')
    },
    onPaymentSuccess: function () {
      this.$store.dispatch('clearPROrderCart')
      this.paymentSuccess = true
    },
    formatPrice: function (value) {
      let val = (value / 1).toFixed(2).replace('.', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }
  },
  created: async function () {
    this.processingFee = await this.getProcessingFee(this.total * 100)
    this.$store.dispatch('updateIntentStep', 'checkout')
    try {
      let res = await this.$store.dispatch('getOrderStats', 'press-release')
      this.orderCount = res.data.order_count
    } catch (err) {
      console.error(err)
      this.throwError(err)
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
}

.option {
  display: flex;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #8898aa;

  img {
    width: 50px;
    margin: 0 15px;
  }

  .pr-info {
    p,
    a {
      > span {
        color: #8898aa;
      }

      margin-bottom: 0;
      font-size: 12px;
    }
  }
}
</style>
