<template>
  <v-dialog v-model="dialog" max-width="350" scrollable persistent>
    <v-card :loading="loading">
      <v-card-title class="dark primary">Edit Spotify Link</v-card-title>
      <v-card-text v-show="! editSubmitted">
        You have requested to edit your spotify link. You may edit your spotify link as many times as you would like within 24 hours of placing the associated order. Please enter your new spotify link
        below.
        <v-form ref="form">
          <v-text-field
            label="Spotify URL"
            placeholder="https://open.spotify.com/track/53CJANUxooaqGOtdsBTh7O"
            v-model="url"
            :error-messages="urlErrors"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-text v-show="editSubmitted">
        Edit complete.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-show="! editSubmitted" text color="red" @click="submitEdit">Submit</v-btn>
        <v-btn v-show="! editSubmitted" text color="secondary" @click="closeModal">Cancel</v-btn>
        <v-btn v-show="editSubmitted" text color="primary" @click="closeModal">Close</v-btn>
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
      loading: false,
      editSubmitted: false,
      url: '',
      track_id: '',
      urlErrors: []
    }
  },

  watch: {
    url: {
      handler: async function (val) {
        this.urlErrors = []
        if (val) {
          let strArray = val.split('/')
          if (!strArray.includes('track') || !strArray.includes('open.spotify.com')) {
            this.urlErrors.push('Make sure the spotify URL is in the right format')
          }
        } else {
          this.urlErrors.push('Please enter a spotify URL')
        }
      }
    }
  },

  methods: {
    closeModal: function () {
      this.dialog = false
      this.url = ''
      this.track_id = ''
      this.urlErrors = []
    },

    openModal: function (user_track) {
      this.url = user_track.url
      this.track_id = user_track.id
      this.dialog = true
      this.editSubmitted = false
    },

    submitEdit: async function () {
      this.loading = true

      if (this.url === '' || this.url === null) {
        this.urlErrors.push('Please enter a spotify url.')
        return
      }


      if (this.urlErrors.length === 0) {
        let spotifyValidateResponse = await Vue.$http.post(`v1/spotify/edit-playlist-submission-url/`, { url: this.url, track_id: this.track_id })
        if (spotifyValidateResponse.data.success === false) {
          this.urlErrors.push('This spotify URL does not exist. Please enter a valid spotify URL')
          return
        }

        this.loading = false
        this.editSubmitted = true
        this.$emit('after-edit')
      }
    }
  }
}
</script>
