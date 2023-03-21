<template>
  <v-dialog v-model="dialog" max-width="300">
    <v-card>
      <v-card-title class="headline">Samples for Order</v-card-title>
      <v-card-text>
        <div v-if="loading" class="text-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        <ul v-else>
          <li v-for="sample in samples" v-bind:key="sample.uuid">
            {{ sample.name }}
          </li>
        </ul>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'

export default {
  data: function () {
    return {
      dialog: false,
      loading: false,
      samples: []
    }
  },
  methods: {
    openModal: async function (uuid) {
      this.dialog = true
      this.loading = true
      try {
        let { data: { data } } = await Vue.$http.get(`v1/sound-store/order/sample/${uuid}`)
        this.samples = data
      } catch (err) {
        this.throwError(err)
      }
      this.loading = false
    }
  }
}
</script>

<style>

</style>
