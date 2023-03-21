<template>
  <v-card :loading="loading">
    <v-card-title>Information</v-card-title>
    <v-card-text>
      <v-progress-linear
        v-if="accountProgress !== 100"
        v-model="accountProgress"
        color="primary"
        height="25"
        class="mb-4"
        dark
      >
        Profile {{ Math.ceil(accountProgress) }}% completed
      </v-progress-linear>
      <v-form v-model="valid" @submit.prevent="onSubmit" ref="form">
        <v-text-field
          v-model="form.username"
          :rules="rules.username"
          @keyup="onUsernameKeyup"
          label="Username"
          required
        ></v-text-field>
        <v-text-field
          v-model="form.email"
          :rules="rules.email"
          label="Email"
          required
          autocomplete="new-password"
        ></v-text-field>
        <v-row>
          <v-col md="6">
            <v-text-field
              v-model="form.fname"
              label="First name"
            ></v-text-field>
          </v-col>
          <v-col md="6">
            <v-text-field
              v-model="form.lname"
              label="Last name"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col lg="6" cols="12">
            <v-menu
              ref="dateMenu"
              v-model="dateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="form.birthday"
                  label="Birthday"
                  prepend-icon="mdi-cake-variant"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="datePicker"
                color="purple"
                v-model="form.birthday"
                :max="new Date().toISOString().substr(0, 10)"
                min="1900-01-01"
                @change="onBirthdayChange"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col lg="6" cols="12" id="phone">
            <vue-tel-input-vuetify
              v-model="form.phone"
              label="Phone"
              placeholder=""
              mode="international"
              @validate="validatePhone"
            ></vue-tel-input-vuetify>
            <span class="red--text" v-if="!isvalidPhone">Phone number is not valid</span>
            <v-checkbox
              v-model="form.phone_opt_in"
              type="checkbox"
              class="mt-0"
            >
              <div slot="label">
                Opt in for VIP text alerts for new features and discounts
              </div>
            </v-checkbox>
          </v-col>
        </v-row>
        <h2 class="h2" style="font-weight: 500;">Address</h2>
        <v-text-field
          v-model="form.city"
          label="City"
          ref="city"
          autocomplete="new-password"
          @focus="initAutocomplete()"
        ></v-text-field>
        <v-row>
          <v-col md="4" cols="6">
            <v-text-field
              v-model="form.state"
              label="State"
              autocomplete="new-password"
            ></v-text-field>
          </v-col>
          <v-col md="5" cols="6">
            <v-text-field
              v-model="form.country"
              label="Country"
              autocomplete="new-password"
            ></v-text-field>
          </v-col>
          <v-col md="3" cols="12">
            <v-text-field
              v-model="form.zipcode"
              label="Zip Code"
              autocomplete="new-password"
            ></v-text-field>
          </v-col>
        </v-row>
        <h2 class="h2" style="font-weight: 500;">Other Information</h2>
        <v-row>
          <v-col md="6">
            <v-text-field
              v-model="form.artist_name"
              label="Artist Name"
            ></v-text-field>
          </v-col>
          <v-col md="6">
            <v-select
              v-model="form.genre_id"
              :items="generes.map(g => {return {value: g.id, text: g.name}})"
              label="Your Genre"
            ></v-select>
          </v-col>
        </v-row>
        <v-textarea
          v-model="form.about"
          label="Bio"
        ></v-textarea>
        <h2 class="h2" style="font-weight: 500;">Social Links</h2>
        <span class="subtitle-1">Your social links will be shown on your official Artist Republik profile</span>
        <v-row>
          <v-col md="6">
            <v-text-field
              v-model="form.facebook"
              label="Username"
              prepend-icon="mdi-facebook"
              prefix="www.facebook.com/"
            ></v-text-field>
          </v-col>
          <v-col md="6">
            <v-text-field
              v-model="form.twitter"
              label="Username"
              prepend-icon="mdi-twitter"
              prefix="www.twitter.com/"
            ></v-text-field>
          </v-col>
          <v-col md="6">
            <v-text-field
              v-model="form.spotify"
              label="Username"
              prepend-icon="mdi-spotify"
              prefix="www.open.spotify.com/"
            ></v-text-field>
          </v-col>
          <v-col md="6">
            <v-text-field
              v-model="form.soundcloud"
              label="Username"
              prepend-icon="mdi-soundcloud"
              prefix="www.soundcloud.com/"
            ></v-text-field>
          </v-col>
          <v-col md="6">
            <v-text-field
              v-model="form.instagram"
              label="Username"
              prepend-icon="mdi-instagram"
              prefix="www.instagram.com/"
            ></v-text-field>
          </v-col>
          <v-col md="6">
            <v-text-field
              v-model="form.snapchat"
              label="Snapchat"
              prepend-icon="mdi-snapchat"
            ></v-text-field>
          </v-col>
        </v-row>
        <h2 class="h2" style="font-weight: 500;">Paypal Payouts</h2>
        <v-text-field
          v-model="form.paypal_email"
          :rules="rules.paypal_email"
          label="Paypal Email"
        ></v-text-field>
        <v-btn color="success" type="submit" :loading="loading">SAVE</v-btn>
        <span v-if="status" class="ml-3" :class="[status === 'success' ? 'green--text' : 'red--text']">
          {{ status === 'success' ? 'Settings Saved!' : 'Error Occured. Try again later!' }}
        </span>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Vue from 'vue'

const _ = require('lodash')
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue'

export default {
  components: {
    VueTelInputVuetify
  },
  props: {
    settings: Object
  },
  data: function () {
    return {
      autocomplete: null,
      valid: true,
      dateMenu: false,
      usernameAvailable: true,
      loading: false,
      status: '',
      isvalidPhone: false,
      progressFormValues: [
        'username',
        'email',
        'fname',
        'lname',
        'birthday',
        'artist_name',
        'genre_id',
        'about',
        'city',
        'state',
        'country',
        'zipcode'
      ],
      form: {
        username: this.settings.account.general.username,
        email: this.settings.account.general.email,
        fname: this.settings.account.general.fname,
        lname: this.settings.account.general.lname,
        birthday: this.settings.account.general.birthday,
        phone: this.settings.account.general.phone,
        phone_opt_in: this.settings.account.general.phone ? this.settings.account.general.phone_opt_in : 1,
        artist_name: this.settings.account.general.artist_name,
        genre_id: this.settings.account.general.genre_id,
        about: this.settings.account.general.about,
        city: this.settings.account.address.city,
        state: this.settings.account.address.state,
        country: this.settings.account.address.country,
        zipcode: this.settings.account.address.zipcode,
        paypal_email: this.settings.account.payments.paypal_email,
        facebook: this.settings.account.links.facebook,
        twitter: this.settings.account.links.twitter,
        spotify: this.settings.account.links.spotify,
        soundcloud: this.settings.account.links.soundcloud,
        instagram: this.settings.account.links.instagram,
        snapchat: this.settings.account.links.snapchat
      },
      rules: {
        username: [
          v => !!v || 'Username is required',
          v => /^[a-zA-Z0-9_-]+$/u.test(v) || 'Username must contain only A-Z, 0-9, -, or _.',
          () => this.usernameAvailable || 'Username is not available'
        ],
        email: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
        ],
        paypal_email: [
          v => {
            if (v) {
              return /.+@.+\..+/.test(v) || 'E-mail must be valid'
            }
            return true
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      generes: 'getGenres'
    }),
    accountProgress: function () {
      let completeCount = this.progressFormValues.reduce((accum, key) => {
        if (this.hasValue(this.form[key])) {
          accum++
        }
        return accum
      }, 0)
      return (completeCount / this.progressFormValues.length) * 100
    }
  },
  watch: {
    dateMenu: function (val) {
      val && setTimeout(() => (this.$refs.datePicker.activePicker = 'YEAR'))
    }
  },
  methods: {
    ...mapActions({
      fetchSettings: 'fetchSettings'
    }),
    initAutocomplete: function () {
      this.autocomplete = new google.maps.places.Autocomplete(this.$refs.city.$refs.input, { types: ['geocode'] })
      this.autocomplete.setFields(['address_component'])
      this.autocomplete.addListener('place_changed', this.setAddress)
    },
    setAddress: function () {
      let place = typeof this.autocomplete.getPlace() !== 'undefined' ? this.autocomplete.getPlace().address_components : ''

      if (place.length > 0) {
        this.form.state = place.find(s => s.types[0] === 'administrative_area_level_1').long_name || ''
        this.form.country = place.find(s => s.types[0] === 'country').long_name
        this.form.city = place.find(s => s.types[0] === 'locality').long_name || ''
      }
    },
    onBirthdayChange: function (date) {
      this.$refs.dateMenu.save(date)
    },
    onUsernameKeyup: _.debounce(async function () {
      let { data: { data } } = await Vue.$http.get(`v1/username/${this.form.username}`)
      this.usernameAvailable = data ? data.is_available : false
      this.$refs.form.validate()
    }, 400),
    onSubmit: async function () {
      this.status = ''
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      if (!this.isvalidPhone) {
        let element = document.getElementById('phone')
        element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
        return
      }
      this.loading = true
      try {
        let { data: { data } } = await Vue.$http.post('v1/settings', this.form)
        if (data.success) {
          this.status = 'success'
          this.fetchSettings()
          this.$store.dispatch('extend')
        }
      } catch (err) {
        this.status = 'error'
        console.error(err)
      }
      this.loading = false
    },
    validatePhone (value) {
      /* Use object from vue-tel-input-vuetify to validate the phone number based on country */
      this.isvalidPhone = value.isValid
    }
  }
}
</script>
