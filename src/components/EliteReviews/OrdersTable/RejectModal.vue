<template>
  <v-dialog v-model="dialog" max-width="450">
    <loading-overlay :loading="loading" />
    <v-card>
      <v-card-title class="headline">Are you sure you want to decline?</v-card-title>
      <v-card-text>
        Once you decline this placement, the buyer will be refunded.
        <v-form v-model="valid" ref="form">
          <v-select v-model="declineReason" :items="declineOptions" :rule="rules.declineReason" label="Decline Reason"></v-select>
          <v-textarea v-if="declineReason === 'other'" v-model="otherDeclineReason" label="Reason" :rules="rules.otherDeclineReason"></v-textarea>
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
export default {
  props: {
    loading: Boolean,
    order: Object
  },
  data: function () {
    return {
      dialog: false,
      valid: true,
      declineReason: null,
      declineOptions: [{
        text: 'Something is wrong with the file',
        value: 'Something is wrong with the file.'
      },
        {
          text: 'Unusable quality',
          value: 'Unusable quality.'
        },
        {
          text: 'Lacking details',
          value: 'Lacking details.'
        },
        {
          text: 'Unreasonable request',
          value: 'Unreasonable request.'
        },
        {
          text: 'Other',
          value: 'other'
        }
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
    closeModal: function () {
      this.dialog = false
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
      try {
        this.$emit('status-changed', 'rejected', {
          reject_reason: declineReason
        })
      } catch (err) {
        console.log(err)
        this.throwError(err)
      }
    }
  }
}
</script>

<style>

</style>
