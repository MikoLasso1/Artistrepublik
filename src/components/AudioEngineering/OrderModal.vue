<template>
  <v-dialog v-model="dialog" max-width="600">
    <loading-overlay :loading="loading" />
    <v-card>
      <v-card-title class="headline">Place your order!</v-card-title>
      <v-col cols="12" class="px-6 pb-4">
        <order-terms v-if="step === 1" @updated-terms="setTerms" @proceed="proceed" />
        <order-details v-else-if="step === 2" ref="details" @upload="upload" @updated-details="setDetails" @proceed="proceed" @prevent="prevent" />
        <order-customer v-else-if="step === 3" @updated-customer="setCustomer" @proceed="proceed" @prevent="prevent" />
        <order-checkout v-else-if="step === 4" :file="file" :customer="customer" :service="service" :order="order" @finished="finish" />
      </v-col>
      <v-card-actions class="btn-row">
        <v-btn v-show="step === 1" class="cancel-btn" @click="close">Cancel</v-btn>
        <v-btn v-show="step > 1" class="back-btn" @click="back">Back</v-btn>
        <v-btn v-show="step !== 4" :disabled="!canGoForward" class="normal-btn" @click="next">Next</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'
import {
  serialize
} from 'object-to-formdata'
import OrderTerms from '@/components/AudioEngineering/OrderModal/OrderTerms'
import OrderDetails from '@/components/AudioEngineering/OrderModal/OrderDetails'
import OrderCustomer from '@/components/AudioEngineering/OrderModal/OrderCustomer'
import OrderCheckout from '@/components/AudioEngineering/OrderModal/OrderCheckout'
import LoadingOverlay from '@/components/LoadingOverlay'

const dataDefault = {
  step: 1,
  loading: false,
  dialog: false,
  agreed: false,
  canGoForward: false,
  file: null,
  customer: {
    address1: null,
    address2: null,
    city: null,
    country: null,
    name: null,
    postal: null,
    state: null
  },
  order: {
    id: null,
    agreed: false,
    uuid: null,
    estimated_length: null,
    estimated_final_length: null,
    notes: null,
    requests: null,
    service_id: null
  }
}

export default {
  components: {
    OrderTerms,
    OrderDetails,
    OrderCustomer,
    OrderCheckout,
    LoadingOverlay
  },
  props: {
    service: {
      type: [Object],
      description: 'The service to order'
    }
  },
  data: function () {
    return {
      step: 1,
      loading: false,
      dialog: false,
      agreed: false,
      canGoForward: false,
      file: null,
      customer: {
        address1: null,
        address2: null,
        city: null,
        country: null,
        name: null,
        postal: null,
        state: null
      },
      order: {
        id: null,
        agreed: false,
        uuid: null,
        estimated_length: null,
        estimated_final_length: null,
        notes: null,
        requests: null,
        service_id: null
      }
    }
  },
  mounted () {
    this.order.uuid = this.generateUUID()
  },
  methods: {
    next: function () {
      const previousStep = this.step
      this.canGoForward = false
      this.step++

      this.$store.dispatch('recordVisit', {
        route: this.$route.name, params: {
          action: 'next',
          previous_step: previousStep,
          currrent_step: this.step
        }
      })
    },
    back: function () {
      const previousStep = this.step
      this.canGoForward = false
      this.step--
      this.$store.dispatch('recordVisit', {
        route: this.$route.name, params: {
          action: 'back',
          previous_step: previousStep,
          currrent_step: this.step
        }
      })
    },
    cancel: function () {
      const previousStep = this.step
      this.step = 0
      this.$store.dispatch('recordVisit', {
        route: this.$route.name, params: {
          action: 'close',
          previous_step: previousStep,
          currrent_step: this.step
        }
      })
      this.$emit('close')
    },
    proceed: function () {
      this.canGoForward = true
    },
    prevent: function () {
      this.canGoForward = false
    },
    upload: async function (file) {
      this.order.uuid = this.generateUUID()
      this.file = file
      if (file) {
        const formData = serialize({
          file,
          uuid: this.order.uuid,
          _method: 'PUT'
        })
        this.$refs.details.isUploading()
        await Vue.$http({
          method: 'POST',
          url: 'v1/audio-engineering/order/file/upload',
          data: formData,
          headers: {
            'content-type': 'multipart/form-data'
          }
        })
        this.$refs.details.isDoneUploading()
      }
    },
    generateUUID: function () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)) + Date.now()
    },
    setTerms: function () {
      this.$store.dispatch('recordVisit', {
        route: this.$route.name, params: {
          action: 'terms_agreed'
        }
      })
      this.order.agreed = true
    },
    setDetails: function (details) {
      this.$store.dispatch('recordVisit', {
        route: this.$route.name, params: {
          action: 'details_completed'
        }
      })
      this.order.estimated_length = this.toSeconds(details.estimated_length)
      this.order.estimated_final_length = this.toSeconds(details.estimated_final_length)
      this.order.requests = details.requests
      this.order.notes = details.notes
      this.order.service_id = this.service.id
    },
    setCustomer: function (customer) {
      this.$store.dispatch('recordVisit', {
        route: this.$route.name, params: {
          action: 'customer_info_filled'
        }
      })
      this.customer = customer
    },
    toSeconds (time) {
      const a = time.split(':')
      return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])
    },
    open: function () {
      this.$store.dispatch('recordVisit', {
        route: this.$route.name, params: {
          action: 'opened_modal',
          step: 0
        }
      })
      this.dialog = true
    },
    finish: async function () {
      this.$store.dispatch('recordVisit', {
        route: this.$route.name, params: {
          action: 'order_completed'
        }
      })
      this.$noty.success('Order Successful')
      this.$emit('success')
      this.reset()
      this.close()
    },
    reset () {
      Object.keys(dataDefault).forEach(k => {
        if (Object.prototype.hasOwnProperty.call(this.$data, k)) {
          this.$data[k] = dataDefault[k]
        }
      })
    },
    close: function () {
      this.step = 1
      this.dialog = false
      this.$emit('close')
      this.$store.dispatch('fetchSettings')
    }
  }
}
</script>

<style>
.headline {
  justify-content: center;
}

.btn-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.normal-btn {
  color: white !important;
  background-color: #5e72e4 !important;
  font-family: 'Open Sans';
  text-transform: none;
  letter-spacing: normal;
  font-weight: 600;
}

.back-btn {
  color: #fff !important;
  background-color: #172b4d !important;
  border-color: #172b4d !important;
  font-family: 'Open Sans';
  text-transform: none;
  letter-spacing: normal;
  font-weight: 600;
}

.cancel-btn {
  color: #fff !important;
  background-color: #172b4d !important;
  border-color: #172b4d !important;
  font-family: 'Open Sans';
  text-transform: none;
  letter-spacing: normal;
  font-weight: 600;
}
</style>
