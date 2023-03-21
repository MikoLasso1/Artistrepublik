<template>
  <v-dialog v-model="dialog" max-width="350" scrollable persistent>
    <v-card :loading="loading">
      <v-card-title class="dark primary">Edit Promotion Link</v-card-title>
      <v-card-text v-show="! editSubmitted">
        <v-form ref="form">
          <v-select
            label="Type"
            :items="productTypes"
            v-model="product_id"
            @change="clearURL"
          ></v-select>
          <v-text-field
            :label="urlLabel"
            :placeholder="placeholder"
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
      product_id: '',
      urlErrors: [],
      productTypes: [
        { text: 'Spotify Follower Growth', value: 1 },
        { text: 'SoundCloud Follower Growth', value: 2 },
        { text: 'SoundCloud Stream Growth', value: 4 },
        { text: 'SoundCloud Engagement', value: 7 }
      ]
    }
  },

  watch: {
    url: {
      handler: async function (val) {
        this.urlErrors = []
        if (val) {
          if (this.product_id === 1) {
            if (!/spotify:\S+:\S+/.test(val)) {
              this.urlErrors.push('Make sure the spotify url is in the right format')
            }
            if (/spotify:track:\S+/.test(val) || /spotify:album:\S+/.test(val)) {
              this.urlErrors.push('Tracks and albums URIs are not allowed')
            }
          } else if (this.product_id === 4 || this.product_id === 7) {
            if (!/\S+\/\S+/.test(val)) {
              this.urlErrors.push('Make sure the url is in the right format')
            }
          }
        } else {
          this.urlErrors.push('Please enter a URL')
        }
      }
    }
  },

  computed: {
    urlLabel: function () {
      switch (this.product_id) {
        case 1:
          return ''
        case 2:
          return 'SoundCloud channel to promote'
        case 4:
        case 7:
          return 'Soundcloud Track to Promote'
      }
      return ''
    },
    placeholder: function () {
      switch (this.product_id) {
        case 1:
          return 'spotify:playlist:5gXdNozX0po0S33Rjg6wMS'
        case 2:
          return 'https://www.soundcloud.com/artistrepublik/my-sample-song'
        case 4:
          return 'https://www.soundcloud.com/artistrepublik/my-sample-song'
        case 7:
          return 'https://www.soundcloud.com/artistrepublik/my-sample-song'
      }
      return ''
    },
    disabledClass: function () {
      if (this.product_id === 1) {
        return 'disabled'
      } else {
        return ''
      }
    }
  },

  methods: {
    closeModal: function () {
      this.dialog = false
      this.url = ''
      this.urlErrors = []
    },

    openModal: function (data) {
      this.campaign_id = data.campaign_id
      this.url = data.url
      this.product_id = data.product_id
      this.dialog = true
      this.editSubmitted = false
    },

    clearURL: function () {
      this.url = ''
    },

    submitEdit: async function () {
      this.loading = true

      if (this.url === '' || this.url === null) {
        this.urlErrors.push('Please enter a url.')
        return
      }


      if (this.urlErrors.length === 0) {
        let validatePromotionResponse = await Vue.$http.post(`v1/gwu/edit-gwu-submission-url/`, { url: this.url, campaign_id: this.campaign_id, product_id: this.product_id })
        if (validatePromotionResponse.data.success === false) {
          this.urlErrors.push('This URL does not exist. Please enter a valid URL')
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
