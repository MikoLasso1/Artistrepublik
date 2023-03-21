<template>
  <div>
    <div class="form-group">
      <label for="link">Link</label>
      <div class="row">
        <div class="col-10">
          <input type="text" class="form-control" name="link" v-model="url" @keyup="onChange">
        </div>
        <div class="col-2">
          <v-btn dark color="primary" v-if="link" @click="doDelete">Delete</v-btn>
          <v-btn dark color="primary" v-else @click="doAdd">Add</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const _ = require('lodash')
import Vue from 'vue'

export default {
  props: {
    link: Object,
    pressRelease: Object
  },
  data: function () {
    return {
      url: this.link ? this.link.url : ''
    }
  },
  methods: {
    onChange: _.debounce(function () {
      if (!this.link) {
        return
      }
      let data = { url: this.url }
      Vue.$http.put(`v1/press-release/link/${this.link.id}`, data)
        .then(response => {
          this.$noty.success('Saved successfully')
          this.$emit('link-updated', response.data.data)
        })
        .catch(err => {
          this.$noty.warning('Error Occurred while processing request.')
          this.$sentry.captureException(err)
          console.error(err)
        })
    }, 600),
    doDelete: async function () {
      try {
        await Vue.$http.delete(`v1/press-release/link/${this.link.id}`)
        this.$noty.success('Deleted successfully')
        this.$emit('link-deleted', this.link)
      } catch (err) {
        this.$noty.warning('Error Occurred while processing request.')
        this.$sentry.captureException(err)
        console.error(err)
      }
    },
    doAdd: async function () {
      try {
        let formData = { press_release_id: this.pressRelease.id, url: this.url }
        let { data: { data } } = await Vue.$http.post(`v1/press-release/link`, formData)
        this.$emit('link-created', data)
        this.url = ''
      } catch (err) {
        this.$noty.warning('Error Occurred while processing request.')
        this.$sentry.captureException(err)
        console.error(err)
      }
    }
  }
}
</script>

<style>

</style>
