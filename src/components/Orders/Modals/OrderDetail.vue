<template>
  <div>
    <h3>Details</h3>
    <div class="row">
      <div class="col-sm-9">
        <p>
          <strong>Name:</strong>
          {{ order.cus_first_name }} {{ order.cus_last_name }}
          <br />
          <strong>Email:</strong>
          <a :href="`mailto:${order.cus_email}`">{{ order.cus_email }}</a>
          <br />
          <strong>Quantity:</strong>
          {{ (order.order_data && order.order_data.quantity) ? order.order_data.quantity : 1 }}
          <br />
          <strong>Order Date:</strong>
          {{ dateTimeFormat(order.created_at) }}
          <br />
          <strong>Seller:</strong>&nbsp;
          <router-link
            v-if="order.order_data && order.order_data.seller"
            :to="{path: `/${order.order_data.seller.username}`}"
          >{{ order.order_data.seller.first_name }} {{ order.order_data.seller.last_name }}
          </router-link>
          <span v-else>Artist Republik</span>
        </p>
      </div>
      <div class="col-sm-3 text-right">
        <p>
          <strong>Total:</strong>
          ${{ Number(order.price).toFixed(2) }}
          <br />
          <strong>Status:</strong>
          <status-change-select
            v-if="order.is_seller"
            class="status-select"
            :selected-value="order.status"
            :order-uuid="order.uuid"
          />
          <span v-else>&nbsp;{{ uppercase(order.status) }}</span>
        </p>
        <create-chat v-if="chatUsers" :participants="chatUsers" :subject="chatSubject" />
        <br />
        <v-btn
          v-if="order.status !== 'refunded' && order.is_seller"
          color="primary"
          @click.prevent="doRefund(order.payment.key)"
        >Refund
        </v-btn>
      </div>
      <v-row v-if="order.subscription_plan">
        <v-col class="text-right">
          <div v-if="!order.subscription_plan.is_subscription_cancelled">
            <v-btn v-if="processing">
              Processing
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-btn>
            <v-btn
              v-else-if="order.subscription_plan.plan_type && subscriptionCancelled === false"
              @click="cancelSubscription(order.subscription_plan.id)"
            >Cancel Subscription
            </v-btn>
          </div>
          <v-btn v-else>Subscription Cancelled</v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
import StatusChangeSelect from '@/components/Orders/StatusChangeSelect'
import CreateChat from '@/components/Mixins/Messaging/CreateChat'

export default {
  components: {
    StatusChangeSelect,
    CreateChat
  },
  data () {
    return {
      subscriptionCancelled: false,
      processing: false
    }
  },
  props: {
    order: Object
  },
  computed: {
    chatUsers: function () {
      if (!this.order.seller_user_id || !this.order.buyer_user_id) {
        return false
      }
      return [this.order.seller_user_id, this.order.buyer_user_id]
    },
    chatSubject: function () {
      return `Order Id: ${this.order.id}`
    }
  },
  methods: {
    dateTimeFormat: function (dateTime) {
      return moment(dateTime).format('MM-DD-YYYY hh:mm A')
    },
    doRefund: async function (paymentKey) {
      if (confirm('Are you sure you want to refund this?')) {
        try {
          await Vue.$http.get(`v1/payment/${paymentKey}/refund`)
          //TODO show that it has been refuded
        } catch (err) {
          console.error(err)
          this.$sentry.captureException(err)
        }
      }
    },
    cancelSubscription: async function (id) {
      if (confirm('Are you sure you want to cancel?')) {
        this.processing = true
        try {
          let res = await Vue.$http.get(`v1/payment/cancel-subscription`, {
            params: {
              subscription_plan_id: id
            }
          })

          if (res.status === 200) {
            this.subscriptionCancelled = true
            this.$noty.success('Subscription cancelled successfully')
          }
          this.processing = false
        } catch (err) {
          this.processing = true
          this.$noty.warning('Error Occurred while processing request.')
          this.$sentry.captureException(err)
        }
      }
    }
  }
}
</script>

<style>
</style>
