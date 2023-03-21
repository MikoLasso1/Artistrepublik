<template>
  <div>
    <div class="text-center" v-if="loading">
      <v-progress-circular :width="3" indeterminate color="primary" />
    </div>
    <a v-else-if="contracturl && !loading" :href="contracturl" target="_blank">
      <v-btn small color="primary" dark>Contract</v-btn>
    </a>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  props: {
    uuid: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async getContractUrl () {
      this.loading = true
      let response = await Vue.$http.get(`v1/sound-store/order/contract/${this.uuid}`)
      if (response.data.data.success) {
        console.log(response.data.data.url)
        this.contracturl = response.data.data.url
      }
      this.loading = false
    }
  },
  created () {
    this.getContractUrl()
  }
}
</script>

<style scoped>
button.primary {
  background-color: #ee44aa !important;
  border-color: #ee44aa !important;
}
</style>
