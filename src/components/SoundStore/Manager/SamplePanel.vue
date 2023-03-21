<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <v-row no-gutters class="align-center">
        <v-col cols="4">
          {{ form.name }}
        </v-col>
        <v-col cols="4" class="text-center">
          <v-btn color="red" dark @click.stop="deleteSample">Delete</v-btn>
        </v-col>
        <v-col cols="4" class="text-right">
          ${{ form.amount }}
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-overlay absolute :value="overlay">
        <v-progress-circular
          color="primary"
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>
      <v-alert v-if="error" color="warning">{{ error }}</v-alert>
      <v-alert
        type="warning"
        v-if="unsavedChanges"
        outlined
      >You have unsaved changes. Hit save.
      </v-alert>
      <v-form v-model="valid" ref="form" @submit.prevent="onSubmit">
        <v-row>
          <v-col sm="4" cols="12">
            <v-text-field
              v-model="form.name"
              label="Sample Name"
              :rules="rules.name"
            ></v-text-field>
          </v-col>
          <v-col sm="4" cols="12">
            <v-text-field
              v-model="form.amount"
              label="Sample Price"
              :rules="rules.amount"
              type="number"
              prepend-icon="mdi-currency-usd"
            ></v-text-field>
          </v-col>
          <v-col sm="4" cols="12">
            <v-text-field
              v-model="form.bpm"
              label="BPM"
              :rules="rules.bpm"
              type="number"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-textarea
          v-model="form.description"
          label="Description"
          :rules="rules.description"
        ></v-textarea>
        <h3 class="h3">Attributes</h3>
        <v-alert
          type="info"
          outlined
        >Hit + icon after entering attribute.
        </v-alert>
        <text-value-fields v-model="form.attributes" />
        <file-upload-preview-input
          v-model="form.audio_file"
          label="Audio File (.wav)"
          accepts="audio/wav"
          :upload-id="fileUploadId"
          :location-key="fileUploadLocationKey"
          :url="old.audio_file_url"
          @uploading="onUpload"
          @done-uploading="onDoneUploading"
        />
        <div class="d-flex">
          <v-spacer></v-spacer>
          <v-btn color="primary" type="submit">Save</v-btn>
        </div>
      </v-form>
      <v-alert
        type="warning"
        v-if="unsavedChanges"
        class="mt-2"
        outlined
      >You have unsaved changes. Hit save.
      </v-alert>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import Vue from 'vue'
import config from '../../../config'
import FileUploadPreviewInput from '@/components/FileUploadPreviewInput'
import TextValueFields from '@/components/TextValueFields'

export default {
  components: {
    FileUploadPreviewInput,
    TextValueFields
  },
  props: {
    sample: Object,
    index: Number,
    uuid: String
  },
  data: function () {
    return {
      overlay: false,
      valid: true,
      fileUploadId: config.SOUND_STORE_FILE_UPLOAD_ID,
      fileUploadLocationKey: config.SOUND_STORE_SAMPLE_FILE_LOCATION_KEY,
      uploading: {},
      error: null,
      old: {
        audio_file_url: this.sample ? this.sample.audio_file_url : null
      },
      form: {
        name: this.sample ? this.sample.name : null,
        amount: this.sample ? this.sample.amount : null,
        description: this.sample ? this.sample.description : null,
        attributes: this.sample ? this.sample.attributes : [],
        bpm: this.sample ? this.sample.bpm : null,
        audio_file: this.sample ? this.sample.audio_file : null
      },
      rules: {
        name: [
          v => !!v || 'A price name is required',
          v => !(v && v.length < 3) || 'Price name must be at least 5 characters'
        ],
        amount: [
          v => !!v || 'Price is required'
        ],
        description: [
          v => !!v || 'Description is required',
          v => (v && v.length > 20) || 'Description must be at least 20 characters'
        ],
        bpm: [
          v => !!v || 'BPM is required'
        ]
      },
      unsavedChanges: false
    }
  },
  methods: {
    onUpload: function (id) {
      this.uploading[id] = true
    },
    onDoneUploading: function (id) {
      if (id in this.uploading) {
        delete this.uploading[id]
      }
    },
    onSubmit: async function () {
      this.error = null
      this.unsavedChanges = false
      if (Object.keys(this.uploading).length > 0) {
        this.error = `You have files that are being uploaded. Please wait.`
        document.getElementsByClassName('v-dialog--active')[0].scrollTop = 0
        return
      }
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      if (this.uuid) {
        this.overlay = true
        try {
          // let { data: { data } } = await Vue.$http.put(`v1/sound-store/sample-pack/sample/${this.uuid}`, this.form)
          // this.form = data;
          this.unsavedChanges = false
        } catch (err) {
          this.throwError(err)
        }
        this.overlay = false
      }
      this.$emit('saved', this.index, this.form)
    },
    deleteSample: async function () {
      if (this.uuid) {
        try {
          await Vue.$http.delete(`v1/sound-store/sample-pack/sample/${this.uuid}`)
        } catch (err) {
          this.throwError(err)
        }
      }
      this.$emit('delete', this.index)
    }
  },
  watch: {
    form: {
      handler: function () {
        this.unsavedChanges = true
      },
      deep: true
    }
  }
}
</script>

<style>
label {
  margin-bottom: 0;
}
</style>
