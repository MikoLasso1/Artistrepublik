<template>
  <v-card flat class="text-center" style="width: 100%">
    <v-card-text v-if="!paymentSuccess">
      <v-alert v-if="error" color="red">{{ error }}</v-alert>
      <v-form class="mt-4" v-model="valid" ref="form">
        <v-row align="center">
          <v-col cols="12">
            <v-row>
              <v-col cols="12">
                <h2>Customer Info</h2>
              </v-col>
              <v-col cols="12" md="6" class="d-flex">
                <v-text-field
                  flat
                  solo-inverted
                  class="mx-0"
                  :rules="rules.name"
                  v-model="customer.name"
                  label="Name"
                />
              </v-col>
              <v-col cols="12" md="6" class="d-flex">
                <v-text-field
                  flat
                  solo-inverted
                  class="mx-0"
                  :rules="rules.email"
                  v-model="customer.email"
                  label="Email"
                />
              </v-col>
            </v-row>
            <div v-show="show">
              <v-row>
                <v-col cols="12">
                  <h2>Song Info</h2>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                  class="d-flex"
                  style="justify-content: space-between; align-items: baseline"
                >
                  <v-select
                    clearable
                    outlined
                    v-model="order.type"
                    :rules="rules.service"
                    :items="types"
                    item-text="name"
                    item-value="code"
                    label="Order Type"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4" class="d-flex">
                  <v-select
                    clearable
                    outlined
                    v-model="order.genre"
                    :rules="rules.genre"
                    :items="genres"
                    item-text="name"
                    item-value="code"
                    label="Genre"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4" class="d-flex">
                  <v-checkbox
                    hint="Is this a publicly available?"
                    class="d-inline-block"
                    v-model="isPublic"
                    :rules="rules.public"
                    type="checkbox"
                    required
                  >
                    <template #label> Public Song</template>
                  </v-checkbox>
                </v-col>
                <v-col v-if="isPublic" cols="12" md="12" class="d-flex">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-select
                        clearable
                        outlined
                        style="padding: 0em"
                        v-model="link.source"
                        :rules="rules.source"
                        :items="sources"
                        hint="Select the public source for your link"
                        label="Source"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        clearable
                        flat
                        solo-inverted
                        class="mx-0"
                        :rules="rules.url"
                        v-model="link.url"
                        label="Public url"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col
                  v-else
                  cols="12"
                  md="12"
                  class="d-flex"
                  style="flex-direction: column"
                >
                  <v-row>
                    <v-col cols="12" md="5">
                      <v-radio-group
                        row
                        v-model="order.asset"
                        :rules="rules.asset"
                      >
                        <v-radio label="Url" value="URL"></v-radio>
                        <v-radio label="Upload" value="AUD"></v-radio>
                      </v-radio-group>
                    </v-col>
                    <v-col v-if="order.asset === 'URL'" cols="12" md="7">
                      <v-text-field
                        clearable
                        flat
                        solo-inverted
                        hide-details
                        class="mx-0"
                        :rules="rules.url"
                        hint="Soundcloud or other source"
                        v-model="link.url"
                        label="Private Url"
                      />
                    </v-col>
                    <v-col v-else cols="12" md="7">
                      <v-file-input
                        prepend-icon=""
                        :rules="rules.file"
                        v-model="file"
                        append-icon="mdi-paperclip"
                        @change="() => $emit('upload', { file, customer })"
                        hint="The file you want to have reviewed (zip .wav)"
                        color="deep-purple accent-4"
                        accept="audio/wav,application/zip"
                        counter
                        label="File input"
                        placeholder="Select your file"
                        filled
                        :show-size="1000"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-if="priceWithFee > 0" cols="12" md="12" class="d-flex">
                  <p style="font-size: large; font-weight: bold">
                    Processing Fee: {{ processingFee | centsToDollar }}
                  </p>
                </v-col>
                <v-col v-if="priceWithFee > 0" cols="12" md="12" class="d-flex">
                  <p style="font-size: large; font-weight: bold">
                    Total:
                    {{
                      (priceWithFee + priceWithFee * 0.3).toLocaleString(
                        'en-US',
                        {
                          style: 'currency',
                          currency: 'USD'
                        }
                      )
                    }}
                  </p>
                </v-col>
                <v-col cols="12" md="12" class="d-flex">
                  <v-checkbox
                    class="d-inline-block"
                    style="margin: 0px; padding: 0px"
                    v-model="agreeStatus"
                    type="checkbox"
                    required
                    :rules="rules.terms"
                  >
                    <div slot="label">
                      I agree with the
                      <a
                        :href="termConditionsUrl" target="_blank" @click.stop
                      >&nbsp;Terms and Conditions</a
                      >
                    </div>
                  </v-checkbox>
                </v-col>
                <v-col cols="12" md="12" class="d-flex">
                  <v-checkbox
                    class="d-inline-block"
                    hide-details
                    style="margin: 0px; padding: 0px"
                    v-model="order.waived"
                    type="checkbox"
                  >
                    <template #label>
                      I agree to have my review used in promotional material if
                      utilized
                    </template>
                  </v-checkbox>
                </v-col>
                <v-col
                  v-if="agreeStatus && valid"
                  cols="12"
                  md="6"
                  class="d-flex mb-2 m-auto"
                >
                  <payment
                    style="width: 100%"
                    :disabled="!agreeStatus"
                    :payment-options="['stripe', 'paypal']"
                    :payment-url="paymentUrl"
                    :payment-update-url="paymentUpdateUrl"
                    payment-update-method="POST"
                    :payment-data="paymentData"
                    :payment-config="paymentConfig"
                    @payment-success="onPaymentSuccess"
                    @payment-error="onPaymentError"
                    type="elitereviews"
                    :price="Math.ceil(price)"
                  />
                </v-col>
                <v-col
                  v-if="agreeStatus && valid"
                  cols="12"
                  md="6"
                  class="d-flex"
                >
                  <v-img
                    contain
                    class="white--text align-end"
                    style="max-height: 200px"
                    height="200px"
                    :src="image"
                    alt="reviewer image"
                    loading="lazy"
                  />
                </v-col>

                <v-col id="showError" cols="12" xl="12">
                  <v-alert
                    id="errorMsg"
                    v-if="validation.orderError !== null"
                    color="red"
                    dark
                  >
                    {{ validation.orderError }}
                  </v-alert>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-row v-else>
      <v-col cols="12" class="px-0">
        <p>Your order has been successful</p>
        <Feedback :from="'elite-reviews'" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import Payment from '@/components/Payment/Payment'
import Feedback from '@/components/Feedback'

import { mapGetters, mapActions } from 'vuex'

import { serialize } from 'object-to-formdata'

const _ = require('lodash')

import config from '@/config'

const dataDefault = {
  valid: false,
  error: null,
  isPublic: true,
  agreeStatus: false,
  paymentSuccess: false,
  validation: {
    orderError: null
  },
  link: {
    source: 'Spotify',
    url: null
  },
  file: null,
  customer: {
    platform: 'AR',
    name: null,
    email: null
  },
  order: {
    platform: 'AR',
    asset: 'URL',
    amount: null,
    reviewer: null,
    waived: false,
    agreed: false,
    uuid: null,
    genre: null,
    type: null
  }
}

export default {
  components: {
    Payment,
    Feedback
  },
  props: {
    reviewer: {
      type: [Object],
      description: 'The reviewer'
    },
    uuid: {
      type: String,
      description: 'The unique id for the order'
    }
  },
  data: function () {
    return {
      valid: false,
      error: null,
      isPublic: true,
      agreeStatus: false,
      termConditionsUrl:
        'https://arepublik-static.s3.amazonaws.com/documents/Elite+Reviews+T%26C.pdf',
      paymentUrl: config.REVIEW_REPUBLIK_API_URL + '/api/v1/reviews',
      paymentUpdateUrl: config.REVIEW_REPUBLIK_API_URL + '/api/v1/payment',
      paymentSuccess: false,
      rules: {
        name: [(v) => !!v || 'Your name is required'],
        email: [(v) => !!v || 'An email is required'],
        service: [(v) => !!v || 'Please choose the order type'],
        terms: [(v) => !!v || 'Terms must be agreed to.'],
        genre: [(v) => !!v || 'A genre needs to be specified'],
        public: [
          (v) =>
            v !== undefined || 'Specification of audio visibility is required'
        ],
        source: [(v) => !!v || 'You public source needs to be specified'],
        asset: [(v) => !!v || 'Specification of audio resource is required'],
        url: [(v) => !!v || 'A url is required'],
        file: [(v) => !!v || 'A file is required']
      },
      sources: ['Soundcloud', 'Custom'],
      validation: {
        orderError: null
      },
      link: {
        source: 'Soundcloud',
        url: null
      },
      file: null,
      customer: {
        name: null,
        email: null
      },
      order: {
        platform: 'AR',
        asset: 'URL',
        amount: null,
        reviewer: null,
        waived: false,
        agreed: false,
        uuid: null,
        genre: null,
        type: null
      },
      processingFee: 65
    }
  },
  computed: {
    ...mapGetters({
      genres: 'getReviewGenres'
    }),
    show: function () {
      return this.customer.name && this.customer.email
    },
    types: function () {
      if (
        !this.reviewer ||
        !this.reviewer.services ||
        this.reviewer.services.length < 1
      ) {
        return {}
      }

      return this.reviewer.services
        .filter(function (service) {
          return service.enabled && service.price > 0
        })
        .map(function (service) {
          return {
            name: service.name,
            code: service.type
          }
        })
    },
    price: function () {
      if (
        !this.reviewer ||
        !this.order.type ||
        !this.reviewer.services ||
        this.reviewer.services.length < 1
      ) {
        return 0
      }

      const currentPrice =
        _.filter(this.reviewer.services, (service) => {
          return service.enabled === true && this.order.type === service.type
        }).pop().price || 0

      this.order.amount = currentPrice
      return currentPrice
    },
    priceWithFee: function () {
      return this.price + this.processingFee / 100
    },
    paymentData: function () {
      this.order.uuid = this.uuid
      this.order.reviewer = this.reviewer.uuid
      return serialize({
        link: this.link,
        file: this.file,
        order: this.order,
        customer: this.customer
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
      return this.reviewer.img_url
        ? this.reviewer.img_url
        : '/img/brand/logo_dark.png'
    }
  },
  methods: {
    ...mapActions({
      fetchGenres: 'fetchReviewGenres'
    }),
    onPaymentSuccess: function () {
      this.paymentSuccess = true
      this.validation.orderError = null
      Object.keys(dataDefault).forEach((k) => {
        if (Object.prototype.hasOwnProperty.call(this.$data, k)) {
          if (dataDefault[k]) {
            this.$data[k] = dataDefault[k]
          }
        }
      })
      this.$refs.form.resetValidation()
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
    }
  },
  async created () {
    if (this.genres.length === 0) {
      this.fetchGenres()
    }
  },
  watch: {
    price: async function () {
      this.processingFee = await this.getProcessingFee(this.price * 100)
    },
    valid: {
      handler () {
        if (this.valid === false) {
          this.$emit('prevent')
        } else if (this.valid === true) {
          this.error = null
          this.$emit('updated-form')
          this.$emit('proceed')
        }
      }
    },
    agreeStatus: {
      handler () {
        if (this.agreeStatus && this.valid) {
          this.error = null
          this.$emit('proceed')
          this.$emit('updated-terms')
        } else {
          this.error = 'You must agree to the Terms and Conditions'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.icon {
  font-size: 100px;
  width: 100px;
  height: 100px;
}

ul {
  margin-top: 15px;
  text-align: center;
  list-style: none;
  margin-left: -5%;
}

.v-label {
  margin-bottom: 0px !important;
}

.my-span {
  background-color: blue;
  color: white;
  font-weight: bold;
  margin-right: 0;
}
</style>
