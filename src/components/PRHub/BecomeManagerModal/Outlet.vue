<template>
  <div>
    <v-row class="my-2">
      <v-col cols="12">
        <validation-errors :errors="validationErrors"></validation-errors>
      </v-col>
      <v-col cols="12" md="3">
        <v-img :src="img_url" v-if="img_url" alt="blog image" loading="lazy"></v-img>
        <input type="file" name="file" ref="uploader" accept="image/*" @input="onSelectFile">
        <label for="file" @click="doSelectFile">Choose a Image</label>
      </v-col>
      <v-col cols="12" md="9">
        <v-text-field outlined v-model="name" @keyup="onChange" label="Outlet Name"></v-text-field>
        <v-text-field outlined v-model.number="visitors" @keyup="onChange" label="No. Of Visitors" :rules="rules.visitors"></v-text-field>
        <v-row v-if="outlet">
          <v-col cols="12" class="my-3">
            <h3>Options</h3>
          </v-col>
          <Option v-for="option in outlet.options" v-bind:key="option.id" :option="option" />
          <Option :outlet-id="outlet.id" />
        </v-row>
      </v-col>
    </v-row>
    <v-row class="text-center my-2">
      <v-btn dark color="primary" v-if="!outlet" @click="doSave" :disabled="addingOutlet">
        <span v-if="!addingOutlet">Add Outlet</span>
        <span v-if="addingOutlet">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular> Processing...
        </span>
      </v-btn>
      <v-btn dark color="error" v-else class="mt-3" @click="onDelete" :disabled="deletingOutlet">
        <span v-if="!deletingOutlet">Delete Outlet</span>
        <span v-if="deletingOutlet">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular> Processing...
        </span>
      </v-btn>
    </v-row>
    <hr>
  </div>
</template>

<script>
import Option from '@/components/PRHub/BecomeManagerModal/Option'
import validationErrorsMixin from '../../../shared/mixins/ValidationErrorsMixin'
import { isProduction } from '../../../shared/utils/common'

const _ = require('lodash')
export default {
  mixins: [validationErrorsMixin],
  components: {
    Option
  },
  props: {
    outlet: Object
  },
  data: function () {
    return {
      name: this.outlet ? this.outlet.name : '',
      visitors: this.outlet ? this.outlet.visitors : '',
      img_url: this.outlet ? this.outlet.img_url : null,
      img: null,
      addingOutlet: false,
      deletingOutlet: false,
      rules: {
        visitors: [
          v => Number.isInteger(v) || 'Value must be an integer'
        ]
      }
    }
  },
  methods: {
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
        this.img = files[0]
      }
    },
    createFormData: function () {
      let formData = new FormData()
      formData.append('name', this.name)
      formData.append('visitors', this.visitors)
      if (this.img) {
        formData.append('img', this.img)
      }
      if (this.outlet) {
        formData.append('_method', 'PUT')
      }
      return formData
    },
    doSave: function () {
      this.validationErrors = []
      this.addingOutlet = true
      this.$noty.info('Processing request ...')
      this.$store.dispatch('savePROutlet', { id: this.outlet ? this.outlet.id : null, data: this.createFormData() })
        .then(() => {
          if (!this.outlet) {
            this.img_url = null
            this.name = ''
          }
          this.$noty.success('Saved successfully')
          this.validationErrors = []
        })
        .catch(err => {
          this.$noty.warning('Error Occurred while processing request.')
          if (isProduction())
            this.$sentry.captureException(err)
          let items
          if (err.response.status === 422) {
            //validation errors
            items = Object.values(err.response.data.errors)
            this.validationErrors = this.formatErrors(items)
          }
          console.log(err)
        })
        .then(() => this.addingOutlet = false)

    },
    onChange: _.debounce(function () {
      if (!this.outlet) {
        return
      }
      this.doSave()
    }, 600),
    onDelete: function () {
      this.deletingOutlet = true
      this.$store.dispatch('deletePROutlet', this.outlet.id)
        .then(() => {
          this.$noty.success('Deleted successfully')
        })
        .catch(err => {
          this.$noty.warning('Error Occurred while processing request.')
          if (isProduction()) {
            this.$sentry.captureException(err)
          }
          console.log(err)
        })
        .then(() => this.deletingOutlet = false)

    }
  }
}
</script>

<style lang="scss" scoped>
img {
  width: 100%;
}

input[type="file"] {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;

  + label {
    margin-top: 10px;
    padding: 5px;
    text-align: center;
    font-size: 12px;
    font-weight: 700;
    color: white;
    background-color: #5e72e4;
    display: block;
    cursor: pointer;
  }

  &:focus + label, + label:hover {
    background-color: #4d64e3;
  }
}
</style>
