<template>
  <v-dialog v-model="dialog" width="700px" ref="dialog">
    <v-card :loading="loading">
      <v-card-title class="headline">
        {{ uuid ? `Edit Sample` : `Add Sample` }}
        <v-spacer />
        <v-btn text @click="closeModal">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <p>Your sample will be bundled into a pack even if it is just one sample. If you only upload one sample, then it will display differently on the store.</p>
        <v-alert v-if="success" color="success">Sample/Pack saved successfully.</v-alert>
        <div>
          <validation-errors :errors="validationErrors"></validation-errors>
        </div>
        <v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
          <v-row>
            <v-col sm="8">
              <v-text-field
                v-model="form.name"
                label="Name"
                :rules="rules.name"
              ></v-text-field>
            </v-col>
            <v-col sm="4">
              <v-text-field
                v-model="form.amount"
                label="Sample Pack Price"
                :rules="rules.amount"
                type="number"
                prepend-icon="mdi-currency-usd"
              ></v-text-field>
            </v-col>
          </v-row>
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
          <v-select
            v-model="form.mood_type_ids"
            label="Moods"
            :loading="moodTypesLoading"
            :items="moods.map(g=>({value:g.id,text:g.name.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}))"
            :reduce="mood => mood.id"
            :rules="rules.mood_type_ids"
            multiple
          ></v-select>
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
          <h3 class="h3">Samples</h3>
          <sample-expansion-panels v-model="form.samples" class="mb-4" />
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
import config from '../../../config'
import Vue from 'vue'
import SampleExpansionPanels from '@/components/SoundStore/Manager/SampleExpansionPanels'
import FileUploadPreviewInput from '@/components/FileUploadPreviewInput'
import validationErrorsMixin from '@/shared/mixins/ValidationErrorsMixin'

export default {
  mixins: [validationErrorsMixin],
  components: {
    SampleExpansionPanels,
    FileUploadPreviewInput
  },
  data: function () {
    return {
      uuid: null,
      dialog: false,
      loading: false,
      saving: false,
      genresLoading: false,
      moodTypesLoading: false,
      valid: true,
      fileUploadId: config.SOUND_STORE_FILE_UPLOAD_ID,
      fileUploadLocationKey: config.SOUND_STORE_SAMPLE_FILE_LOCATION_KEY,
      uploading: {},
      genres: {
        genres: [],
        sub_genres: []
      },
      moods: [],
      old: {},
      form: this.getNullForm(),
      rules: {
        name: [
          v => !!v || 'Name is required',
          v => (v && v.length > 5) || 'Name must be at least 5 characters'
        ],
        amount: [
          v => !!v || 'Price is required for the pack'
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
        mood_type_ids: [
          v => !!v || 'Mood Type is required'
        ]
      },
      success: false
    }
  },
  methods: {
    removeTag (item) {
      this.form.tags.splice(this.form.tags.indexOf(item), 1)
      this.form.tags = [...this.form.tags]
    },
    closeModal () {
      this.dialog = false
    },
    openModal: async function (uuid) {
      this.dialog = true
      this.success = false
      this.validationErrors = []
      this.form = this.getNullForm()
      this.old.hashtags = []
      if (this.$refs.form) {
        this.$refs.form.resetValidation()
      }
      if (uuid) {
        this.uuid = uuid
        await this.loadSamplePack()
      } else {
        this.uuid = null
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
            this.form.sound_genre_id = this.genres.genres.filter(v => v.name === this.form.genre)[0].id
            this.form.sound_sub_genre_id = this.genres.sub_genres.filter(v => v.name === this.form.sub_genre)[0].id
            delete this.form['genre']
            delete this.form['sub_genre']
          }
          this.genresLoading = false
        })
        this.moodTypesLoading = true
        Vue.$http.get('v1/sound-store/mood').then(data => {
          this.moods = data.data.data
          if (this.uuid) {
            this.form.mood_type_ids = this.old.mood_types.map(v => v.id)
          }
          this.moodTypesLoading = false
        })
      } catch (err) {
        this.throwError(err)
      }
    },
    onUpload: function (id) {
      this.uploading[id] = true
    },
    onDoneUploading: function (id) {
      if (id in this.uploading) {
        delete this.uploading[id]
      }
    },
    loadSamplePack: async function () {
      this.loading = true
      try {
        let { data: { data } } = await Vue.$http.get(`v1/sound-store/sample-pack/${this.uuid}?me=true`)
        this.old = { ...data }
        let deleteFromForm = ['img_url', 'mood_types', 'hashtags']
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
    getNullForm: function () {
      return {
        name: null,
        amount: null,
        description: null,
        sound_genre_id: null,
        sound_sub_genre_id: null,
        mood_type_ids: [],
        is_free_download: null,
        img_file: null,
        samples: []
      }
    },
    onSubmit: async function () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.loading = true
      this.validationErrors = []
      this.success = false
      try {
        await Vue.$http({
          method: this.uuid ? 'PUT' : 'POST',
          url: `v1/sound-store/sample-pack/${this.uuid ? this.uuid : ''}`,
          data: this.form
        })
        this.success = true
        this.form = this.getNullForm()
        document.getElementsByClassName('v-dialog--active')[0].scrollTop = 0
        this.$refs.form.resetValidation()
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
    }
  }
}
</script>

<style>

</style>
