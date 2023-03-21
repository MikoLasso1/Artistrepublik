<template>
  <div>
    <div ref="stepOne">
      <div class="card-body">
        <v-form ref="form" @submit.prevent v-model="valid">
          <div>
            <validation-errors :errors="validationErrors" />
          </div>
          <v-row>
            <v-col cols="12">
              <DistributionArtistForm
                artist-type="Primary"
                :artists="form.primary_artist"
                :artist-data="form.primary_artist"
                @save-artist="savePrimary($event)"
                :artist-roles="artistRoles"
              />
            </v-col>
          </v-row>

          <v-text-field v-model="form.release_title" :rules="releaseTitleRules" class="required" placeholder="The title of your musical monument">
            <template v-slot:label>
              Release Title
            </template>
          </v-text-field>

          <v-radio-group v-model="form.is_title_english">
            <template v-slot:label>
              Is your release title in english? <strong class="red--text">*</strong>
            </template>
            <v-radio v-for="n in booleanOptions" :key="n.value" :label="n.text" :value="n.value" />
          </v-radio-group>

          <v-text-field
            v-if="!form.is_title_english"
            v-model="form.english_release_title"
            :rules="englishTitleRules"
            label="English translation of release title"
            class="required"
            placeholder="The english translation of your musical monument"
          />

          <v-checkbox
            v-model="form.custom_label"
            :false-value="0"
            :true-value="1"
            label="I want to use a custom label ($1)"
            @change="onCustomLabelCheckboxChange"
          />

          <v-text-field
            v-if="form.custom_label"
            v-model="form.label"
            :rules="labelRules"
            label="Label"
            :disabled="!form.custom_label"
            class="required"
          />

          <div class="pb-2" style="border: 1px dashed gray; padding: 10px;">
            <strong> Upload Your Artwork:</strong>
            <div class="pb-3 pt-3">
              <strong> Step 1 </strong>: Upload your image
            </div>
            <p class="text-danger">
              * No logos or other copyrighted material permitted on cover artwork
            </p>
            <div class="button-wrapper">
              <v-file-input
                v-model="file"
                accept="image/*"
                label="Select Image"
                ref="file"
                @change="loadImage($event)"
              />
            </div>
            <cropper
              class="upload-example-cropper"
              :src="image"
              ref="cropper"
              :stencil-props="{
                handlers: {},
                movable: false,
                scalable: false,
              }"
              :stencil-size="{
                width: 400,
                height: 400
              }"
              image-restriction="stencil"
            />
            <div class="pb-3 pt-3" v-if="file">
              <strong>Step 2: </strong> Crop Your Image: Use the cropper above
              to crop your image to a square. Use your mouse wheel to zoom in and out if needed. When you are ready hit "Crop" to
              see a preview.
            </div>

            <div class="text-center pt-3">
              <v-btn color="purple" dark @click="uploadImage" v-if="file">
                Crop This Image
              </v-btn>
            </div>
            <div class="text-center pt-3" v-if="imagePreview">
              <strong> Image Preview:</strong>
              <v-img max-height="150" max-width="150" :src="imagePreview" id="previewArt" class="pointer text-center" alt="New Release Artwork" loading="lazy" />
            </div>
            <v-btn v-if="release" text id="previewArt" color="purple" dark @click="previewArtWork">
              Preview
            </v-btn>
          </div>
          <v-select
            v-model="form.genre"
            :items="genres"
            :rules="[v => !!v || 'Genre is required']"
            label="Genre"
            item-text="name"
            item-value="id"
            class="required"
            ref="genre"
          />

          <v-select
            v-model="form.sub_genre"
            :items="subGenres"
            :rules="[v => !!v || 'Sub Genre is required']"
            label="Sub Genre"
            item-text="name"
            item-value="id"
            class="required"
          />

          <v-radio-group v-model="form.release_type">
            <template v-slot:label>
              Release Type <strong class="red--text">*</strong>
            </template>
            <v-radio
              v-for="n in releaseTypeOptions"
              :key="n.value"
              :label="n.text"
              :value="n.value"
            />
          </v-radio-group>

          <v-radio-group v-model="form.release_previously_distributed">
            <template v-slot:label>
              Has this release been previously distributed? <strong class="red--text">*</strong>
            </template>
            <v-radio
              v-for="n in booleanOptions"
              :key="n.value"
              :label="n.text"
              :value="n.value"
            />
          </v-radio-group>
          <p v-if="form.release_previously_distributed" class="text-red">*Provide UPC code to track past streams and royalties. If no UPC provided, tracking will begin at 0</p>

          <v-text-field
            v-if="form.release_previously_distributed"
            v-model="form.release_upc"
            label="Release UPC"
            :rules="upcIsrcRules"
            placeholder="Add your release UPC"
          ></v-text-field>

          <v-menu
            v-if="form.release_previously_distributed"
            ref="menu2"
            v-model="menu2"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="previousDateFormatted"
                label="Prior Release Date"
                hint="MM/DD/YYYY format"
                persistent-hint
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
              >
                <template v-slot:append>
                  <v-tooltip top max-width="300">
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on"> mdi-help-circle-outline</v-icon>
                    </template>
                    Select original release date and this will be the date shown
                    on Digital Streaming Platforms (DSPs).
                  </v-tooltip>
                </template>
              </v-text-field>
            </template>

            <v-date-picker
              v-model="form.previous_release_date"
              no-title
              min="1900-01-01"
              :max="maxDate"
              @change="menu2 = false"
            />
          </v-menu>

          <v-menu
            v-if="!form.release_previously_distributed"
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
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
              >
                <template v-slot:append>
                  <v-tooltip top max-width="300">
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">
                        mdi-help-circle-outline
                      </v-icon>
                    </template>
                    Select the date this release should go on sale (at least 2 weeks from today).<br>
                    If the original release date is in the past, send us an email at <a href="mailto:support@artistrepublik.com">support@artistrepublik.com</a> and this will be the date shown on
                    Digital Streaming Platforms (DSPs).
                  </v-tooltip>
                </template>
              </v-text-field>
            </template>
            <v-date-picker
              v-model="form.release_date"
              no-title
              @input="menu1 = false"
              :min="min"
            />
          </v-menu>
          <v-select
            v-model="form.release_country"
            :items="countryList"
            label="Release Country"
            item-text="text"
            item-value="value"
          >
            <template v-slot:append>
              <v-tooltip top max-width="300">
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on">
                    mdi-help-circle-outline
                  </v-icon>
                </template>
                The country from which you are releasing.
              </v-tooltip>
            </template>
          </v-select>

          <v-text-field
            v-model="form.copyrights"
            label="Copyright Owner(s)"
            placeholder="Artist's name is copyright holder as default"
            :rules="copyrightRules"
            required
            class="required"
          >
            <template v-slot:append>
              <v-tooltip top max-width="300">
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on">
                    mdi-help-circle-outline
                  </v-icon>
                </template>
                The name of the individual / company who is legally authorized to sell this music. If you are not the copyright holder, you must have obtained a license from the rights holder in order
                to distribute their work nad be able to provide proof. This information may be displayed publicly.
              </v-tooltip>
            </template>
          </v-text-field>

          <v-btn :disabled="loading || valid === false" :loading="loading" color="primary" @click="onSubmit">
            Continue
          </v-btn>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import Vue from 'vue'
import { countryList } from '@/store/modules/utils/countries'
import validationErrorsMixin from '@/shared/mixins/ValidationErrorsMixin'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import DistributionArtistForm from '@/components/Distribution/Modal/DistributionArtistForm.vue'

export default {
  mixins: [validationErrorsMixin],
  props: {
    release: Object,
    artistName: {
      type: String,
      default: '',
    },
    artistRoles: {
      type: Array,
      default () {
        return []
      },
    },
  },
  components: {
    Cropper,
    DistributionArtistForm,
  },
  data () {
    return {
      form: this.getFormData(),
      releaseTypeOptions: [
        { text: 'Single Release', value: 'Release' },
        { text: 'Album', value: 'Album' },
        { text: 'Mixtape/EP', value: 'Mix' },
      ],
      booleanOptions: [
        { text: 'Yes', value: 1 },
        { text: 'No', value: 0 },
      ],
      max: '',
      isValidFileSize: null,
      loading: null,
      errors: null,
      countryList: countryList,
      valid: true,
      file: null,
      specialCharRules: [
        v => /^(["'`,:;=|<.^()A-Za-z0-9\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/.test(v) || 'Special characters are not allowed',
      ],
      upcIsrcRules: [
        (v) => (v && v.length === 12) || 'Your code must be 12 characters',
      ],
      urlRules: [
        v => {
          if (v) {
            return (
              /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?)/gi.test(v) || 'Link must be valid'
            )
          } else {
            return true
          }
        }],
      copyrightRules: [
        v => !!v || 'Copyright is required',
        v => (v && v.length >= 3) || 'Must be greater than 3 characters',
        v => /^(["'`,:;=|<.^()A-Za-z0-9\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/.test(v) || 'Special characters are not allowed',
      ],
      releaseTitleRules: [
        v => !!v || 'Release Title is required',
        v => (v && v.length >= 3) || 'Must be greater than 3 characters',
        v => /^(["'`,:;=|<.^()A-Za-z0-9\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/.test(v) || 'Special characters are not allowed',
      ],
      englishTitleRules: [
        v => (v && v.length >= 3) || 'Must be greater than 3 characters',
        v => /^(["'`,:;=|<.^()A-Za-z0-9\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/.test(v) || 'Special characters are not allowed',
        v => {
          if (this.form.is_title_english) {
            return !!v || 'English translation is required.'
          } else {
            return true
          }
        },
      ],
      catNumberRules: [
        v => !!v || 'Cat# is required',
      ],
      labelRules: [
        v => (v && v.length >= 3) || 'Must be greater than 3 characters',
        v => {
          if (this.form.custom_label) {
            return !!v || 'Label name is required for a custom label.'
          } else {
            return true
          }
        },
      ],
      artWorkFileRule: [
        v => {
          if (this.release === null) {
            return !!v || 'Art Work is required.'
          } else {
            return true
          }
        },
      ],
      menu1: false,
      menu2: false,
      image: null,
      imageJson: null,
      secondayAritistData: null,
      counter: 0,
    }
  },
  computed: {
    ...mapGetters({
      genres: 'getGenres',
      subGenres: 'getSubGenres',
      tracks: 'getTracks',
      distributionArtistName: 'getDistributionArtistName',
      releases: 'getReleases',
    }),
    copyrightYear () {
      return new Date().getFullYear()
    },
    min () {
      if (moment().isBefore('2021-01-05')) {
        return moment('2021-01-05').format()
      } else {
        return moment().add(2, 'w').format()
      }
    },
    maxDate () {
      return moment().toISOString()
    },
    previousDateFormatted () {
      return this.formatDate(this.form.previous_release_date)
    },
    dateFormatted () {
      return this.formatDate(this.form.release_date)
    },
    imagePreview () {
      if (this.imageJson) {
        return this.imageJson
      } else if (this.release) {
        return this.release.art_work_url
      } else {
        return ''
      }
    },
  },
  watch: {
    copyrightYear (oldVal, newVal) {
      this.form = this.getFormData()
      this.form.copyrights = `${this.artistName} ${newVal}`
    },
    release: function () {
      this.form = this.getFormData()
      this.form.genre = this.genres.filter(v => v.id === this.release.genre.id)[0].id
      this.form.sub_genre = this.subGenres.filter(v => v.id === this.release.sub_genre.id)[0].id
    },
    form: {
      handler (val) {
        if (val.primary_artist) {
          if (this.form.custom_label === 0) {
            this.form.label = val.primary_artist.artist_name
          }
        }
      },
      deep: true,
    },
  },
  mounted: function () {
    if (!this.release) {
      //get cat number
      Vue.$http.get('v1/distribution/release/cat-number').then(response => {
        let data = response.data.data
        this.form.cat_number = data.cat_id
      })
      this.form.copyrights = `${this.copyrightYear} ${this.artistName}`
      this.form.primary_artist.artist_name = this.artistName
    } else {
      this.form = this.getFormData()
    }

    this.$store.dispatch('getGenres')
    this.$store.dispatch('getSubGenres')
  },
  methods: {
    savePrimary (artist) {
      this.form.primary_artist = artist
    },
    editSecondary (artist) {
      this.counter++
      artist.counter = this.counter
      this.secondayAritistData = artist
    },

    onCustomLabelCheckboxChange: function (v) {
      if (!v) {
        this.form.label = ''
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
    },
    getMinDate: function () {
      return moment()
        .add(2, 'w')
        .format('YYYY-MM-DD')
    },
    getFormData: function () {
      return {
        release_title: this.release ? this.release.release_title : '',
        is_title_english: this.release ? parseInt(this.release.is_title_english) : 1,
        english_release_title: this.release ? this.release.english_release_title : '',
        primary_artist: this.getPrimaryArtist(this.release),
        release_previously_distributed: this.release ? parseInt(this.release.release_previously_distributed) : 0,
        release_upc: this.release ? this.release.release_upc : '',
        previous_release_date: this.release ? this.release.previous_release_date : null,
        label: this.release ? this.release.label : '',
        custom_label: this.release ? this.release.custom_label : 0,
        cat_number: this.release ? this.release.cat_number : '',
        art_work_file: null,
        genre: this.release ? this.release.genre.id : '',
        sub_genre: this.release ? this.release.sub_genre.id : '',
        release_type: this.release ? this.release.release_type : 'Release',
        release_date: this.release ? this.release.release_date : this.getMinDate(),
        release_country: this.release
          ? this.release.release_country === null
            ? ''
            : this.release.release_country
          : '',
        copyrights: this.release ? this.release.copyrights : `${this.copyrightYear} ${this.artistName}`,
      }
    },

    getPrimaryArtist (release) {
      let artist = {
        id: null,
        is_primary: 1,
        artist_name: null,
        is_spotify_profile: 0,
        spotify_profile_link: null,
        is_apple_music_profile: 0,
        apple_music_profile_link: null,
        role_id: null,
      }
      if (release) {
        if (typeof release.primary_artist === 'object' && release.primary_artist !== null) {
          return release.primary_artist
        } else {
          artist.artist_name = release.primary_artist
          return artist
        }
      } else {
        return artist
      }
    },

    removeTracks (type) {
      const tracks = this.tracks
      if (type === 'Release' && tracks !== null && tracks.length > 0) {
        tracks.forEach((track, index) => {
          if (index) this.doDelete(track)
        })
      }
    },
    previewArtWork () {
      if (this.release) {
        window.open(this.release.art_work_url, '_blank')
      }
    },
    doDelete (track) {
      Vue.$http
        .delete(`v1/distribution/release/track/${track.id}`)
        .then(() => {
          this.$store.commit('removeTrack', track)
          this.$emit('track-upsert', { id: null })
        })
        .catch(error => console.log(error))
    },
    getValidationState ({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null
    },
    resetForm () {
      this.form = {
        name: null,
        food: null,
      }

      this.$nextTick(() => {
        this.$refs.observer.reset()
      })
    },
    async onSubmit () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.loading = true

      //TODO check valid
      let formData = new FormData()
      for (let key in this.form) {
        let value = this.form[key]
        if (this.form[key] === null) {
          continue
        }
        if (key === 'primary_artist') {
          value = JSON.stringify(this.form[key])
        }
        formData.append(key, value)
      }
      let url = 'v1/distribution/release'
      if ((this.release !== null) && (typeof this.release !== 'undefined')) {
        url += `/${this.release.id}`
        formData.append('_method', 'PUT')
      }
      Vue.$http({
        method: 'POST',
        url: url,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(response => {
        this.$store.commit('setRelease', response.data.data)
        this.$emit('release-created', response.data.data)
        this.$emit('next-step')
      }).catch(error => {
        this.errors = true
        let items
        if (error.response && error.response.status === 400) {
          items = Object.values(error.response.data.data.message)
        } else if (error.response && error.response.status === 422) {
          items = Object.values(error.response.data.errors)
        }

        this.validationErrors = this.formatErrors(items)
        this.$refs.stepOne.scrollIntoView()
      }).then(() => (this.loading = false))
    },
    loadImage () {
      if (this.file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.image = e.target.result
        }
        reader.readAsDataURL(this.file)
      }
    },
    uploadImage () {
      const { canvas } = this.$refs.cropper.getResult()
      if (canvas) {
        this.imageJson = canvas.toDataURL()
        canvas.toBlob(blob => {
          this.form.art_work_file = blob
        }, 'image/jpeg')
      }
    },
  },
}
</script>
<style lang="scss">
.v-input__slot > label {
  margin-bottom: 0;
}

#previewArt {
  margin-bottom: 15px;
}

.v-messages__message {
  line-height: 16px;
}
</style>
