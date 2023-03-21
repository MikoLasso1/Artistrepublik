<template>
  <div>
    <v-form ref="form" @submit.prevent v-model="valid">
      <v-text-field v-model="form.artist_name" :rules="artistNameRules" label="Artist Name" required class="required" />
      <v-text-field v-model="form.song_name" :rules="songNameRules" label="Song Name" class="required" />
      <v-select v-model="form.genre_id" :items="genres" :rules="[v => !!v || 'Genre is required']" label="Genre" class="required" />
      <v-text-field v-model="form.song_link" :rules="songLinkRules"
                    label="Paste Your Song Link" persistent-hint
                    hint="Where your your song is hosted.  Examples: YouTube, Spotify Song URL, SoundCloud Song URL, AudioMack"
                    class="required" />
      <v-alert
        border="top"
        colored-border
        type="info"
        elevation="2"
        class="mt-4"
        v-if="form.song_link !== '' && form.song_link != null"
      >
        Below is a preview of what your song will look like on the link you will share to get votes.
      </v-alert>
      <PreviewSong :songLink="form.song_link"></PreviewSong>

      <v-checkbox v-model="policy" :rules="policyRules" type="checkbox" required>
        <div slot="label">
          I agree with the
          <router-link to="/privacy">Privacy Policy</router-link>
          and
          <router-link to="/tos">Terms of Service</router-link>
        </div>
      </v-checkbox>

      <v-btn color="primary" class="mt-4" type="submit" :loading="loading" :disabled="loading === true || valid === false" @click="onSubmit">
        {{ buttonText }}
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import validationErrorsMixin from '@/shared/mixins/ValidationErrorsMixin'
import PreviewSong from '@/components/Competition/PreviewSong'

import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    PreviewSong,
  },
  mixins: [validationErrorsMixin],
  props: {
    hasSong: Boolean,
    details: {
      type: Object,
      default: function () {
        return {
          valid: true,
          id: null,
          song_name: null,
          genre_id: null,
          song_promotion_link: null,
          song_link: null,
          artist_name: null,
        }
      },
    },
    competition: {
      type: Object,
    },
    showArtistNameField: {
      default: false,
      type: Boolean,
    },
  },
  data () {
    return {
      valid: false,
      policy: false,
      loading: false,
      preview_song_link: null,
      username: this.$route.params.username,
      form: {
        id: this.details.id,
        song_name: this.details.song_name,
        genre_id: this.details.genre_id,
        song_promotion_link: this.details.song_promotion_link,
        song_link: this.details.song_link,
        artist_name: this.details.artist_name,
      },
      success: false,
      errorMessage: 'An Error has occured',
      genres: [],
      artistNameRules: [
        v => !!v || 'Artist Name is required',
        v => (v && v.length >= 3) || 'Must be greater than 3 characters',
      ],
      songNameRules: [
        v => !!v || 'Song Name is required',
        v => (v && v.length >= 3) || 'Must be greater than 3 characters',
      ],
      embedRules: [
        v => !!v || 'Embed Code Required',
        v => /<iframe.*soundcloud/.test(v) || 'Code must be valid SoundCloud embed.',
      ],
      songLinkRules: [
        v => !!v || 'Song Link Required',
      ],
      policyRules: [
        v => !!v || 'Policy Required',
      ],
    }
  },
  computed: {
    ...mapGetters({
      user: 'getUser',
      settings: 'getSettings',
    }),
    ...mapMutations({
      updateArtistName: 'updateArtistName',
    }),
    buttonText () {
      if (this.hasSong) {
        return 'Update My Entry'
      } else {
        return 'Submit My Entry'

      }
    },
  },
  methods: {
    previewSong () {
      this.$root.$emit('updateLiveArtistMedia')
    },
    setFormFromSettings () {
      this.form.artist_name = this.settings.account.general.artist_name
    },
    onSubmit () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.loading = true
      this.success = false
      this.validationErrors = []
      Vue.$http.post(`v1/competition/${this.competition.slug}/song`, {
        genre_id: this.form.genre_id,
        song_name: this.form.song_name,
        song_link: this.form.song_link,
        artist_name: this.form.artist_name,
      }).then(() => {
        this.success = true
        this.$emit('track-success')
        this.$store.dispatch('fetchSettings')
      }).catch(error => {
        let items
        if (error.response.status === 400) {
          items = Object.values(error.response.data.data.message)
          this.validationErrors = this.formatErrors(items)
        } else if (error.response.status === 403) {
          this.validationErrors.push(error.response.data)
        }
      }).then(() => (this.loading = false))

    },
    getCompetitionGenres () {
      Vue.$http
        .get(`v1/competition/genres`)
        .then(response => {
          this.genres = response.data.data
        })
        .catch(error => {
          this.$sentry.captureException(error)
        })
    },
  },
  mounted () {
    this.getCompetitionGenres()
    this.setFormFromSettings()
  },
}
</script>
