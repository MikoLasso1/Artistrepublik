<template>
  <v-col cols="12">
    <v-row>
      <div class="col-md-12">
        <validation-errors :errors="validationErrors"></validation-errors>
      </div>
    </v-row>
    <v-row class="my-2">
      <v-col cols="5">
        <v-text-field
          v-model="type"
          label="Type"
          name="type"
          required
          outlined
          @keyup="onChange"
        ></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="price"
          label="Price"
          name="Price"
          required
          outlined
          type="number"
          @keyup="onChange"
        ></v-text-field>
      </v-col>
      <v-col cols="3" class="text-right mb-2">
        <v-btn dark color="error" small v-if="option" @click="onDelete" :disabled="deletingOption">
          <v-icon v-if="!deletingOption">
            mdi-trash-can
          </v-icon>
          <span v-if="deletingOption">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
          </span>
        </v-btn>
        <v-btn dark color="primary" small v-else @click="onAdd" :disabled="addingOption">
          <v-icon v-if="!addingOption">
            mdi-plus
          </v-icon>
          <span v-if="addingOption">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
          </span>
        </v-btn>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import validationErrorsMixin from '../../../shared/mixins/ValidationErrorsMixin'
import { isProduction } from '@/shared/utils/common'

const _ = require('lodash')
export default {
  mixins: [validationErrorsMixin],
  props: {
    option: Object,
    outletId: Number
  },
  data: function () {
    return {
      type: this.option ? this.option.type : '',
      price: this.option ? this.option.price : 10.00,
      addingOption: false,
      deletingOption: false
    }
  },
  methods: {
    onChange: _.debounce(function () {
      if (!this.option) {
        return
      }
      let data = { type: this.type, price: this.price }
      this.$store.dispatch('updateOutletOption', { id: this.option.id, data })
        .then(() => {
          this.$noty.success('Saved successfully')
        })
        .catch(err => {
          this.$noty.warning('Error Occurred while processing request.')
          if (isProduction()) {
            this.$sentry.captureException(err)
          }
        })
    }, 600),
    onAdd: async function () {
      this.addingOption = true
      let postData = { press_release_outlet_id: this.outletId, type: this.type, price: this.price }
      this.$store.dispatch('saveOutletOption', postData)
        .then(() => {
          this.type = ''
          this.price = 10.00
          this.$noty.success('Saved successfully')
        })
        .catch(err => {
          this.$noty.warning('Error Occurred while processing request.')
          if (isProduction()) {
            this.$sentry.captureException(err)
          }
          let items
          if (err.response.status === 422) {
            //validation errors
            items = Object.values(err.response.data.errors)
            this.validationErrors = this.formatErrors(items)
          }
        })
        .then(() => this.addingOption = false)
    },
    onDelete: function () {
      this.deletingOption = true
      this.$store.dispatch('deleteOutletOption', this.option.id)
        .then(() => {
          this.$noty.success('Deleted successfully')
        })
        .catch(err => {
          this.$noty.warning('Error Occurred while processing request.')
          if (isProduction()) {
            this.$sentry.captureException(err)
          }
        })
        .then(() => this.deletingOption = false)
    }
  }
}
</script>

<style lang="scss" scoped>
label {
  font-size: 12px;
}

.option-button {
  margin-top: 32px;
}
</style>
