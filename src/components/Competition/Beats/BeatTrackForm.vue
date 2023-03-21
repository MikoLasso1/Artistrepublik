<template>
  <div>
    <v-form ref="form" @submit.prevent v-model="valid">
      <div>
        <validation-errors :errors="validationErrors" />
        <v-alert v-show="success" border="left" color="success">Success! Your song has been entered.</v-alert>
      </div>
      <v-text-field
        v-model="artist_name"
        :rules="artistNameRules"
        label="Artist Name"
        required
        class="required"
      ></v-text-field>
      <v-text-field
        v-model="form.song_name"
        :rules="beatNameRules"
        label="Beat Name"
        class="required"
      ></v-text-field>
      <v-radio-group v-model="embedOrLink">
        <v-radio
          label="Embed (recommended)"
          :value="1"
        ></v-radio>
        <v-radio
          label="Link to Song"
          :value="2"
        ></v-radio>
      </v-radio-group>
      <v-textarea
        v-model="form.song_embed_code"
        :value="form.song_embed_code"
        :rules="embedRules"
        name="Embed Code"
        label="Paste Soundcloud Embed Code"
        v-if="embedOrLink === 1"
      ></v-textarea>
      <v-text-field
        v-model="form.song_link"
        :rules="beatLinkRules"
        label="Beat Link"
        class="required"
        v-if="embedOrLink === 2"
      ></v-text-field>
      <v-row v-if="embedOrLink === 1">
        <v-col cols="12">
          <p>How do I find my SoundCloud embed code?&nbsp;
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-information
                </v-icon>
              </template>
              <span>
          <div class="embed_code_instruction" v-if="embedOrLink === 1">
            <ul class="mt-2 ml-3">
              <ol>Go to soundcloud.com</ol>
              <ol>Select the song you wish to use.</ol>
              <ol>Click "share"</ol>
              <ol>In the popup widget, on the top click "embed"</ol>
              <ol>Once in the embed tab, select the code and copy</ol>
              <ol>Paste into the Artist Republik widget where instructed and continue.</ol>
            </ul>
          </div>
          </span>
          </v-tooltip>
          </p>
        </v-col>
      </v-row>
      <v-checkbox
        v-model="policy"
        :rules="policyRules"
        value="1"
        type="checkbox"
        required
      >
        <div slot="label">
          I agree with the
          <router-link to="/privacy">Privacy Policy</router-link>
          and
          <router-link to="/tos">Terms of Service</router-link>
        </div>
      </v-checkbox>
      <div class="text-center">
        <v-btn
          color="primary"
          type="submit"
          :disabled="loading || policy === false"
          @click="onSubmit()"
        >Enter Now
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import validationErrorsMixin from '@/shared/mixins/ValidationErrorsMixin'
import Vue from 'vue'

export default {
  mixins: [validationErrorsMixin],
  props: {
    details: {
      type: Object,
      default: function () {
        return {
          valid: true,
          id: null,
          song_name: null,
          song_embed_code: null,
          genre_id: null,
          song_promotion_link: null,
          song_link: null
        }
      }
    },
    competition: {
      type: Object
    },
    showArtistNameField: {
      default: false,
      type: Boolean
    },
    embedOrLinkDb: {
      default: 1,
      type: [Number, String]
    }
  },
  data () {
    return {
      artistNameRules: [
        v => !!v || 'Artist Name is required',
        v => (v && v.length >= 3) || 'Must be greater than 3 characters'
      ],
      beatNameRules: [
        v => !!v || 'Beat Name is required',
        v => (v && v.length >= 3) || 'Must be greater than 3 characters'
      ],
      embedRules: [
        v => !!v || 'Embed Code Required',
        v => /<iframe.*soundcloud/.test(v) || 'Code must be valid SoundCloud embed.'
      ],
      beatLinkRules: [
        v => !!v || 'Song Link Required'
      ],
      policyRules: [
        v => !!v || 'Acceptance of Privacy Policy and Terms required'
      ],
      embedOrLink: this.embedOrLinkDb,
      policy: false,
      loading: null,
      artist_name: null,
      form: {
        id: this.details.id,
        song_name: this.details.song_name,
        song_embed_code: this.details.song_embed_code,
        genre_id: this.details.genre_id,
        song_promotion_link: this.details.song_promotion_link,
        song_link: this.details.song_link
      },
      success: false,
      errorMessage: 'An Error has occured',
      genres: null
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.loading = true
      this.success = false
      this.validationErrors = []
      Vue.$http
        .post(`v1/competition/${this.competition.slug}/song`, {
          genre_id: 1,
          song_name: this.form.song_name,
          song_embed_code: this.form.song_embed_code,
          embed_or_link: this.embedOrLink,
          song_link: this.form.song_link,
          artist_name: this.artist_name
        })
        .then(() => {
          this.success = true
          this.buttonText = 'Update Song'
          this.$emit('track-success')
        })
        .catch(error => {
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
          console.log(error)
        })
    }
  },
  mounted () {
    this.getCompetitionGenres()
  }
}
</script>
