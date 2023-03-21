<template>
  <v-dialog v-model="dialog" max-width="450">
    <v-card :loading="loading">
      <v-card-title class="headline">Are you sure you want to decline?</v-card-title>
      <v-card-text>
        Once you decline this placement, the buyer will be refunded.
        <v-form v-model="valid" ref="form">
          <v-select
            v-model="declineReason"
            :items="declineOptions"
            :rule="rules.declineReason"
            label="Decline Reason"
          ></v-select>
          <v-textarea
            v-if="declineReason === 'other'"
            v-model="otherDeclineReason"
            label="Reason"
            :rules="rules.otherDeclineReason"
          ></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn text @click="onContinue">Continue</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'

export default {
  props: {
    order: Object
  },
  data: function () {
    return {
      dialog: false,
      valid: true,
      loading: false,
      declineReason: null,
      declineOptions: [
        { text: 'Genre doesn\'t match IG following', value: 'Genre doesn\'t match IG following' },
        { text: 'Poor production quality', value: 'Poor production quality' },
        { text: 'Other', value: 'other' }
      ],
      otherDeclineReason: null,
      rules: {
        declineReason: [
          v => !!v || 'A decline reason is required'
        ],
        otherDeclineReason: [
          function (v) {
            if (this.declineReason === 'other' && !v) {
              return 'A decline reason is required'
            }
            return true
          }.bind(this)
        ]
      }
    }
  },
  methods: {
    openModal: function () {
      this.dialog = true
    },
    onContinue: async function () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      let declineReason = this.declineReason
      if (declineReason === 'other') {
        declineReason = this.otherDeclineReason
      }
      this.loading = true
      try {
        await Vue.$http.put(`v1/instagram-placement/order/${this.order.id}`, { status: 'denied', reject_reason: declineReason })
        this.dialog = false
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
