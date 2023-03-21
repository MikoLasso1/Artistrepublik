<template>
  <b-form-select
    v-model="selected"
    class="order-status"
    :options="options"
    size="sm"
    @change="getSelectedItem"
  />
</template>

<script>
import 'vuejs-noty/dist/vuejs-noty.css'
import Vue from 'vue'

export default {
  props: {
    selectedValue: [String, null],
    orderId: [Number, String]
  },
  data () {
    return {
      selected: this.selectedValue,
      options: [
        { value: 'pending', text: 'Pending My Review' },
        { value: 'approved', text: 'Approved - I Will Add to Playlist' },
        { value: 'declined', text: 'Do not add to playlist' }
      ]
    }
  },
  methods: {
    getSelectedItem (option) {
      this.$noty.info('Processing Request...')
      Vue.$http.put(`v1/service/playlist-republik/curator/order/${this.orderId}`, {
        status: option
      })
        .then(() => {
          this.$noty.success('Status updated successfully')
        })
        .catch(() => {
          this.$noty.warning('Error Occurred while processing request.')
        })
    }
  }
}
</script>
<style>
.curator-orders select.order-status {
  border-radius: 0;
}
</style>
