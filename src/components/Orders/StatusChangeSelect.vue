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
    orderUuid: String
  },
  data () {
    return {
      selected: this.selectedValue,
      options: [
        { value: 'placed', text: 'Placed', disabled: true },
        { value: 'processing', text: 'Processing' },
        { value: 'shipped', text: 'Shipped' },
        { value: 'completed', text: 'Completed' },
        { value: 'refunded', text: 'Refunded' }
      ]
    }
  },
  methods: {
    getSelectedItem (option) {
      this.$noty.info('Processing Request...')
      Vue.$http.put(`v1/order/${this.orderUuid}`, {
        status: option
      })
        .then(() => {
          this.$noty.success('Status updated successfully')
        })
        .catch(err => {
          this.$noty.warning('Error Occurred while processing request.')
          console.error(err)
          this.$sentry.captureException(err)
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
