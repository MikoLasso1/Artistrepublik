<template>
  <div>
    <v-form v-model="valid" @submit.prevent="onSubmit" ref="form">
      <v-row>
        <v-col cols="6">
          <v-text-field
            label="Campaign Name"
            placeholder="Playlist Growth"
            v-model="form.name"
            :rules="rules.name"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            label="Budget"
            placeholer="50"
            v-model="form.budget"
            type="number"
            step="any"
            :readonly="budget !== null"
            :rules="rules.budget"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-select
            label="Type"
            :items="productTypes"
            v-model="form.product_id"
            :rules="rules.product_id"
            @change="fetchBids"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-text-field
            label="Bid"
            placeholder="0.15"
            v-model="form.bid"
            type="number"
            step="any"
            :rules="rules.bid"
            :hint="bids ? `Top bid: $${bids[0]/100}` : ``"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-select
        v-if="form.product_id === 1 || form.product_id === 2"
        label="Genre"
        :items="genres"
        v-model="form.genre"
        :rules="rules.genre"
      ></v-select>
      <div v-if="form.product_id !== null">
        <v-text-field
          v-model="spotifyUrl"
          v-if="form.product_id === 1"
          label="Paste Your Spotify URL Here"
          placeholder="https://open.spotify.com/playlist/4uXb6D0fk8OwEn5Q4Sf30Q?si=6d934e7338cd"
          :prepend-icon="form.product_id === 1 ? `mdi-spotify` : `mdi-soundcloud`"
          :error-messages="uriErrors"
          @change="setSpotifyString"
        ></v-text-field>
        <v-text-field
          v-model="form.url"
          :label="urlLabel"
          :class="disabledClass"
          :error-messages="form.product_id !== 1 ? uriErrors : null"
          :readonly="form.product_id === 1"
          :prepend-icon="form.product_id === 1 ? `mdi-spotify` : `mdi-soundcloud`"
          :prefix="form.product_id !== 1 ? `https://www.soundcloud.com/` : ``"
          :placeholder="form.product_id === 1 ? `Generated URI` : (form.product_id === 2 ? `artistrepublik` : 'artistrepublik/my-sample-song')"
          :rules="rules.url"
        ></v-text-field>
        <v-alert color="orange" class="mt-2">
          <span v-if="form.product_id === 1">
            <strong>You will need to copy the link to your channel/playlist, It will look like this:</strong>
            <br /> <br />
                https://open.spotify.com/playlist/4uXb6D0fk8OwEn5Q4Sf30Q?si=6d934e7338cd
            <br /> <br />
            Paste this in the text area labeled: <strong> Spotify URL</strong>
          </span>
          <span v-else-if="form.product_id === 2">
            You will need to copy your channel name URL. To find this, go to your channel on SoundCloud and copy your channel name only from the URL in your browser. For example, we need the part in BOLD: https://soundcloud.com/<strong>artistrepublik</strong>
          </span>
          <span v-else>
            Copy PART of your Soundcloud URL as shown in bold below
            <br />
            <br />
            https://soundcloud.com/<strong>artistrepublik/my-sample-song</strong>
          </span>
        </v-alert>
      </div>
      <div class="mt-6 d-flex justify-space-between">
        <v-btn color="primary" @click="$emit('back-step')">Back</v-btn>
        <v-btn color="primary" type="submit">Next</v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import Vue from 'vue'
import { genres } from '@/store/modules/utils/GWUGenres'

export default {
  props: {
    budget: Number,
    campaign: Object
  },
  data: function () {
    return {
      uriErrors: [],
      bids: null,
      valid: true,
      productTypes: [
        { text: 'Spotify Follower Growth', value: 1 },
        { text: 'SoundCloud Follower Growth', value: 2 },
        { text: 'SoundCloud Stream Growth', value: 4 },
        { text: 'SoundCloud Engagement', value: 7 }
      ],
      genres: Object.values(this.mapObject(genres, function (v, k) {
        return { text: v, value: k }
      })),
      form: {
        name: this.campaign ? this.campaign.name : '',
        budget: this.campaign ? this.campaign.budget : this.budget,
        product_id: this.campaign ? this.campaign.product_id : null,
        bid: this.campaign ? this.campaign.bid : 0.15,
        genre: this.campaign ? this.campaign.genre : null,
        url: this.campaign ? this.campaign.url : null
      },
      spotifyUrl: null,
      rules: {
        name: [
          v => !!v || 'Campaign name is required',
          v => (v && v.length >= 5) || 'Campaign name must be at least 5 characters',
          v => (v && v.length <= 25) || 'Campaign name must be under 25 characters'
        ],
        budget: [
          v => !!v || 'Budget is required',
          v => v >= 5 || 'Budget must be at least $5'
        ],
        product_id: [
          v => !!v || 'Campaign type is required'
        ],
        bid: [
          v => !!v || 'Bid is required',
          (v) => {
            if (v > 0.50) {
              return 'Your bid must be less than $0.50'
            }
            if ([2, 4, 7].includes(this.form.product_id) && v < 0.15) {
              return 'Your bid must be greater than $0.15'
            }
            return true
          },
          v => v >= 0.05 || 'Your bid must be greater than $0.05'
        ],
        genre: [
          v => {
            if (!v && (this.form.product_id === 1 || this.form.product_id === 2)) {
              return 'Genre is required'
            }
            return true
          }
        ]
      }
    }
  },
  watch: {
    form: {
      handler: async function (val) {
        this.uriErrors = []
        let url = val.url
        if (val.product_id === 1 && url) {
          if (!/spotify:\S+:\S+/.test(url)) {
            this.uriErrors.push('Make sure the spotify URI is in the right format')
          }
          if (/spotify:track:\S+/.test(url) || /spotify:album:\S+/.test(url)) {
            this.uriErrors.push('Tracks and albums URIs are not allowed')
          }
        } else if (val.product_id === 4 || val.product_id === 7) {
          if (!/\S+\/\S+/.test(url)) {
            this.uriErrors.push('Make sure the url is in the right format')
          }
        }
      },
      deep: true
    }
  },
  computed: {
    urlLabel: function () {
      switch (this.form.product_id) {
        case 1:
          return 'Generated URI'
        case 2:
          return 'SoundCloud channel to promote'
        case 4:
        case 7:
          return 'Soundcloud Track to Promote'
        default:
          return ''
      }
    },
    disabledClass: function () {
      if (this.form.product_id === 1) {
        return 'disabled'
      } else {
        return ''
      }
    }
  },
  methods: {
    fetchBids: async function () {
      this.form.url = ''
      this.spotifyUrl = ''
      let { data: { data } } = await Vue.$http.get(`v1/gwu/bids?product_id=${this.form.product_id}`)
      this.bids = data['bids']
    },
    onSubmit: async function () {
      this.$refs.form.validate()
      if (!this.valid || this.uriErrors.length > 0) {
        return
      }
      if (this.form.product_id === 1) {
        if (this.form.url === '' || this.form.url === null) {
          this.uriErrors.push('Please enter a spotify uri.')
          return
        }
        if (this.form.url.length > 0) {
          let urlArray = this.form.url.split(':'),
            id = urlArray[urlArray.length - 1],
            params = { id: id }

          if (typeof urlArray[1] !== undefined) {
            let type = urlArray[1]
            if (type === 'user' || type === 'artist' || type === 'playlist') {
              params.type = type
              let spotifyValidateResponse = await Vue.$http.post(`v1/spotify/validate-uri`, params)
              if (spotifyValidateResponse.data.success === false) {
                this.uriErrors.push('This spotify URL does not exist. Please enter a valid spotify URL')
                return
              }
            } else {
              this.uriErrors.push('This spotify URL does not exist. Please enter a valid spotify URL')
              return
            }
          }
        }
      }
      this.$emit('set-form', this.form)
      this.$emit('next-step')
    },
    validURL (str) {
      let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
      return !!pattern.test(str)
    },
    setSpotifyString () {

      if (this.form.product_id === 1) {
        this.form.url = ''
        if (this.spotifyUrl && this.validURL(this.spotifyUrl)) {
          const url = new URL(this.spotifyUrl)
          let pathname = url.pathname
          let pathArr = pathname.split('/')
          pathArr = pathArr.filter(Boolean)

          this.form.url = `spotify:${pathArr.join(':')}`
        }
      }
    }
  }
}
</script>

<style scoped>
.disabled {
  background-color: #d3d3d3;
}
</style>
