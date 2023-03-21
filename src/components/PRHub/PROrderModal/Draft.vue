<template>
  <div>
    <div>
      <validation-errors :errors="validationErrors"></validation-errors>
    </div>
    <div class="row my-4">
      <div class="col-md-6">
        <v-btn dark color="primary" @click="doBack">Back</v-btn>
      </div>
      <div class="col-md-6 text-right">
        <v-btn dark color="primary" @click="doNext">
          <span v-if="!processing">Continue</span>
          <span v-if="processing">
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular> Processing...
            </span>
        </v-btn>
      </div>
    </div>
    <div class="form-group">
      <label for="headline">Headline <span class="text-danger">*</span></label>
      <input type="text" class="form-control" name="headline" id="headline" v-model="form.headline" />
    </div>
    <div class="form-group">
      <label for="keywords">Keywords<span class="text-danger">*</span></label>
      <input type="text" class="form-control" name="key_words" id="keywords" v-model="form.key_words" />
    </div>
    <div class="form-group">
      <label for="location">Location <span class="text-danger">*</span></label>
      <input type="text" class="form-control" name="location" id="location" v-model="form.location" />
    </div>
    <div class="form-group">
      <label for="draft">Draft <span class="text-danger">*</span></label>
      <textarea class="form-control" name="draft" id="draft" v-model="form.draft"></textarea>
    </div>
    <div class="form-group">
      <label for="img">Image <span class="text-danger">*</span></label>
      <div class="text-center">
        <img :src="img_url" v-if="img_url" alt="draft image" loading="lazy">
        <input type="file" name="img" id="img" ref="uploader" accept="image/*" @input="onSelectFile">
        <label for="file" @click="doSelectFile">Choose a Image</label>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import validationErrorsMixin from '../../../shared/mixins/ValidationErrorsMixin'
import { isProduction } from '../../../shared/utils/common'

export default {
  mixins: [validationErrorsMixin],
  props: {
    pressRelease: Object
  },
  data: function () {
    return {
      form: {
        headline: this.pressRelease ? this.pressRelease.headline : '',
        key_words: this.pressRelease ? this.pressRelease.key_words : '',
        location: this.pressRelease ? this.pressRelease.location : '',
        draft: this.pressRelease ? this.pressRelease.draft : '',
        img: null
      },
      img_url: this.pressRelease ? this.pressRelease.img_url : null,
      processing: false
    }
  },
  methods: {
    doBack: function () {
      this.$emit('back-step')
    },
    doNext: async function () {
      this.processing = true
      this.$noty.info('Processing ...')
      let url = `v1/press-release`
      let formData = new FormData()
      for (let key in this.form) {
        if (this.form[key] !== null && this.form[key] !== '') {
          formData.append(key, this.form[key])
        }
      }
      if (this.pressRelease) {
        url += `/${this.pressRelease.id}`
        formData.append('_method', 'PUT')
      }

      try {
        let { data: { data } } = await Vue.$http({
          method: 'POST',
          url: url,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        this.$noty.success('Draft saved successfully')
        this.processing = false
        this.$emit('press-release-created', data)
        this.$emit('next-step')
      } catch (err) {
        this.$noty.warning('Error Occurred while processing request.')
        if (isProduction)
          this.$sentry.captureException(err)
        let items
        if (err.response.status === 422) {
          items = Object.values(err.response.data.errors)
          this.validationErrors = this.formatErrors(items)
        }
        this.processing = false
        console.error(err)
      }
    },
    doSelectFile: function () {
      this.$refs.uploader.click()
    },
    onSelectFile: function () {
      const input = this.$refs.uploader
      const files = input.files
      if (files && files[0]) {
        const reader = new FileReader
        reader.onload = e => {
          this.img_url = e.target.result
        }
        reader.readAsDataURL(files[0])
        this.form.img = files[0]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  max-width: 200px;
}

input[type="file"] {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;

  + label {
    margin: 10px auto 0 auto;
    padding: 5px;
    text-align: center;
    font-size: 12px;
    font-weight: 700;
    color: white;
    background-color: #5e72e4;
    display: block;
    cursor: pointer;
    max-width: 200px;
  }

  &:focus + label, + label:hover {
    background-color: #4d64e3;
  }
}
</style>
