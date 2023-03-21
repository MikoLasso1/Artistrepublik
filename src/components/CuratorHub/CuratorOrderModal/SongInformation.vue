<template>
  <div>
    <v-form ref="form" @submit.prevent v-model="valid">
      <v-text-field
        v-model="track_name"
        :rules="trackTitleRules"
        label="Track Name"
        class="required"
        placeholder="The title of your musical monument"
      ></v-text-field>
      <v-text-field
        v-model="track_url"
        :rules="trackLinkRules"
        label="Track Link"
        class="required"
        placeholder="https://open.spotify.com/track/53CJANUxooaqGOtdsBTh7O"
      ></v-text-field>
      <v-select
        v-model="genre_id"
        :items="genres"
        :rules="[v => !!v || 'Genre is required']"
        label="Genre"
        item-text="name"
        item-value="id"
        class="required"
      ></v-select>
      <v-row class="my-2">
        <v-btn
          type="submit"
          color="error"
          :disabled="loading"
          @click="onBack"
        >
          <span v-if="!loading">Back</span>
          <span v-if="loading">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular> Processing...
          </span>
        </v-btn>
        <v-spacer />
        <v-btn
          type="submit"
          color="success"
          :disabled="loading"
          @click="onContinue"
        >
          <span v-if="!loading">Continue</span>
          <span v-if="loading">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular> Processing...
          </span>
        </v-btn>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import validationErrorsMixin from '../../../shared/mixins/ValidationErrorsMixin'

export default {
  mixins: [validationErrorsMixin],
  props: {
    track: Object
  },
  data: function () {
    return {
      valid: true,
      track_name: this.track ? this.track.name : '',
      track_url: this.track ? this.track.url : '',
      genre_id: null,
      loading: null,
      trackTitleRules: [
        v => !!v || 'Track Name is required',
        v => /^(["'`,:;=|<.^()A-Za-z0-9\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/.test(v) || 'Special characters are not allowed'
      ],
      trackLinkRules: [
        v => !!v || 'You must provide a link.',
        v => /^(https:\/\/open\.spotify\.com\/)(.+)$/.test(v) || 'Please provide a valid Spotify link.'
      ]
    }
  },
  computed: {
    ...mapGetters({
      genres: 'CuratorGenres/getGenres'
    })
  },
  watch: {
    genres: function () {
      if (this.track) {
        this.genre_id = this.genres.filter(v => v.name === this.track.genre)[0].id
      }
    }
  },
  created: function () {
    if (this.genres.length === 0) {
      this.$store.dispatch('CuratorGenres/getGenres')
    } else if (this.track && this.genres.length > 0) {
      this.genre_id = this.genres.filter(v => v.name === this.track.genre)[0].id
    }
  },
  methods: {
    onContinue: async function () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      let data = {
        name: this.track_name,
        url: this.track_url,
        genre_id: this.genre_id
      }
      let url = 'v1/service/playlist-republik/curator/user-track'
      if (this.track !== null) {
        url += `/${this.track.uuid}`
        data['_method'] = 'PUT'
      }
      try {
        let { data: { data: track } } = await Vue.$http.post(url, data)
        track.genre_id = this.genre_id
        let { data: { data: cart } } = await Vue.$http.post(`v1/service/playlist-republik/curator/user-track/cart/${track.uuid}`)
        this.$emit('track-info', { ...track, key: cart.key })
      } catch (err) {
        let items
        if (err.response.status === 400) {
          items = Object.values(err.response.data.data.message)
        } else if (err.response.status === 422) {
          items = Object.values(err.response.data.errors)
        }
        this.validationErrors = this.formatErrors(items)
      }
      this.$emit('next-step')
    },
    onBack () {
      this.$emit('back-step')
    }
  }
}
</script>

<style>

</style>
