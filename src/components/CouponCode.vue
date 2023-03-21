<template>
  <div class="coupon-container d-flex justify-center flex-column">
    <v-text-field
      label="Coupon Code"
      v-model="couponCode"
    ></v-text-field>
    <v-btn
      color="success"
      :loading="couponChecking"
      :disabled="!couponCode"
      @click="verifyCoupon"
    >
      Verify
    </v-btn>
    <p v-if="couponStatus.message" class="coupon-status" :class="[ couponStatus.status ? 'success' : 'error']">{{ couponStatus.message }}</p>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  props: ['productType', 'service'],
  data: function () {
    return {
      couponCode: '',
      couponChecking: false,
      couponStatus: {
        status: false,
        message: ''
      },
      couponData: {}
    }
  },
  watch: {
    couponCode: function () {
      this.couponStatus.message = ''
    }
  },
  methods: {
    verifyCoupon: async function () {
      this.couponChecking = true
      this.couponStatus = {
        status: false,
        message: ''
      }
      this.couponData = {}

      let param = ''
      Object.keys(this.productType).forEach(key => {
        param += '&'
        param += key + '='
        param += this.productType[key]
      })

      let url = this.service ? `v1/service/${this.service}/coupon/verify` : `v1/coupon-code/verify`
      url += '?code=' + this.couponCode + param
      await Vue.$http.get(url).then((response) => {
        this.couponChecking = false
        this.couponStatus = {
          status: true,
          message: 'Coupon Code is available'
        }
        this.couponData = response.data.data
      }).catch((error) => {
        this.couponChecking = false
        let message = this.service ? error.response.data.data.message : error.response.data
        this.couponStatus = {
          status: false,
          message: message
        }
      })

      this.$emit('set-coupon', this.couponData)
    }
  }
}
</script>

<style lang="scss">
.coupon-container {
  position: relative;
  max-width: 350px;
  margin: 0 auto;

  .v-input {
    input {
      padding-right: 100px !important;
    }

    .v-text-field__details {
      display: none;
    }
  }

  button {
    position: absolute;
    right: 0;
    top: 10px;
    height: 30px !important;
  }

  .coupon-status {
    font-size: 14px;
    text-align: center;

    &.success {
      background-color: transparent !important;
      border-color: transparent !important;
      color: #4caf50 !important;
    }

    &.error {
      background-color: transparent !important;
      border-color: transparent !important;
      color: #ff5252 !important;
    }
  }
}
</style>
