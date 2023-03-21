<template>
  <v-dialog v-model="dialog" max-width="600" class="ordermodal">
    <LoadingOverlay :loading="loading" />
    <v-card>
      <v-card-title class="headline px-6">
        <h2>Checkout</h2>
      </v-card-title>
      <v-row class="px-6 pb-4 col-12 mx-0 my-3">
        <review-order-checkout
          :reviewer="reviewer"
          :uuid="uuid"
          @upload="upload"
          @finished="finish"
        />
      </v-row>
      <v-card-actions class="btn-row">
        <v-btn v-if="!paymentFinish" color="#172b4d" dark @click="cancel">Cancel</v-btn>
        <v-btn v-else color="#172b4d" dark @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ReviewOrderCheckout from '@/components/EliteReviews/ReviewOrderModal/ReviewOrderCheckout'
import LoadingOverlay from '@/components/LoadingOverlay'

import {
  serialize
} from 'object-to-formdata'

import Vue from 'vue'
import config from '@/config'

export default {
  components: {
    ReviewOrderCheckout,
    LoadingOverlay
  },
  props: {
    reviewer: {
      type: [Object],
      description: 'The reviewer'
    }
  },
  data: function () {
    return {
      uuid: null,
      loading: false,
      dialog: false,
      agreed: false,
      canGoForward: false,
      paymentFinish: false
    }
  },
  mounted () {
    this.uuid = this.generateUUID()
  },
  methods: {
    upload: async function ({ file, customer }) {
      if (file) {
        const formData = serialize({
          file,
          uuid: this.uuid,
          customer
        })
        try {
          await Vue.$http({
            method: 'POST',
            url: config.REVIEW_REPUBLIK_API_URL + '/api/v1/files/review',
            data: formData,
            headers: {
              'content-type': 'multipart/form-data'
            }
          })
        } catch (err) {
          console.log(err)
        }
      }
    },
    generateUUID: function () {
      let d = new Date().getTime() // Timestamp
      let d2 = (performance && performance.now && (performance.now() * 1000)) || 0// Time in microseconds since page-load or 0 if unsupported
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 //random number between 0 and 16
        if (d > 0) {
          // Use timestamp until depleted
          r = (d + r) % 16 | 0
          d = Math.floor(d / 16)
        } else {
          //Use microseconds since page-load if supported
          r = (d2 + r) % 16 | 0
          d2 = Math.floor(d2 / 16)
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
      })
    },
    open: function () {
      this.dialog = true
    },
    cancel: function () {
      this.dialog = false
      this.$emit('close')
      // this.$store.dispatch('fetchSettings');
    },
    finish: function () {
      this.$noty.success('Order Successful')
      this.paymentFinish = true
    },
    close: async function () {
      this.uuid = this.generateUUID()
      this.$emit('success')
      this.cancel()
    }
  }
}
</script>
<style>
.v-dialog.v-dialog--active {
  overflow-y: auto;
}

.v-dialog.v-dialog--active::-webkit-scrollbar {
  width: 11px;
  scrollbar-width: thin;
  scrollbar-color: rgb(30, 30, 30) #1E1E1E;
}

.v-dialog.v-dialog--activel::-webkit-scrollbar-track {
  background: #eae5eb;
}

.v-dialog.v-dialog--active::-webkit-scrollbar-thumb {
  background-color: #d3d3d3;
  border-radius: 6px;
  border: 3px solid #d3d3d3;
}

.hidden {
  visibility: hidden;
}
</style>
