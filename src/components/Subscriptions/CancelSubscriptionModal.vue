<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title class="headline">Are you sure you want to cancel?</v-card-title>
      <v-card-text>
        <loading-overlay :loading="loading" />
        <v-alert v-if="error" color="red" dark>{{ error }}</v-alert>
        <div v-if="subscription">
          If canceled, your plan will stop on {{ subscription.bills_next | formatDate }}.
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="dialog = false">Don't Cancel</v-btn>
        <v-btn color="red darken-1" text @click="doCancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'
import LoadingOverlay from '@/components/LoadingOverlay'

export default {
  props: {
    subscription: Object
  },
  components: {
    LoadingOverlay
  },
  data: function () {
    return {
      dialog: false,
      loading: false,
      error: null
    }
  },
  methods: {
    openDialog: function () {
      this.dialog = true
    },
    doCancel: async function () {
      this.loading = true
      this.error = null
      const url = this.subscription.service === 'main' ? `v1/subscription/${this.subscription.id}` : `v1/service/${this.subscription.service}/subscription/${this.subscription.id}`
      let { data: { data } } = await Vue.$http.delete(url)
      if (!data.success) {
        this.error = 'An unkown error has occured. Please contact support at support@artistrepublik.com'
        this.loading = false
        return
      }
      this.$noty.success('Canceled successfully')
      this.loading = false
      this.dialog = false
      this.$emit('canceled')
    }
  }
}
</script>

<style>

</style>
