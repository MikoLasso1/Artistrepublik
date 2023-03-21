<template>
  <div>
    <base-header type="gradient-primary" class="bg-subscriptions"></base-header>
    <v-container>
      <v-row justify="center">
        <v-col lg="8" cols="12">
          <v-card>
            <v-card-title class="primary white--text">
              <span class="headline">Payment Methods</span>
            </v-card-title>
            <v-card-text class="pt-5">
              <h3 v-if="paymentMethods.length === 0 && processing === false" class="text-center">
                No Payment Methods available.
              </h3>
              <v-row v-else class="mb-2 card-parent" v-for="method in paymentMethods" :key="method.id">
                <v-col md="6">
                  <v-img
                    :src="`/img/card-brands/flat/${method.brand}.svg`"
                    max-height="50"
                    max-width="50"
                    class="d-inline-block mr-2"
                    alt="card brand"
                    loading="lazy"
                  ></v-img>
                  <label class="f-18 align-bottom">
                    <strong>x{{ method.last4 }}</strong> | EXP: <strong>{{ method.exp_month }}/{{ method.exp_year }}</strong></label>
                </v-col>
                <v-spacer></v-spacer>
                <v-col class="text-right">
                  <v-btn
                    color="primary"
                    outlined
                    tile
                    class="mb-2"
                    @click="removePaymentMethod(method.id)"
                    :disabled="deletingMethod"
                  >Delete
                  </v-btn>
                </v-col>
              </v-row>
              <VuetifyProgressDialog v-if="processing || deletingMethod" :message="processingMessage" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import VuetifyProgressDialog from '@/shared/components/VuetifyProgressDialog'
import Vue from 'vue'

export default {
  components: {
    VuetifyProgressDialog
  },
  data () {
    return {
      paymentMethods: [],
      processingMessage: '',
      processing: false,
      deletingMethod: false
    }
  },
  methods: {
    async getPaymentMethods () {
      this.processingMessage = 'Fetching Payment Methods ...'
      this.processing = true
      try {
        let response = await Vue.$http.get(`v1/user/payment/methods`)
        let paymentMethodsRes = response.data

        let uniqueCards = []
        let methods = []
        paymentMethodsRes.forEach(function (item) {
          if (!uniqueCards.includes(item.last4)) {
            methods.push(item)
            uniqueCards.push(item.last4)
          }
        })
        this.paymentMethods = methods
      } catch (err) {
        console.log(err)
        this.$noty.warning('Error Occurred while processing request.')
      }
      this.processing = false
    },
    async removePaymentMethod (method_id) {
      console.log('in removePaymentMethod')
      this.processingMessage = 'Deleting Payment Method ...'
      this.deletingMethod = true
      try {
        await Vue.$http.post(`v1/user/payment/methods/delete`, {
          method_id: method_id
        })
        this.$noty.success('Payment method deleted successfully.')
        this.getPaymentMethods()
      } catch (err) {
        console.log(err)
        this.$noty.warning('Error Occurred while processing request.')
      }
      this.deletingMethod = false
    }
  },
  mounted () {
    this.getPaymentMethods()
  }
}
</script>

<style scoped>
@media screen and (min-width: 960px) {
  .bg-subscriptions {
    padding-top: 4% !important;
  }

  .f-18 {
    font-size: 18px;
  }
}

.card-parent {
  border-bottom-style: dotted;
  border-bottom-width: thin;
}

.align-bottom {
  vertical-align: bottom;
}

</style>
