<template>
  <div>
    <card
      shadow
      type="secondary"
    >
      <template>
        <h2 class="h6 heading-small text-muted mb-4">
          Stripe
        </h2>
        <div class="pl-lg-4">
          <div class="row">
            <div class="col-12">
              <div
                v-if="status"
                class="alert"
                :class="'alert-' + status"
              >
                {{ message }}
              </div>
              <a
                v-if="authorized === false"
                href="https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=ca_GNqxtE332a458ult4XcXKXgpRJu7poET&scope=read_write"
              >
                <v-btn
                  dark
                  color="blue"
                  type="info"
                >
                  Accept Payments through Stripe
                </v-btn>
              </a>
              <v-btn
                dark
                color="success"
                v-else-if="authorized === true"
                type="success"
              >
                Stripe Account Linked
              </v-btn>
            </div>
          </div>
        </div>
        <h3 class="h6 heading-small text-muted mb-4 mt-4">
          User Information
        </h3>
        <div class="pl-lg-4">
          <div class="row">
            <div
              v-if="userInfo !== undefined && userInfo !== null && userInfo !== ''"
              class="col-md-6"
            >
              <label>Username</label>
              <base-input
                v-model="userInfo.general.username"
                placeholder=""
                disabled
              />
            </div>
            <div
              v-if="userInfo !== undefined && userInfo !== null && userInfo !== ''"
              class="col-md-6"
            >
              <label>Email Address</label>
              <base-input
                v-model="userInfo.general.email"
                placeholder=""
              />
            </div>
          </div>
          <div class="row">
            <div
              v-if="userInfo !== undefined && userInfo !== null && userInfo !== ''"
              class="col-md-6"
            >
              <label>First Name</label>
              <base-input
                v-model="userInfo.general.fname"
                placeholder=""
              />
            </div>
            <div
              v-if="userInfo !== undefined && userInfo !== null && userInfo !== ''"
              class="col-md-6"
            >
              <label>Last Name</label>
              <base-input
                v-model="userInfo.general.lname"
                placeholder=""
              />
            </div>
          </div>
          <div class="row">
            <b-form-group
              v-if="userInfo !== undefined && userInfo !== null && userInfo !== '' && !changePassword"
              class="col-md-6"
              description="Click Button to Edit"
            >
              <label>Password</label>
              <b-input-group @dblclick="()=>changePassword=!changePassword">
                <template v-slot:append>
                  <v-btn
                    class="btn btn-light"
                    @click="()=>changePassword=!changePassword"
                  >
                    <strong class="text-warning"><i class="mdi mdi-lead-pencil" aria-hidden="true" /> </strong>
                  </v-btn>
                </template>
                <b-form-input
                  type="password"
                  disabled
                  placeholder="password"
                />
              </b-input-group>
            </b-form-group>
            <b-form-group
              v-if="userInfo !== undefined && userInfo !== null && userInfo !== '' && changePassword"
              class="col-md-6 "
              description="Press x to cancel"
            >
              <label>Old Password</label>
              <b-input-group v-if="changePassword">
                <template v-slot:append>
                  <b-input-group-text @click="cancelPasswordChange">
                    <strong class="text-danger"><i class="mdi mdi-close" aria-hidden="true" /> </strong>
                  </b-input-group-text>
                </template>
                <b-form-input
                  v-model="userInfo.general.old_password"
                  type="password"
                  placeholder="password"
                />
              </b-input-group>
            </b-form-group>
          </div>
          <div class="row">
            <b-form-group
              v-if="userInfo !== undefined && userInfo !== null && userInfo !== '' && changePassword"
              class="col-md-6"
              description="Press x to cancel"
            >
              <label>New Password</label>
              <b-input-group v-if="changePassword">
                <template v-slot:append>
                  <b-input-group-text @click="cancelPasswordChange">
                    <strong class="text-danger"><i class="mdi mdi-close" aria-hidden="true" /> </strong>
                  </b-input-group-text>
                </template>
                <b-form-input
                  v-model="userInfo.general.password"
                  type="password"
                  placeholder="new password"
                />
              </b-input-group>
            </b-form-group>
            <b-form-group
              v-if="userInfo !== undefined && userInfo !== null && userInfo !== '' && changePassword"
              class="col-md-6"
            >
              <label>Confirm Password</label>
              <b-form-input
                v-model="userInfo.general.password_confirmation"
                type="password"
                placeholder="new password confirmation"
              />
            </b-form-group>
          </div>
          <div class="row">
            <div
              v-if="userInfo !== undefined && userInfo !== null && userInfo !== ''"
              class="col"
            >
              <label>Bio</label>
              <b-form-textarea
                id="bio-textarea"
                v-model="userInfo.general.about"
                placeholder="Say something about yourself..."
                rows="3"
                max-rows="6"
              />
            </div>
          </div>
        </div>
        <h3 class="h6 heading-small text-muted mb-4">
          Contact Information
        </h3>
        <div class="pl-lg-4">
          <div class="row">
            <div
              v-if="userInfo !== undefined && userInfo !== null && userInfo !== ''"
              class="col-md-12"
            >
              <label>Address</label>
              <base-input
                v-model="userInfo.address.address"
                placeholder=""
              />
            </div>
          </div>
          <div
            v-if="userInfo !== undefined && userInfo !== null && userInfo !== ''"
            class="row"
          >
            <div class="col-md-4">
              <label>City</label>
              <base-input
                v-model="userInfo.address.city"
                placeholder=""
              />
            </div>
            <div class="col-md-4">
              <label>Country</label>
              <base-input
                v-model="userInfo.address.country"
                placeholder=""
              />
            </div>
            <div class="col-md-4">
              <label>Postal Code</label>
              <base-input
                v-model="userInfo.address.zipcode"
                placeholder=""
              />
            </div>
          </div>
        </div>
        <h3 class="h6 heading-small text-muted mb-4 mt-4">
          Payments
        </h3>
        <div class="pl-lg-4">
          <div class="row">
            <div class="col-md-6">
              <label>Paypal Email</label>
              <base-input
                v-model="userInfo.payments.paypal_email"
                placeholder=""
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div v-if="!userInfo.payments.paypal_merchant">
                <v-btn dark color="primary" v-if="!paypalConnectLink" @click="doGetPaypalLink">Generate Paypal Merchant Link</v-btn>
                <a v-bind:class="['btn', 'btn-primary', {hidden: !paypalConnectLink}]" data-paypal-button="true" :href="`${paypalConnectLink}&displayMode=minibrowser`" target="PPFrame">Connect
                  PayPal</a>
              </div>
              <div v-else>
                Paypal Merchant Setup
              </div>
            </div>
          </div>
        </div>
        <div class="text-center">
          <v-btn
            dark
            color="primary"
            type="primary"
            icon="ni ni-check-bold"
            @click="updateUserInfo"
          >
            Save Information
          </v-btn>
        </div>
      </template>
    </card>
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'stripe-settings',
  data () {
    return {
      authorized: null,
      status: null,
      userInfo: null,
      oldEmail: null,
      changePassword: false,
      paypalConnectLink: null
    }
  },
  created () {
    this.fetchSettings()
    if (this.$route.query.code && !this.$route.query.token_type) {
      this.$store.dispatch('authorizeAccount', this.$route.query.code)
        .then(() => {
          this.authorized = true
          this.status = 'success'
          this.message = 'You have successfully linked your stripe account!'
        })
        .catch(err => {
          this.authorized = false
          this.status = 'danger'
          this.message = err.data.data.message + ' (Error Code: ' + err.data.data.code + ')'
        })
    }
    this.$store.dispatch('fetchStripeAuthorization')
      .then(res => {
        this.authorized = res.data.stripe_authorized
      })
      .catch(() => {
        this.authorized = false
        this.status = 'danger'
        this.message = 'An error occurred while fetching your stripe status... Please try again later!'
      })
    if (this.$route.query.merchantIdInPayPal) {
      Vue.$http.post(`v1/payment/paypal`, { paypal_merchant_id: this.$route.query.merchantIdInPayPal }).then(() => {
        this.fetchSettings()
      }).catch(err => {
        console.error(err)
      })
    }
    (function (d, s, id) {
      var js, ref = d.getElementsByTagName(s)[0]
      if (!d.getElementById(id)) {
        js = d.createElement(s)
        js.id = id
        js.async = true
        js.src = 'https://www.paypal.com/webapps/merchantboarding/js/lib/lightbox/partner.js'
        ref.parentNode.insertBefore(js, ref)
      }
    }(document, 'script', 'paypal-js'))
  },
  methods: {
    updateUserInfo () {
      let emailChanged = this.oldEmail !== this.userInfo.general.email
      let data = {
        username: this.userInfo.general.username,
        email: this.userInfo.general.email,
        fname: this.userInfo.general.fname,
        lname: this.userInfo.general.lname,
        bio: this.userInfo.general.about,
        address: this.userInfo.address.address,
        country: this.userInfo.address.country,
        city: this.userInfo.address.city,
        zipcode: this.userInfo.address.zipcode
      }
      if (this.changePassword) {
        data.password = this.userInfo.general.password
        data.password_confirmation = this.userInfo.general.password_confirmation
        data.old_password = this.userInfo.general.old_password
      }
      this.$store.dispatch('updateUserInfo', data)
        .then(res => {
          this.$store.dispatch('fetchSettings')
          console.log(res)
          emailChanged && this.$router.push('/welcome')
          !!this.changePassword && this.cancelPasswordChange()
        })
        .catch(err => {
          let errors = err.data.errors
          !!errors && Object.keys(errors).forEach(key => this.$noty.error(errors[key]))
          console.log(err)
        })
    },
    cancelPasswordChange () {
      this.userInfo.general.password = this.userInfo.general.password_confirmation = ''
      this.userInfo.general.password_confirmation = this.userInfo.general.password
      this.changePassword = false
    },
    fetchSettings: function () {
      this.$store.dispatch('fetchSettings')
        .then(res => {
          this.userInfo = res.account
          this.oldEmail = res.account.general.email
        })
        .catch(err => {
          console.log(err)
        })
    },
    doGetPaypalLink: async function () {
      try {
        let { data: { data } } = await Vue.$http.get(`v1/payment/paypal/onboarding-link`)
        this.paypalConnectLink = data.href
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>
<style scoped>
.hidden {
  display: none;
}
</style>
