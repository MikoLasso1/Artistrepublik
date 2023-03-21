<template>
  <div>
    <v-base-header image="/img/sound-store/banner.png" />
    <navbar />
    <v-container fluid>
      <div v-if="loading" class="text-center mt-5">
        <v-progress-circular indeterminate color="primary" />
      </div>
      <v-row
        v-if="cartItemCount === 0 && paymentSuccess === false && !loading"
        justify="center"
      >
        <v-col md="6" class="text-center">
          <v-card class="mt-5 mb-5">
            <v-card-text>
              <div class="text-h4 text-center">Cart is empty</div>
              <p class="lead text-muted mt-1 mb-4 text-center">
                Please add some items first!
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-if="paymentSuccess === false && cartItemCount > 0">
        <v-col md="8" cols="12">
          <v-card>
            <v-card-title class="headline">Cart</v-card-title>
            <v-card-text>
              <h3 v-if="cart.beats.length > 0" class="h3">Beats</h3>
              <Beat
                v-for="beat in cart.beats"
                v-bind:key="beat.uuid"
                :beat="beat"
              />
              <h3 v-if="cart.samplePacks.length > 0" class="h3">
                Sample Packs
              </h3>
              <sample-pack
                v-for="samplePack in cart.samplePacks"
                v-bind:key="samplePack.uuid"
                :sample-pack="samplePack"
              />
              <h3 v-if="cart.samples.length > 0" class="h3">Samples</h3>
              <sample
                v-for="sample in cart.samples"
                v-bind:key="sample.uuid"
                :sample="sample"
              />
            </v-card-text>
          </v-card>
          <h3 style="text-align: center; padding-top: 25px">
            Orders Processed: {{ orderCount }}
          </h3>
        </v-col>
        <v-col md="4" cols="12">
          <v-card>
            <v-card-title class="headline">Checkout</v-card-title>
            <v-card-text>
              <v-form v-model="valid" ref="form">
                <v-text-field
                  v-model="form.first_name"
                  label="First Name"
                  :rules="firstNameRules"
                ></v-text-field>
                <v-text-field
                  v-model="form.last_name"
                  label="Last Name"
                  :rules="lastNameRules"
                ></v-text-field>
                <v-text-field
                  v-model="form.address"
                  label="Address"
                  ref="address"
                  autocomplete="new-password"
                  @focus="initAutocomplete()"
                  :rules="addressRules"
                ></v-text-field>
                <v-text-field
                  v-model="form.city"
                  label="City"
                  :rules="cityRules"
                ></v-text-field>
                <v-text-field
                  v-model="form.state"
                  label="State/Provence"
                  :rules="stateRules"
                ></v-text-field>
                <v-text-field
                  v-model="form.country"
                  label="Country"
                  :rules="countryRules"
                ></v-text-field>
                <v-text-field
                  v-model="form.zip"
                  label="Zip Code"
                  :rules="zipRules"
                ></v-text-field>
                <v-btn color="success" @click="validate"> Save</v-btn>
              </v-form>
              <v-card elevation="0" class="pt-2">
                <v-row justify="end">
                  <v-col md="6" class="text-right">
                    <ul class="mb-0 list-style-none">
                      <li>
                        <h3 class="font-weight-medium d-inline">
                          Processing Fee:
                          <label class="text--secondary">{{
                              processingFee | centsToDollar
                            }}</label>
                        </h3>
                        <h3 class="font-weight-medium d-inline">
                          Total:
                          <label class="text--secondary">{{
                              (totalWithFee * 100) | centsToDollar
                            }}</label>
                        </h3>
                      </li>
                    </ul>
                  </v-col>
                </v-row>
              </v-card>
              <payment
                payment-url="v1/sound-store/order"
                :disabled="!valid"
                :payment-data="paymentData"
                :can-pay="loggedIn"
                @payment-success="onPaymentSuccess"
                @payment-error="onPaymentError"
                @payment-attempted="$refs.registerModal.openModal()"
                type="soundstoreorder"
                :price="Math.ceil(paymentTotal)"
              />
              <v-alert color="red" type="warning" v-if="orderError !== null">{{
                  orderError
                }}
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-if="paymentSuccess" justify="center">
        <v-col md="8" sm="10">
          <v-card class="mt-5 mb-5">
            <v-card-text>
              <div class="text-h4 text-center pb-4">Purchase Complete</div>

              <div v-if="loadingOrder" class="text-center mt-5">
                <v-progress-circular indeterminate color="primary" />
              </div>
              <div v-else>
                <h3 v-if="orderedBeats.length > 0" class="h3 text-center">
                  Your Purchases
                </h3>
                <div v-for="beat in orderedBeats" :key="beat.uuid">
                  <BeatOrder :order="beat" :contract-button="false" />
                </div>
                <div
                  v-for="samplePack in orderedSamples"
                  :key="samplePack.uuid"
                >
                  <SamplePackOrder
                    :order="samplePack"
                    :contract-button="false"
                  />
                </div>
                <div class="text-center mt-2">
                  You can download these again and get more information from the
                  orders page.
                  <p class="text-center">
                    <v-btn
                      color="primary" :to="`/orders`" class="mt-2"
                    >Orders
                    </v-btn
                    >
                  </p>
                </div>
              </div>

              <Feedback :from="'sound store'" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <register-modal ref="registerModal" />
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Navbar from '@/components/SoundStore/Navbar'
import Beat from '@/components/SoundStore/Cart/Beat'
import SamplePack from '@/components/SoundStore/Cart/SamplePack'
import Sample from '@/components/SoundStore/Cart/Sample'
import Payment from '@/components/Payment/Payment'
import RegisterModal from '@/components/Public/RegisterModal'
import BeatOrder from '@/components/Orders/Modals/SoundStore/Beat'
import SamplePackOrder from '@/components/Orders/Modals/SoundStore/SamplePack'
import Feedback from '@/components/Feedback'

export default {
  components: {
    Navbar,
    Beat,
    SamplePack,
    Sample,
    Payment,
    RegisterModal,
    BeatOrder,
    SamplePackOrder,
    Feedback
  },
  metaInfo () {
    return {
      title: 'Sound Store',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content:
            'Artist Republik is a 360 degree platform offering artist submitted beats to support your sound! We offer mastering, distribution, playlisting, and more!'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content:
            'Sound Store | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'og:description',
          name: 'og:description',
          content:
            'Artist Republik is a 360 degree platform offering artist submitted beats to support your sound! We offer mastering, distribution, playlisting, and more!'
        },
        {
          vmid: 'og:url',
          property: 'og:url',
          content: 'https://app.artistrepublik.com' + this.$route.fullPath
        },
        {
          vmid: 'twitter:title',
          property: 'twitter:title',
          content:
            'Sound Store | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Artist Republik is a 360 degree platform offering artist submitted beats to support your sound! We offer mastering, distribution, playlisting, and more!'
        }
      ]
    }
  },
  data: function () {
    return {
      paymentSuccess: false,
      orderedItems: [],
      orderError: null,
      orderCount: '',
      routeName: this.$route.name,
      loading: false,
      valid: true,
      firstNameRules: [(v) => !!v || 'First Name is required'],
      lastNameRules: [(v) => !!v || 'Last Name is required'],
      addressRules: [(v) => !!v || 'Address is required'],
      cityRules: [(v) => !!v || 'City is required'],
      stateRules: [(v) => !!v || 'State is required'],
      countryRules: [(v) => !!v || 'Country is required'],
      zipRules: [
        (v) => !!v || 'Zip is required',
        (v) =>
          /^[0-9a-zA-Z]+$/.test(v) || 'Only Numbers and Letters are allowed'
      ],
      form: {
        first_name: null,
        last_name: null,
        address: null,
        city: null,
        state: null,
        country: null,
        zip: null
      },
      loadingOrder: false,
      orderFetched: {},
      cartUpdateKey: null,
      processingFee: 65
    }
  },
  computed: {
    ...mapGetters({
      cart: 'SSCart/getCart',
      cartItemCount: 'SSCart/getCartItemCount',
      getCartKey: 'SSCart/getCartKey',
      user: 'getUser',
      loggedIn: 'isAuthenticated'
    }),
    paymentData: function () {
      let data = {
        beats: [],
        samples: [],
        sample_packs: [],
        first_name: this.form.first_name,
        last_name: this.form.last_name,
        address: this.form.address,
        city: this.form.city,
        state: this.form.state,
        country: this.form.country,
        zip: this.form.zip,
        cart_key: this.getCartKey
      }
      this.cart.beats.forEach((v) => {
        if ('offer' in v) {
          data.beats.push({ uuid: v.uuid, offer_id: v.offer.uuid })
        } else {
          data.beats.push({ uuid: v.uuid, pricing_id: v.pricing_id })
        }
      })
      this.cart.samples.forEach((v) => data.samples.push(v.uuid))
      this.cart.samplePacks.forEach((v) => data.sample_packs.push(v.uuid))
      return data
    },
    paymentTotal () {
      let amount = []
      this.cart.beats.forEach((v) => {
        if ('offer' in v) {
          amount.push(v.offer.amount)
        } else {
          let pricing = v.pricing.filter(
            (vInner) => vInner.id === v.pricing_id
          )[0]
          let beat_amount = pricing.sale_amount
            ? pricing.sale_amount
            : pricing.amount
          amount.push(beat_amount)
        }
      })
      this.cart.samples.forEach((v) => amount.push(v.amount))
      this.cart.samplePacks.forEach((v) => amount.push(v.amount))

      let total = amount.reduce(function (a, b) {
        return parseFloat(a) + parseFloat(b)
      }, 0)

      return this.roundNumber(total, 2)
    },
    totalWithFee () {
      return this.paymentTotal + this.processingFee / 100
    },
    orderedBeats () {
      if (this.orderFetched.length) {
        return this.orderFetched.filter((v) => v.type === 'beat')
      } else {
        return []
      }
    },
    orderedSamples () {
      if (this.orderFetched.length) {
        return this.orderFetched.filter(
          (v) => v.type === 'sample-pack' || v.type === 'sample'
        )
      } else {
        return []
      }
    }
  },
  methods: {
    ...mapActions({
      clearCart: 'SSCart/clearCart',
      updateCartRecord: 'SSCart/updateCartRecord'
    }),
    ...mapMutations({
      addBeatToCart: 'SSCart/ADD_BEAT_TO_CART',
      addSamplePackToCart: 'SSCart/ADD_SAMPLE_PACK_TO_CART',
      addSampleToCart: 'SSCart/ADD_SAMPLE_TO_CART',
      setCartKey: 'SSCart/SET_CART_KEY',
      removeCartKey: 'SSCart/REMOVE_CART_KEY'
    }),
    initAutocomplete: function () {
      this.autocomplete = new google.maps.places.Autocomplete(
        this.$refs.address.$refs.input,
        { types: ['geocode'] }
      )
      this.autocomplete.setFields(['address_component'])
      this.autocomplete.addListener('place_changed', this.setAddress)
    },
    setAddress: function () {
      let place = this.autocomplete.getPlace().address_components
      this.form.address =
        (place.find((s) => s.types[0] === 'street_number').long_name || '') +
        ' ' +
        (place.find((s) => s.types[0] === 'route').long_name || '')
      this.form.city =
        place.find((s) => s.types[0] === 'locality').long_name || ''
      this.form.state =
        place.find((s) => s.types[0] === 'administrative_area_level_1')
          .long_name || ''
      this.form.country = place.find((s) => s.types[0] === 'country').long_name
      this.form.zip =
        place.find((s) => s.types[0] === 'postal_code').long_name || ''
    },
    onPaymentSuccess: async function (data) {
      if (data.status === 'paid') {
        this.orderedItems = this.cart
        this.clearCart()
        this.paymentSuccess = true

        //get order details
        this.loadingOrder = true
        try {
          let res = await Vue.$http.get(
            `v1/sound-store/order/get-order-details`,
            {
              params: {
                payment_id: data.key
              }
            }
          )

          this.orderFetched = res.data.data.order_data
          this.removeCartKey()
        } catch (err) {
          this.throwError(err)
        }
        this.loadingOrder = false
      }
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
      this.orderError = err
    },
    validate: function () {
      this.$refs.form.validate()
      if (!this.valid) {
        return true
      }
    }
  },
  created: async function () {
    this.processingFee = await this.getProcessingFee(this.paymentTotal * 100)
    let beat = this.$route.query['beat']
    let offer = this.$route.query['offer']
    let cartKey = this.$route.query['cart_key']
    if (beat && offer) {
      this.loading = true
      try {
        let {
          data: { data }
        } = await Vue.$http.get(`v1/sound-store/offer/${offer}`)
        if (data.status === 'expired') {
          window.alert('Your beat offer has expired!')
        }
        if (data.status === 'accepted') {
          let beat = { ...data.beat }
          delete data['beat']
          beat['offer'] = data
          this.addBeatToCart(beat)
          this.updateCartRecord()
        }
      } catch (err) {
        this.throwError(err)
      }
      this.loading = false
    } else if (cartKey) {
      this.loading = true
      try {
        let response = await Vue.$http.get(
          `v1/sound-store/order/cart/${cartKey}`
        )

        if (response.status === 200) {
          let responseData = response.data.data
          let beats = responseData.beats
          let sample_packs = responseData.sample_packs
          let samples = responseData.samples

          if (beats.length) {
            beats.forEach((beat) => {
              this.addBeatToCart(beat)
            })
          }

          if (sample_packs.length) {
            sample_packs.forEach((sample_pack) => {
              this.addSamplePackToCart(sample_pack)
            })
          }

          if (samples.length) {
            samples.forEach((sample) => {
              this.addSampleToCart(sample)
            })
          }
        }
      } catch (err) {
        this.throwError(err)
      }
      this.loading = false
    }
    try {
      let res = await this.$store.dispatch('getOrderStats', 'sound-store')
      this.orderCount = res.data.order_count
    } catch (err) {
      console.error(err)
      this.throwError(err)
    }
  },
  mounted: function () {
    if (!this.loggedIn) {
      this.$refs.registerModal.openModal()
    }
  },
  watch: {
    cartItemCount: function () {
      if (!this.paymentSuccess) {
        this.updateCartRecord()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.list-style-none {
  list-style-type: none;
}
</style>
