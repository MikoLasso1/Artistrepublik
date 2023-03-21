<template>
  <v-card class="miniprofiles-createfeaturedshow">
    <v-card-title>
      <h2>Featured Show</h2>
    </v-card-title>
    <v-card-subtitle>
      Add or update your featured show.
    </v-card-subtitle>
    <v-form
      v-model="valid"
      ref="featuredShowForm"
    >
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="ticketUrl"
              :rules="urlRules"
              label="Ticket URL"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="location"
              :rules="locationRules"
              label="Location"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="date"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  :rules="dateRules"
                  label="Picker in menu"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                no-title
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click="menu = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.menu.save(date)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" md="6">
            <v-menu
              ref="menu2"
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="time"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="time"
                  :rules="timeRules"
                  label="Show Time"
                  prepend-icon="mdi-clock"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menu2"
                v-model="time"
                format="ampm"
                ampm-in-title
                full-width
                @click:minute="$refs.menu2.save(time)"
              ></v-time-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-file-input
              label="Show Image"
              v-model="file"
              :rules="showId ? [] : imgRules"
              accept="image/jpeg, image/png"
              required
              class="required"
            ></v-file-input>
          </v-col>
        </v-row>
        <v-btn
          id="previewArt"
          color="purple"
          dark @click="previewArtWork"
          v-if="savedImage"
          class="mr-4 my-2"
        >
          Preview Image
        </v-btn>
        <v-btn
          :disabled="!valid || processing"
          :loading="processing"
          color="success"
          @click="submit"
          class="my-2"
        >
          Submit
        </v-btn>
      </v-container>
    </v-form>
  </v-card>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'CreateFeaturedShow',
  data () {
    return {
      username: this.$store.getters.getSettings.account.general.username,
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      menu2: false,
      loading: false,

      file: null,
      ticketUrl: null,
      showDate: null,
      time: null,
      location: null,

      valid: false,
      countries: null,
      locationRules: [
        v => !!v || 'A location is required'
      ],
      imgRules: [
        v => !!v || 'File is required'
      ],
      nameRules: [
        v => !!v || 'Name is required'
      ],
      urlRules: [
        v => !!v || 'A URL is required',
        v => /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?)/gi.test(v) || 'Link must be valid'
      ],
      timeRules: [
        v => !!v || 'Time is required'
      ],
      dateRules: [
        v => !!v || 'Date is required'
      ],
      savedImage: null,
      showId: null,
      processing: false
    }
  },
  methods: {
    async submit () {
      this.$refs.featuredShowForm.validate()
      if (!this.valid) {
        return
      }
      this.processing = true
      this.$noty.info('Processing Request...')
      let formData = new FormData()
      formData.append('ticket_url', this.ticketUrl)
      formData.append('location', this.location)
      formData.append('date', this.date)
      formData.append('time', this.time)
      formData.append('image', this.file)
      formData.append('is_featured', 1)
      try {
        if (this.showId) {
          formData.append('_method', 'PUT')
          await Vue.$http.post(`v1/user/mini-profile/show/${this.showId}`, formData)
          this.$noty.success('Show updated successfully')
        } else {
          await Vue.$http.post(`v1/user/mini-profile/show`, formData)
          this.$noty.success('Show added successfully')
        }
        this.file = null
        this.getFeatured()
      } catch (error) {
        this.$noty.warning('Error Occurred while processing request.')
        this.throwError(error)
      }
      this.processing = false
    },
    async getFeatured () {
      this.processingLinks = true
      try {
        let response = await Vue.$http.get(`v1/user/mini-profile/show-featured`, {
          params: {
            username: this.username,
            layout_id: this.layout
          }
        })
        if (response.status === 200) {
          let result = response.data.data
          this.ticketUrl = result.ticket_url
          this.showDate = result.date
          this.time = result.time
          this.location = result.location
          this.savedImage = result.image
          this.showId = result.id
        }
      } catch (error) {
        this.$sentry.captureException(error)
        this.$noty.warning('Error Occurred while processing request.')
        this.processingLinks = false
      }
      this.$refs.featuredShowForm.resetValidation()
    },

    previewArtWork () {
      if (this.imgFile) {
        window.open(this.savedImage, '_blank')
      }
    },
    fetchCountries () {
      this.$store.dispatch('fetchCountries')
        .then(res => {
          this.countries = res.countries
        })
        .catch(() => {
          // Do Nada
        })
    }
  },
  mounted () {
    this.getFeatured()
  },
  watch: {
    layout: function () {
      this.ticketUrl = ''
      this.showDate = ''
      this.time = ''
      this.location = ''
      this.savedImage = ''
      this.showId = ''
      this.getFeatured()
    }
  }
}
</script>
<style>
.miniprofiles-createfeaturedshow {
  height: 100%;
}
</style>
