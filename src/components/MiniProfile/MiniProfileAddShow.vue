<template>
  <v-row>
    <v-col>
      <v-form ref="form" v-model="valid">
        <div>
          <validation-errors :errors="validationErrors"></validation-errors>
        </div>

        <v-text-field
          v-model="ticketUrl"
          :rules="urlRules"
          label="Ticket URL"
          required
        ></v-text-field>
        <v-text-field
          v-model="location"
          :rules="locationRules"
          label="Location"
          required
        ></v-text-field>
        <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateFormatted"
              label="Date"
              hint="MM/DD/YYYY format"
              persistent-hint
              append-icon="mdi-calendar-month-outline"
              v-bind="attrs"
              @blur="date = parseDate(dateFormatted)"
              v-on="on"
              :rules="dateRules"
              readonly
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            no-title
            @input="menu1 = false"
          ></v-date-picker>
        </v-menu>
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
              label="Time"
              append-icon="mdi-clock-time-ten-outline"
              readonly
              v-bind="attrs"
              v-on="on"
              :rules="timeRules"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="menu2"
            v-model="time"
            full-width
            @click:minute="$refs.menu2.save(time)"
          ></v-time-picker>
        </v-menu>
        <v-file-input
          label="Show Image"
          accept="image/png, image/jpeg"
          :rules="fileRules"
          v-model="file"
        ></v-file-input>
        <div class="mt-2" v-if="fileDownloadUrl">
          Download:
          <a :href="fileDownloadUrl" target="_blank">{{ fileDownloadUrl }}</a>
        </div>
        <v-btn
          :loading="processing"
          :disabled="processing"
          @click="addShow"
          color="primary"
        >
          <span v-if="showId">Edit Show</span>
          <span v-else>Add Show</span>
        </v-btn>
      </v-form>
    </v-col>
    <VuetifyProgressDialog
      message="Processing Request"
      v-if="processing"
    ></VuetifyProgressDialog>
  </v-row>
</template>
<script>
import Vue from 'vue'
import validationErrorsMixin from '../../shared/mixins/ValidationErrorsMixin'
import VuetifyProgressDialog from '../../shared/components/VuetifyProgressDialog'

export default {
  name: 'MiniProfileAddShow',
  mixins: [validationErrorsMixin],
  props: {
    showId: {
      type: [Number, String],
      default: null
    },
    showDetails: {
      type: Object,
      default: null
    }
  },
  components: {
    VuetifyProgressDialog
  },
  data () {
    return {
      valid: false,
      processing: false,
      layoutId: this.layout,
      location: this.showDetails ? this.showDetails.location : null,
      locationRules: [v => !!v || 'Location is required'],
      time: this.showDetails ? this.showDetails.time : null,
      timeRules: [v => !!v || 'Time is required'],
      file: null,
      fileDownloadUrl: this.showDetails ? this.showDetails.image : null,
      menu1: false,
      menu2: false,
      date: this.showDetails
        ? this.showDetails.date
        : new Date().toISOString().substr(0, 10),
      dateRules: [
        v => !!v || 'Date is required',
        v =>
          /(^[0-9]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]{4}$)/g.test(v) ||
          'Date must be valid'
      ],
      dateFormatted: this.showDetails
        ? this.formatDate(this.showDetails.date)
        : this.formatDate(new Date().toISOString().substr(0, 10)),
      ticketUrl: this.showDetails ? this.showDetails.ticket_url : null,
      urlRules: [
        v => !!v || 'Ticket URL is required',
        v => /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?)/gi.test(v) || 'Link must be valid'
      ],
      fileRules: [
        v => {
          if (this.showId === null) {
            return !!v || 'Image is required'
          } else {
            return true
          }
        }
      ]
    }
  },
  methods: {
    async addShow () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.validationErrors = ''
      this.processing = true
      this.$noty.info('Processing Request...')
      let formData = new FormData()

      formData.append('ticket_url', this.ticketUrl)
      formData.append('image', this.file)
      formData.append('location', this.location)
      formData.append('date', this.date)
      formData.append('time', this.time)

      try {
        if (this.showId) {
          formData.append('_method', 'PUT')
          await Vue.$http.post(`v1/user/mini-profile/show/${this.showId}`, formData)
          this.$noty.success('Show updated successfully')
        } else {
          await Vue.$http.post(`v1/user/mini-profile/show`, formData)
          this.$noty.success('Show added successfully')
          this.file = null
          this.location = null
          this.date = null
          this.time = null
        }
        this.file = null
        this.processing = false
        this.$emit('get-all-shows')
        this.$emit('close')
        this.$root.$emit('updateLiveShows')
      } catch (error) {
        let items
        if (error.response.status === 400) {
          items = Object.values(error.response.data.data.message)
        } else if (error.response.status === 422) {
          items = Object.values(error.response.data.errors)
        }
        this.validationErrors = this.formatErrors(items)
        this.$noty.warning('Error Occurred while processing request.')
        this.processing = false
      }
    },
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate (date) {
      if (!date) return null
      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
  },
  watch: {
    showDetails: function (newVal) {
      if (newVal) {
        this.location = newVal.location
        this.date = newVal.date
        this.time = newVal.time
        this.fileDownloadUrl = newVal.image
      }
      if (this.$refs.form) {
        this.$refs.form.resetValidation()
      }
    },
    date () {
      this.dateFormatted = this.formatDate(this.date)
    }
  }
}
</script>
