<template>
  <v-dialog v-model="dialog" max-width="350" scrollable persistent>
    <v-card :loading="loading">
      <v-card-title class="dark primary">Request to Edit Release</v-card-title>
      <v-card-text v-show="! requestSubmitted">
        You requested to edit the release
        <strong>{{ title }}</strong>.
        Please select the edit you would like to request and we will forward the request to our distribution team who will help you edit and perfect your releases.
        <v-form v-model="valid" ref="form">
          <v-select
            v-model="reason"
            :items="reasons"
            :rules="reasonRule"
            label="Reason"
            item-text="name"
            item-value="id"
            class="required"
            ref="genre"
          ></v-select>
          <v-select
            v-if="reason === 'Wrong/Update song file' || reason === 'Wrong song name'"
            v-model="track"
            :items="tracks"
            :rules="trackRule"
            label="Track"
            item-text="name"
            item-value="id"
            class="required"
            ref="genre"
          ></v-select>
          <v-textarea
            v-if="reason === 'Other'"
            :rules="explanationRule"
            v-model="explanation"
            name="explanation"
            placeholder="Why do you want to edit this release?"
            hint="Why do you want to edit this release?"
          ></v-textarea>
          <v-file-input
            v-if="reason === 'Wrong/Update song file'"
            label="Audio File"
            v-model="file"
            :rules="audioFileRules"
            accept="audio/wav,audio/x-wav,audio/mpeg,audio/mp3"
            class="required"
          ></v-file-input>
          <p class="text-info" v-if="reason === 'Wrong/Update song file'">MP3 uploads may experience slight distortion, please use WAV if possible.</p>
          <v-text-field
            v-if="reason === 'Wrong song name'"
            v-model="songName"
            :rules="trackTitleRules"
            label="Song Name"
            class="required"
            placeholder="The correct title of your musical monument"
          ></v-text-field>
          <v-textarea
            v-if="reason ===  'Wrong song credits'"
            :rules="creditRule"
            v-model="credits"
            name="credits"
            placeholder="What credits were incorrect? What is the correct information?"
            hint="What credits were incorrect? What is the correct information?"
          ></v-textarea>
          <div
            class="pb-2"
            style="border: 1px dashed gray; padding: 10px;"
            v-if="reason ===  'Wrong cover art'"
          >
            <strong> Upload Your New Artwork:</strong>
            <div class="pb-3 pt-3">
              <strong> Step 1 </strong>: Upload your new image
            </div>
            <p
              class="text-danger"
            >
              *No logos or other copyrighted material permitted on cover artwork
            </p>
            <div class="button-wrapper">
              <v-file-input
                v-model="artFile"
                accept="image/*"
                label="Select Image"
                ref="file"
                @change="loadImage($event)"
              ></v-file-input>
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
            <div class="pb-3 pt-3" v-if="image">
              <strong>Step 2: </strong> Crop Your Image: Use the cropper above
              to crop your image to a square. Use your mouse wheel to zoom in and out if needed. When you are ready hit "Crop" to
              see a preview.
            </div>
            <div class="text-center pt-3">
              <v-btn
                color="purple" dark @click="uploadImage" v-if="image"
              >Crop This Image
              </v-btn
              >
            </div>
            <div class="text-center pt-3" v-if="imagePreview">
              <strong> Image Preview:</strong>
              <v-img
                max-height="150"
                max-width="150"
                :src="imagePreview"
                id="previewArt"
                class="pointer text-center"
                alt="New Release Artwork" loading="lazy"
              ></v-img>
            </div>
          </div>
          <v-menu
            ref="menu1"
            v-model="menu1"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
            v-if="reason ===  'Wrong release date'"
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
                  <v-tooltip
                    top
                    max-width="300"
                  >
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">
                        mdi-help-circle-outline
                      </v-icon>
                    </template>
                    Select the date this release should go on sale (at least 2 weeks from today).<br>If the original release date is in the past, send us an email at <a
                    href="mailto:support@artistrepublik.com"
                  >support@artistrepublik.com</a> and this will be the date shown on Digital Streaming Platforms (DSPs).
                  </v-tooltip>
                </template>
              </v-text-field>
            </template>
            <v-date-picker
              v-model="releaseDate"
              no-title
              @input="menu1 = false"
              :min="min"
            ></v-date-picker>
          </v-menu>
        </v-form>
      </v-card-text>
      <v-card-text v-show="requestSubmitted">
        Your request has been received and is queued for processing.
        Please allow up to 48 hours for the request to be processed.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-show="! requestSubmitted" text color="red" @click="requestEdit">Edit</v-btn>
        <v-btn v-show="! requestSubmitted" text color="secondary" @click="closeModal">Cancel</v-btn>
        <v-btn v-show="requestSubmitted" text color="primary" @click="closeModal">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import validationErrorsMixin from '../../../shared/mixins/ValidationErrorsMixin'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

export default {
  mixins: [validationErrorsMixin],
  components: {
    Cropper
  },
  data: function () {
    return {
      dialog: false,
      selected: null,
      loading: false,
      reason: '',
      track: '',
      explanation: '',
      reasons: ['Wrong/Update song file', 'Wrong song name', 'Wrong song credits', 'Wrong release date', 'Wrong cover art', 'Other'],
      release: {},
      valid: true,
      requestSubmitted: false,
      file: null,
      songName: null,
      credits: null,
      artFile: null,
      image: null,
      imageJson: null,
      menu1: false,
      releaseDate: null,
      reasonRule: [
        v => !!v || 'A Reason for Editing is required'
      ],
      explanationRule: [
        v => (!!v && this.reason === 'Other') || (!v && this.reason !== 'Other') || 'Please provide an explanation'
      ],
      trackRule: [
        v => (!!v && this.reason === 'Wrong/Update song file') || (!!v && this.reason === 'Wrong song name') || (!v && this.reason !== 'Wrong/Update song file' && this.reason !== 'Wrong song name') || 'Please provide an explanation'
      ],
      audioFileRules: [
        v => !!v || 'Audio file is required'
      ],
      trackTitleRules: [
        v => !!v || 'Track Title is required',
        v => (v && v.length >= 3) || 'Must be greater than 3 characters'
      ],
      creditRule: [
        v => (!!v && this.reason === 'Wrong song credits') || (!v && this.reason !== 'Wrong song credits') || 'Please provide details about your request.'
      ]
    }
  },

  computed: {
    title: function () {
      return (this.release || {}).release_title || ''
    },
    tracks: function () {
      if (this.release) {
        return this.release.tracks.map(track => track.track_title)
      } else {
        return []
      }
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
    min () {
      return moment(this.release.release_date).format()
    },
    dateFormatted () {
      return this.formatDate(this.releaseDate)
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

    loadImage () {
      if (this.artFile) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.image = e.target.result
        }
        reader.readAsDataURL(this.artFile)
      }
    },

    uploadImage () {
      const { canvas } = this.$refs.cropper.getResult()
      if (canvas) {
        this.imageJson = canvas.toDataURL()
        canvas.toBlob(blob => {
          this.artFile = blob
        }, 'image/jpeg')
      }
    },

    onAudioFile: function () {
      this.audio_file = this.$refs.audio_file.files[0]
    },

    readFile: function (file) {
      return new Promise((resolve) => {
        let audio = document.createElement('audio')
        let reader = new FileReader()

        reader.onload = function (e) {
          audio.src = e.target.result
          audio.addEventListener('loadedmetadata', function () {
            let duration = audio.duration
            let status = ((duration / 60).toFixed(2) <= 10)
            resolve(status)
          }, false)
        }

        reader.readAsDataURL(file)
      })
    },

    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },

    requestEdit: async function () {

      let formData = new FormData()
      formData.append('reason', this.reason)
      //let params = {reason: this.reason};

      if (this.release === {}) {
        return
      }

      this.$refs.form.validate()


      if (this.reason === 'Other') {
        formData.append('explanation', this.explanation)
      } else if (this.reason === 'Wrong/Update song file') {
        //TODO Proper property name to submit new file
        // add logic for actual file upload.
        formData.append('track', this.track)
        let audioDurationStatus = await this.readFile(this.file)
        if (!audioDurationStatus) {
          this.$refs.form.inputs[1].errorBucket.push('Track duration must be less than 10 mins')
          this.valid = false
        } else {
          formData.append('audio_file', this.file)
        }
      } else if (this.reason === 'Wrong song name') {
        //TODO Proper property name to submit new song name
        formData.append('track', this.track)
        formData.append('song_name', this.songName)
      } else if (this.reason === 'Wrong cover art') {
        //TODO Proper property name to submit new art file
        formData.append('track', this.track)
        formData.append('art_work_file', this.artFile)
      } else if (this.reason === 'Wrong release date') {
        formData.append('release_date', this.dateFormatted)
      } else if (this.reason === 'Wrong song credits') {
        formData.append('credits', this.credits)
      }

      if (!this.valid) {
        return
      }

      this.loading = true

      try {
        await Vue.$http({
          method: 'POST',
          url: `v1/distribution/release/edit/${this.release.id}`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } catch (err) {
        this.throwError(err)
      }

      this.loading = false
      this.requestSubmitted = true
      this.$emit('after-edit')
    }
  }
}
</script>
<style>
#previewArt {
  margin-bottom: 15px;
}
</style>
