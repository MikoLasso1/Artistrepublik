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
            Your order has been sent to the audio engineer for review. Stay
            tuned to your email for updates!
          </p>
        </div>

        <Feedback :from="'mastering'" />
      </div>
    </div>
    <div class="row col-12 m-0" v-else>
      <h2 class="order-heading">Order Checkout</h2>
      <div class="row col-12 py-5">
        <v-img
          contain
          class="white--text align-end"
          style="max-height: 200px"
          height="200px"
          :src="image"
          alt="order image"
          loading="lazy"
        />
      </div>
      <div class="row col-12">
        <div class="col-7">
          <p class="order-label">File:</p>
        </div>
        <div class="col-5">
          <h3 class="order-label">{{ file.name }}</h3>
        </div>
      </div>

      <div class="row col-12">
        <div class="col-7">
          <label>
            <h2 class="order-label">Requests</h2>
          </label>
        </div>
        <div class="col-5">
          <label>
            <h3 class="order-label">{{ order.requests }}</h3>
          </label>
        </div>
      </div>
      <div class="row col-12">
        <div class="col-7">
          <label>
            <h2 class="order-label">Service:</h2>
          </label>
        </div>
        <div class="col-5">
          <label>
            <h3 class="order-label h4">{{ service.title }}</h3>
            <h4 class="order-label h5">
              Category: {{ service.subtask.task.name }}
            </h4>
            <h5 class="order-label h6">
              By {{ service.catalog.engineer.user.name }}
            </h5>
          </label>
        </div>
      </div>
      <div class="row col-12">
        <div class="col-7">
          <label>
            <h2 class="order-label">Estimated Turnaround:</h2>
          </label>
        </div>
        <div class="col-5">
          <label>
            <h3 class="order-label">{{ turnaround }}</h3>
          </label>
        </div>
      </div>
      <div class="row col-12">
        <div class="col-7">
          <label>
            <h2 class="order-label">Subtotal:</h2>
          </label>
        </div>
        <div class="col-5">
          <label>
            <h3 class="order-label">{{ formattedPrice }}</h3>
          </label>
        </div>
      </div>
      <div class="row col-12">
        <div class="col-7">
          <label>
            <h2 class="order-label">Service Fee:</h2>
          </label>
        </div>
        <div class="col-5">
          <label>
            <h3 class="order-label">{{ formattedFee }}</h3>
          </label>
        </div>
      </div>
      <div class="row col-12">
        <div class="col-7">
          <label>
            <h2 class="order-label">Processing Fee:</h2>
          </label>
        </div>
        <div class="col-5">
          <label>
            <h3 class="order-label">{{ processingFee | centsToDollar }}</h3>
          </label>
        </div>
      </div>
      <div class="row col-12" v-if="couponData.id">
        <div class="col-7">
          <label>
            <h2 class="order-label">Discount:</h2>
          </label>
        </div>
        <div class="col-5">
          <label>
            <h3 class="order-label">-{{ formattedDiscount }}</h3>
          </label>
        </div>
      </div>
      <div class="row col-12">
        <div class="col-7">
          <label>
            <h2 class="order-label">Total:</h2>
          </label>
        </div>
        <div class="col-5">
          <label>
            <h3 class="order-label">{{ totalWithFee }}</h3>
          </label>
        </div>
      </div>
      <div class="row mb-2 col-12">
        <coupon-code
          :productType="productType"
          @set-coupon="setCoupon"
        ></coupon-code>
      </div>
      <div class="row mb-1 w-100">
        <h2 class="pt-y order-heading">Payment Information</h2>
        <div class="row col-12 mb-2 m-auto">
          <payment
            class="w-100"
            type="aeservicecheckout"
            :price="Math.ceil(total)"
            :payment-options="['stripe', 'paypal']"
            :payment-url="paymentUrl"
            :payment-data="paymentData"
            :payment-config="paymentConfig"
            @payment-success="onPaymentSuccess"
            @payment-error="onPaymentError"
          />
        </div>
        <div id="showError" class="col-xl-12">
          <div
            v-if="validation.orderError !== null"
            id="errorMsg"
            class="alert alert-warning"
            role="alert"
          >
            {{ validation.orderError }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { serialize } from 'object-to-formdata'
import Payment from '@/components/Payment/Payment'
import Feedback from '@/components/Feedback'
import CouponCode from '@/components/CouponCode'

export default {
  components: {
    Payment,
    Feedback,
    CouponCode
  },
  props: {
    order: Object,
    service: Object,
    customer: Object,
    file: File
  },
  data () {
    return {
      paymentUrl: 'v1/audio-engineering/order',
      paymentSuccess: false,
      validation: {
        orderError: null
      },
      couponData: {},
      orderCount: '',
      processingFee: 65
    }
  },
  computed: {
    total () {
      return this.service.price * 1.3
    },
    formattedFee: function () {
      return ((this.service.price * 0.3) / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      })
    },
    formattedDiscount: function () {
      if (this.couponData.id)
        return this.couponData.price.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        })
      else return ''
    },
    formattedTotal: function () {
      let total = (this.service.price * 1.3) / 100
      if (this.couponData.id) {
        total -= this.couponData.price
      }

      return total.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      })
    },
    totalWithFee: function () {
      let total = (this.service.price * 1.3) / 100
      if (this.couponData.id) {
        total -= this.couponData.price
      }
      return total + this.processingFee / 100
    },
    formattedPrice: function () {
      return (this.service.price / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      })
    },
    paymentData: function () {
      return serialize({
        ...{
          order: this.order,
          customer: this.customer,
          coupon_id: this.couponData.id ? this.couponData.id : ''
        },
        ...{
          _method: 'PUT'
        }
      })
    },
    paymentConfig: function () {
      return {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
    },
    image () {
      return this.service.catalog.url
        ? this.service.catalog.url
        : '/img/brand/logo_dark.png'
    },
    turnaround () {
      let d, h, m, s
      s = this.service.estimated_turnaround
      m = Math.floor(s / 60)
      s = s % 60
      h = Math.floor(m / 60)
      m = m % 60
      d = Math.floor(h / 24)
      h = h % 24
      return d + ' days'
    },
    productType: function () {
      return {
        product_type: 'audio-engineering-service',
        audio_engineer_service_id: this.service.id
      }
    }
  },
  created: async function () {
    this.processingFee = await this.getProcessingFee(this.total)
    let data = { service_id: this.service.id }
    try {
      await Vue.$http.post(`v1/audio-engineering/cart`, data)
    } catch (err) {
      this.throwError(err)
    }
    try {
      let res = await this.$store.dispatch('getOrderStats', 'audio-engineer')
      this.orderCount = res.data.order_count
    } catch (err) {
      console.error(err)
      this.throwError(err)
    }
  },
  methods: {
    onPaymentSuccess: function () {
      this.paymentSuccess = true
      this.validation.orderError = null
      this.$emit('finished')
    },
    onPaymentError: function (error) {
      let err = error.message ? error.message : 'Something went wrong'
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors
        const firstFieldErrors = errors[Object.keys(errors)[0]]
        err = firstFieldErrors
          ? firstFieldErrors[0]
          : err.response.data.message
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.data
      ) {
        err = error.response.data.data.message
      }

      this.validation.orderError = err
    },
    setCoupon: function (data) {
      this.couponData = data
    }
  }
}
</script>

<style scoped>
.order-label,
.order-heading,
label {
  font-size: 0.8rem;
  color: #3d2151;
  text-transform: uppercase;
  font-family: "Montserrat-SemiBold", sans-serif;
  font-weight: 700;
}

.order-heading {
  text-align: center;
  width: 100%;
  font-size: 0.9rem;
}

.alert {
  margin-bottom: 0px;
}
</style>
