<template>
  <v-dialog v-model="dialog" width="700px" ref="dialog">
    <v-card :loading="loading">
      <v-card-title class="headline">
        {{ uuid ? `Edit Beat` : `Add Beat` }}
        <v-spacer />
        <v-btn text @click="closeModal">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-alert v-if="error" color="warning">{{ error }}</v-alert>
        <v-alert v-if="success" color="success">Beat saved successfully.</v-alert>
        <div>
          <validation-errors :errors="validationErrors"></validation-errors>
        </div>
        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSubmit">
          <v-text-field
            v-model="form.name"
            label="Name"
            :rules="rules.name"
          ></v-text-field>
          <v-textarea
            v-model="form.description"
            label="Description"
            :rules="rules.description"
          ></v-textarea>
          <v-row>
            <v-col md="6" cols="12">
              <v-select
                v-model="form.sound_genre_id"
                label="Genre"
                :loading="genresLoading"
                :items="genres.genres.map(g=>({value:g.id,text:g.name}))"
                :reduce="genre => genre.id"
                :rules="rules.sound_genre_id"
              ></v-select>
            </v-col>
            <v-col md="6" cols="12">
              <v-select
                v-model="form.sound_sub_genre_id"
                label="Sub Genre"
                :loading="genresLoading"
                :items="genres.sub_genres.map(g=>({value:g.id,text:g.name}))"
                :reduce="genre => genre.id"
                :rules="rules.sound_sub_genre_id"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="6" cols="12">
              <v-select
                v-model="form.track_type_id"
                label="Track Type"
                :loading="trackTypesLoading"
                :items="trackTypes.map(g=>({value:g.id,text:g.name.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}))"
                :reduce="trackType => trackType.id"
                :rules="rules.track_type_id"
              ></v-select>
            </v-col>
            <v-col md="6" cols="12">
              <v-text-field
                v-model="form.bpm"
                label="BPM"
                :rules="rules.bpm"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="6" cols="12">
              <v-select
                v-model="form.mood_type_ids"
                label="Moods"
                :loading="moodTypesLoading"
                :items="moods.map(g=>({value:g.id,text:g.name.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}))"
                :reduce="mood => mood.id"
                :rules="rules.mood_type_ids"
                multiple
              ></v-select>
            </v-col>
            <v-col md="6" cols="12">
              <v-combobox
                v-model="form.style_types"
                label="Styles"
                class="style-box"
                chips
                :loading="stylesLoading"
                :items="styles.map(g=>g.name)"
                multiple
              >
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip
                    v-bind="attrs"
                    :input-value="selected"
                    close
                    @click="select"
                    @click:close="removeStyle(item)"
                  >
                    <strong>{{ item }}</strong>
                  </v-chip>
                </template>
              </v-combobox>
            </v-col>
          </v-row>
          <v-combobox
            v-model="form.tags"
            chips
            clearable
            label="Add Hash Tags"
            multiple
          >
            <template v-slot:selection="{ attrs, item, select, selected }">
              <v-chip
                v-bind="attrs"
                :input-value="selected"
                close
                @click="select"
                @click:close="removeTag(item)"
              >
                <strong>{{ item }}</strong>
              </v-chip>
            </template>
          </v-combobox>
          <v-checkbox
            v-model="form.is_free_download"
            label="Allow free download (Does not allow usage)"
          ></v-checkbox>
          <h3 class="h3">Attributes</h3>
          <text-value-fields v-model="form.attributes" />
          <h3 class="h3">Files</h3>
          <file-upload-preview-input
            v-model="form.img_file"
            label="Image File (.png)"
            accepts="image/png"
            :upload-id="fileUploadId"
            :location-key="fileUploadLocationKey"
            :url="old.img_url"
            :image="true"
            :audio="false"
            @uploading="onUpload"
            @done-uploading="onDoneUploading"
          />
          <file-upload-preview-input
            v-model="form.audio_file"
            label="Audio File (.wav)"
            accepts="audio/wav"
            :upload-id="fileUploadId"
            :location-key="fileUploadLocationKey"
            :url="old.audio_url"
            @uploading="onUpload"
            @done-uploading="onDoneUploading"
          />
          <file-upload-preview-input
            v-model="form.mp3_audio_file"
            label="Audio File (.mp3)"
            accepts="audio/mpeg"
            :upload-id="fileUploadId"
            :location-key="fileUploadLocationKey"
            :url="old.mp3_url"
            @uploading="onUpload"
            @done-uploading="onDoneUploading"
          />
          <file-upload-preview-input
            v-model="form.stem_file"
            label="Stems (.zip)"
            accepts="application/zip"
            :upload-id="fileUploadId"
            :location-key="fileUploadLocationKey"
            :url="old.stem_url"
            :audio="false"
            @uploading="onUpload"
            @done-uploading="onDoneUploading"
          />
          <h3 class="h3">Pricing</h3>
          <pricing-expansion-panels v-model="form.pricing" class="mb-4" />
          <div class="d-flex">
            <v-spacer></v-spacer>
            <v-btn color="primary" type="submit" :loading="loading">Save</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'
import { defaultPricing } from '@/store/modules/utils/SoundStore/BeatDefaultPricing'
import config from '../../../config'
import FileUploadPreviewInput from '@/components/FileUploadPreviewInput'
import TextValueFields from '@/components/TextValueFields'
import PricingExpansionPanels from '@/components/SoundStore/Manager/PricingExpansionPanels'
import validationErrorsMixin from '@/shared/mixins/ValidationErrorsMixin'

export default {
  mixins: [validationErrorsMixin],
  components: {
    FileUploadPreviewInput,
    TextValueFields,
    PricingExpansionPanels
  },
  data: function () {
    return {
      uuid: null,
      dialog: false,
      loading: false,
      saving: false,
      genresLoading: false,
      trackTypesLoading: false,
      moodTypesLoading: false,
      stylesLoading: false,
      styleSearch: null,
      uploading: {},
      valid: true,
      error: null,
      fileUploadId: config.SOUND_STORE_FILE_UPLOAD_ID,
      fileUploadLocationKey: config.SOUND_STORE_BEAT_FILE_LOCATION_KEY,
      genres: {
        genres: [],
        sub_genres: []
      },
      trackTypes: [],
      moods: [],
      styles: [],
      old: this.getNullOld(),
      form: this.getNullForm(),
      rules: {
        name: [
          v => !!v || 'Name is required',
          v => (v && v.length > 5) || 'Name must be at least 5 characters'
        ],
        description: [
          v => !!v || 'Description is required',
          v => (v && v.length > 20) || 'Description must be at least 20 characters'
        ],
        sound_genre_id: [
          v => !!v || 'Genre is required'
        ],
        sound_sub_genre_id: [
          v => !!v || 'Sub Genre is required'
        ],
        track_type_id: [
          v => !!v || 'Track Type is required'
        ],
        mood_type_ids: [
          v => !!v || 'Mood Type is required'
        ],
        bpm: [
          v => !!v || 'BPM is required',
          v => !isNaN(v) || 'BPM must be a number'
        ]
      },
      success: false
    }
  },
  computed: {
    fileTypes: function () {
      let fileTypes = []
      if (this.form.audio_file) {
        fileTypes.push('wav')
      }
      if (this.form.mp3_audio_file) {
        fileTypes.push('mp3')
      }
      if (this.form.stem_file) {
        fileTypes.push('stems')
      }
      return fileTypes
    }
  },
  methods: {
    removeTag (item) {
      this.form.tags.splice(this.form.tags.indexOf(item), 1)
      this.form.tags = [...this.form.tags]
    },
    removeStyle: function (item) {
      this.form.style_types.splice(this.form.style_types.indexOf(item), 1)
      this.form.style_types = [...this.form.tags]
    },
    closeModal () {
      this.dialog = false
    },
    openModal: async function (uuid) {
      this.dialog = true
      this.success = false
      this.validationErrors = []
      this.form = this.getNullForm()
      this.old = this.getNullOld()
      this.uuid = uuid
      if (this.$refs.form) {
        this.$refs.form.resetValidation()
      }
      if (uuid) {
        await this.loadBeat()
      }
      try {
        let allTags = []
        this.old.hashtags.forEach(tag => {
          allTags.push(tag.hashtag)
        })
        this.form.tags = allTags

        this.genresLoading = true
        Vue.$http.get('v1/sound-store/genres').then(data => {
          this.genres = data.data.data
          if (this.uuid) {
            this.form.sound_genre_id = this.genres.genres.filter(v => v.name === this.old.genre)[0].id
            this.form.sound_sub_genre_id = this.genres.sub_genres.filter(v => v.name === this.old.sub_genre)[0].id
          }
          this.genresLoading = false
        })
        this.trackTypesLoading = true
        Vue.$http.get('v1/sound-store/track-type').then(data => {
          this.trackTypes = data.data.data
          if (this.uuid) {
            this.form.track_type_id = this.trackTypes.filter(v => v.name === this.old.track_type)[0].id
          }
          this.trackTypesLoading = false
        })
        this.moodTypesLoading = true
        Vue.$http.get('v1/sound-store/mood').then(data => {
          this.moods = data.data.data
          if (this.uuid) {
            this.form.mood_type_ids = this.old.mood_types.map(v => v.id)
          }
          this.moodTypesLoading = false
        })
        this.stylesLoading = true
        Vue.$http.get('v1/sound-store/style').then(data => {
          this.styles = data.data.data
          if (this.uuid) {
            this.form.style_types = this.old.style_types.map(v => v.name)
          }
          this.stylesLoading = false
        })
      } catch (err) {
        this.throwError(err)
      }
    },
    loadBeat: async function () {
      this.loading = true
      try {
        let { data: { data } } = await Vue.$http.get(`v1/sound-store/beat/${this.uuid}?me=true`)
        this.old = { ...data }
        let deleteFromForm = ['length', 'genre', 'sub_genre', 'track_type', 'audio_url', 'mp3_url', 'stem_url', 'mood_types', 'style_types', 'hashtags']
        deleteFromForm.forEach(v => {
          if (v in data) {
            delete data[v]
          }
        })
        this.form = data
      } catch (err) {
        this.throwError(err)
      }
      this.loading = false
    },
    onUpload: function (id) {
      this.uploading[id] = true
    },
    onDoneUploading: function (id) {
      if (id in this.uploading) {
        delete this.uploading[id]
      }
    },
    getNullForm: function () {
      return {
        name: null,
        description: null,
        attributes: [],
        sound_genre_id: null,
        sound_sub_genre_id: null,
        track_type_ids: [],
        style_types: [],
        bpm: null,
        img_file: null,
        audio_file: null,
        mp3_audio_file: null,
        stem_file: null,
        is_free_download: 0,
        pricing: defaultPricing,
        tags: []
      }
    },
    getNullOld: function () {
      return {
        mood_types: [],
        img_url: null,
        audio_url: null,
        mp3_url: null,
        stem_url: null,
        hashtags: []
      }
    },
    onSubmit: async function () {
      this.error = null
      this.validationErrors = []
      this.success = false
      if (Object.keys(this.uploading).length > 0) {
        this.error = `You have files that are being uploaded. Please wait.`
        document.getElementsByClassName('v-dialog--active')[0].scrollTop = 0
        return
      }
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      //check if all file types used in pricing are present
      let availableDownloadTypes = []
      if (this.form.audio_file) {
        availableDownloadTypes.push('WAV')
      }
      if (this.form.mp3_audio_file) {
        availableDownloadTypes.push('MP3')
      }
      if (this.form.stem_file) {
        availableDownloadTypes.push('Track Stems')
      }
      for (let i = 0; i < this.form.pricing.length; i++) {
        let price = this.form.pricing[i]
        let difference = price.download_types.filter(x => !availableDownloadTypes.includes(x))
        if (difference.length > 0) {
          this.error = `You have selected file types in your pricing that you have not uploaded.`
          document.getElementsByClassName('v-dialog--active')[0].scrollTop = 0
          return
        }
      }
      this.loading = true
      try {
        await Vue.$http({
          method: this.uuid ? 'PUT' : 'POST',
          url: `v1/sound-store/beat/${this.uuid ? this.uuid : ''}`,
          data: this.form
        })
        this.success = true
        this.form = this.getNullForm()
        this.old = this.getNullOld()
        document.getElementsByClassName('v-dialog--active')[0].scrollTop = 0
      } catch (err) {
        this.throwError(err)
        if (err.response.status === 422) {
          let items = Object.values(err.response.data.errors)
          this.validationErrors = this.formatErrors(items)
          document.getElementsByClassName('v-dialog--active')[0].scrollTop = 0
        }
      }
      this.loading = false
      this.saving = false
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style>
.style-box label:after {
  content: ' (examples of style are "G-eazy","Diplo","Drake")';
  font-size: 11px;
  color: #ee44aa;
  margin-left: 5px;
}
</style>
