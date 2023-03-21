<template>
  <v-dialog v-model="dialog" max-width="350" scrollable persistent>
    <v-card :loading="loading">
      <v-card-title class="dark error">Request to Delete Release</v-card-title>
      <v-card-text v-show="! requestSubmitted">
        You requested to delete the release
        <strong>{{ title }}</strong>.
        Please provide a short explanation as to why you wish to delete
        this release to help us determine if deletion is absolutely
        necessary, since this action cannot be reversed.
        <v-form v-model="valid" ref="form">
          <v-textarea
            :rules="reasonRule"
            v-model="reason"
            name="reason"
            hint="Why do you want to permanently delete this release?"
          ></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-text v-show="requestSubmitted">
        Your request has been received and is queued for processing.
        Please allow up to 48 hours for the request to be processed.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-show="! requestSubmitted" text color="red" @click="requestDeletion">Delete</v-btn>
        <v-btn v-show="! requestSubmitted" text color="secondary" @click="closeModal">Cancel</v-btn>
        <v-btn v-show="requestSubmitted" text color="primary" @click="closeModal">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'

export default {
  data: function () {
    return {
      dialog: false,
      selected: null,
      loading: false,
      reason: '',
      release: {},
      valid: true,
      requestSubmitted: false,
      reasonRule: [
        v => !!v || 'A Reason for Deletion is required'
      ]
    }
  },

  computed: {
    title: function () {
      return (this.release || {}).release_title || ''
    }
  },

  methods: {
    closeModal: function () {
      this.dialog = false
      this.reason = ''
    },

    openModal: function (release) {
      this.release = release
      this.dialog = true
      this.requestSubmitted = false
    },

    requestDeletion: async function () {
      if (this.release === {}) {
        return
      }

      this.$refs.form.validate()
      if (!this.valid) {
        return
      }

      this.loading = true

      try {
        await Vue.$http.delete(`v1/distribution/release/${this.release.id}?reason=${this.reason}`)
      } catch (err) {
        this.throwError(err)
      }

      this.loading = false
      this.requestSubmitted = true
      this.$emit('after-delete')
    }
  }
}
</script>
