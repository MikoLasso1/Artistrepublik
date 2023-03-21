<template>
  <div>
    <h3 style="text-align: center; padding-bottom: 25px">
      Orders Processed: {{ orderCount }}
    </h3>
    <v-row>
      <v-col md="6" cols="12" order-md="2">
        <h3 class="h3">Cart</h3>
        <div class="items mb-4">
          <div class="item" v-for="account in accounts" v-bind:key="account.id">
            <v-row>
              <v-col cols="4">
                <div class="text-center">
                  <img
                    :src="account.picture_url"
                    class="profile_img"
                    alt="account image"
                    loading="lazy"
                  />
                  <br />
                  <a
                    :href="`https://instagram.com${account.handle}`"
                  >@{{ account.handle }}</a
                  >
                </div>
              </v-col>
              <v-col cols="8" align-self="center">
                <ul class="mt-2">
                  <li v-for="(type, i) in account.types" v-bind:key="i">
                    <p class="body-1 mb-0">
                      {{ typeText[type] }} - ${{
                        getPriceForAccount(account, type)
                      }}
                    </p>
                    <a
                      class="text-primary text-right"
                      @click.prevent="removeItem(account, type)"
                    >Remove</a
                    >
                  </li>
                </ul>
              </v-col>
            </v-row>
          </div>
        </div>
        <h3 class="h3 text-right">
          Processing Fee: {{ processingFee | centsToDollar }}
        </h3>
        <h3 class="h3 text-right">Total: ${{ getTotalWithFee }}</h3>
      </v-col>
      <v-col md="6" cols="12" order-md="1">
        <payment
          :payment-url="paymentUrl"
          :payment-data="paymentData"
          @payment-success="onPaymentSuccess()"
          @toggle-loading="onToggleLoading"
          type="instagramplacement"
          :price="Math.ceil(getTotalWithFee)"
        />
      </v-col>
    </v-row>
    <div>
      <v-btn text color="primary" @click="$emit('back-step')">Back</v-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Payment from '@/components/Payment/Payment'

export default {
  components: {
    Payment
  },
  props: {
    placement: Object
  },
  data: function () {
    return {
      paymentUrl: `v1/instagram-placement/order`,
      typeText: {
        story: 'Story',
        feed: 'Feed',
        'story-swipe-up': 'Story Swipe Up',
        'feed-story': 'Feed + Story',
        'feed-story-swipe-up': 'Feed + Story with swipe up'
      },
      orderCount: '',
      processingFee: 65
    }
  },
  computed: {
    ...mapGetters({
      accounts: 'getIPOrderCart'
    }),
    paymentData: function () {
      let orderAccounts = {}
      for (let id in this.accounts) {
        orderAccounts[id] = [...this.accounts[id].types]
      }
      return {
        instagram_placement_id: this.placement.id,
        accounts: orderAccounts
      }
    },
    total: function () {
      let total = 0
      for (let id in this.accounts) {
        this.accounts[id].types.forEach((v) => {
          total += parseFloat(this.getPriceForAccount(this.accounts[id], v))
        })
      }
      return total
    },
    getTotalWithFee: function () {
      return this.total + this.processingFee / 100
    }
  },
  methods: {
    ...mapMutations(['removeIPOptionFromCart']),
    getPriceForAccount: function (account, type) {
      switch (type) {
        case 'story':
          return account.story_price_with_fee
        case 'feed':
          return account.feed_price_with_fee
        case 'story-swipe-up':
          return account.story_swipe_up_price_with_fee
        case 'feed-story':
          return account.feed_story_price_with_fee
        case 'feed-story-swipe-up':
          return account.feed_story_swipe_up_price_with_fee
      }
      return ''
    },
    removeItem: function (account, type) {
      this.removeIPOptionFromCart({ account, type })
    },
    onToggleLoading: function (toggle) {
      this.$emit('toggle-loading', toggle)
    },
    onPaymentSuccess () {
      this.$emit('next-step')
    }
  },
  created: async function () {
    this.processingFee = await this.getProcessingFee(this.total * 100)
    this.$store.dispatch('updateIntentStep', 'checkout')
    try {
      let res = await this.$store.dispatch(
        'getOrderStats',
        'instagram-placement'
      )
      this.orderCount = res.data.order_count
    } catch (err) {
      console.error(err)
      this.throwError(err)
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  padding-top: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
}

.items {
  border-top: 1px solid rgba(0, 0, 0, 0.3);
  max-height: 500px;
  overflow-x: hidden;
  overflow-y: scroll;
}

.profile_img {
  width: 75px;
  margin-bottom: 4px;
}
</style>
