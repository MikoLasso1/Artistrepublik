<template>
  <div>
    <v-row>
      <v-col :cols="isUploading ? 10 : 12">
        <v-file-input
          v-model="file"
          :label="label"
          :accept="accepts"
          @change="onFileChange"
          @click:clear="cancelUpload"
        ></v-file-input>
      </v-col>
      <v-col v-if="isUploading" cols="2">
        <div class="d-flex align-center" style="height: 100%;">
          <p class="mb-0">{{ progress }}%</p>
        </div>
      </v-col>
      <div v-if="!isUploading && (!audio && !image) && hasUrl" class="text-right" style="width: 100%;">
        <p class="my-0 px-4"><a :href="url">Download</a></p>
      </div>
    </v-row>
    <vuetify-audio v-if="!isUploading && hasUrl && (audio && !image)" :file="url" color="success" downloadable flat></vuetify-audio>
    <v-row>
      <v-col cols="12" sm="6" offset-sm="3">
        <v-img v-if="!isUploading && hasUrl && (!audio && image)" :src="url" class="cursor-pointer" @click="showImage" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'

const CancelToken = Vue.$http.CancelToken
let cancel
export default {
  components: {
    VuetifyAudio: () => import('vuetify-audio')
  },
  props: {
    value: null,
    accepts: String,
    label: String,
    uploadId: String,
    locationKey: String,
    url: String,
    audio: {
      type: Boolean,
      default: true
    },
    image: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      file: null,
      e: '',
      isUploading: false,
      id: this.makeId(10),
      progress: 0,
      hasUrl: this.url
    }
  },
  computed: {
    ...mapGetters({
      user: 'getUser'
    })
  },
  watch: {
    value: function (uuid) {
      this.value = uuid
    },
    url: function (url) {
      this.hasUrl = !!url
    }
  },
  methods: {
    checkStatus: function (checkID) {
      window[checkID] = setInterval(function () {
        try {
          Vue.$http({
            method: 'GET',
            url: `v1/file?key=${checkID}`
          })
            .then((response) => {
              if (typeof response.data.data !== 'undefined') {
                if (response.data.data.key === checkID) {
                  window.clearInterval(window[checkID])
                  this.isUploading = false
                  this.$emit('input', response.data.data.uuid)
                  this.$emit('done-uploading', checkID)
                }
              }
            })
        } catch (err) {
          console.log(err)
        }
      }.bind(this), 15000)
    },
    onFileChange: async function () {
      if (!this.file) {
        return
      }
      if (this.isUploading) {
        this.cancelUpload()
      }
      this.$emit('uploading', this.id)
      this.isUploading = true
      this.hasUrl = null
      let formData = new FormData()
      this.checkStatus(this.id)
      formData.append('file', this.file)
      try {
        await Vue.$http({
          method: 'POST',
          url: `v1/file?upload_id=${this.uploadId}&location_key=${this.locationKey}&id=${this.id}`,
          data: formData,
          headers: {
            'content-type': 'multipart/form-data'
          },
          cancelToken: new CancelToken(function executor (c) {
            cancel = c
          }),
          onUploadProgress: function (progressEvent) {
            const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length')
            if (totalLength !== null) {
              this.progress = Math.round(Math.round((progressEvent.loaded * 100) / totalLength) / 2)
            }
          }.bind(this)
        })
      } catch (err) {
        console.log(err)
      }
    },
    cancelUpload: function () {
      window.clearInterval(window[this.id])
      this.file = null
      cancel()
      this.isUploading = false
      this.progress = 0
      this.id = this.makeId(10)
      this.$emit('input', null)
      this.$emit('done-uploading', this.id)
    },
    showImage () {
      window.open(this.url)
    }
  },
  mounted: function () {

    window.Echo.private(`upload-progress.${this.user.id}`).listen(
      '.UploadProgress',
      e => {
        if (e.id === this.id) {
          this.progress = 50 + Math.round(e.progress / 2)
        }
      }
    )
    window.Echo.private(`upload-finished.${this.user.id}`).listen(
      '.UploadFinished',
      e => {
        this.e = e
        if (e.id === this.id) {
          this.isUploading = false
          this.$emit('input', e.uuid)
          this.$emit('done-uploading', this.id)
        }
      }
    )
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
