<template>
  <v-dialog v-model="dialog" width="500px">
    <v-card>
      <v-card-title class="headline">Sound Store Seller Registration</v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form" @submit.prevent="onSubmit" autocomplete="off">
          <v-text-field
            v-model="form.display_name"
            :rules="rules.display_name"
            label="Display Name"
            @keyup="onDisplayNameUp"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.city"
            :rules="rules.city"
            label="City"
            ref="city"
            autocomplete="new-password"
            @focus="initAutocomplete()"
          ></v-text-field>
          <v-row>
            <v-col md="4" cols="6">
              <v-text-field
                v-model="form.state"
                :rules="rules.state"
                label="State/Provence"
                autocomplete="new-password"
              ></v-text-field>
            </v-col>
            <v-col md="5" cols="6">
              <v-text-field
                v-model="form.country"
                :rules="rules.country"
                label="Country"
                autocomplete="new-password"
              ></v-text-field>
            </v-col>
            <v-col md="3" cols="12">
              <v-text-field
                v-model="form.zipcode"
                :rules="rules.zipcode"
                label="Zip Code"
                autocomplete="new-password"
              ></v-text-field>
            </v-col>
          </v-row>
          <div class="d-flex">
            <v-spacer></v-spacer>
            <v-btn color="primary" type="submit" :loading="loading">Sign Up</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
const _ = require('lodash')
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  data: function () {
    return {
      autocomplete: null,
      dialog: false,
      loading: false,
      valid: true,
      displayNameAvailable: true,
      form: {
        display_name: null,
        city: null,
        state: null,
        country: null,
        zipcode: null
      },
      rules: {
        display_name: [
          v => !!v || 'Display name is required',
          () => this.displayNameAvailable || 'Display name is not available'
        ],
        city: [
          v => !!v || 'City is required'
        ],
        state: [
          v => !!v || 'State/Provence is required'
        ],
        country: [
          v => !!v || 'Country is required'
        ],
        zipcode: [
          v => !!v || 'Zip Code is required'
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      settings: 'getSettings'
    })
  },
  methods: {
    ...mapActions({
      fetchSettings: 'fetchSettings'
    }),
    openModal: function () {
      this.dialog = true
    },
    onDisplayNameUp: _.debounce(async function () {
      let { data: { data } } = await Vue.$http.get(`v1/sound-store/account/display-name-check?display_name=${this.form.displayName}`)
      this.usernameAvailable = data ? data.is_available : false
      this.$refs.form.validate()
    }, 400),
    initAutocomplete: function () {
      this.autocomplete = new google.maps.places.Autocomplete(this.$refs.city.$refs.input, { types: ['geocode'] })
      this.autocomplete.setFields(['address_component'])
      this.autocomplete.addListener('place_changed', this.setAddress)
    },
    setAddress: function () {
      let place = this.autocomplete.getPlace().address_components
      this.form.state = place.find(s => s.types[0] === 'administrative_area_level_1').long_name || ''
      this.form.country = place.find(s => s.types[0] === 'country').long_name
      this.form.city = place.find(s => s.types[0] === 'locality').long_name || ''
    },
    onSubmit: async function () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.loading = true
      try {
        let { data: { data } } = await Vue.$http.post('v1/sound-store/account', this.form)
        if (!data.error) {
          await this.fetchSettings()
          this.dialog = false
        }
      } catch (err) {
        console.error(err)
      }
      this.loading = false
    }
  },
  created: function () {
    this.form.city = this.settings.account.address.city
    this.form.state = this.settings.account.address.state
    this.form.country = this.settings.account.address.country
    this.form.zipcode = this.settings.account.address.zipcode
  }
}
</script>

<style>

</style>
