<template>
  <div class="curator-table">
    <v-dialog max-width="600">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          small
          outlined
          color="primary"
          v-bind="attrs"
          v-on="on"
        >
          <span v-if="feedbackMessage">Update Feedback</span>
          <span v-else>Leave Feedback</span>
        </v-btn>
      </template>
      <template v-slot:default="dialog">
        <v-card>
          <v-card-title>
            <h2 class="m-0">
              Leave Feedback
            </h2>
            <v-spacer />
            <v-btn
              text
              @click="dialog.value = false"
            >
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-card-subtitle>
            Feedback On Song
          </v-card-subtitle>
          <v-card-text>
            <v-form ref="form" @submit.prevent v-model="valid">
              <v-alert
                v-show="success"
                color="success"
              >
                Request Processed Successfully.
              </v-alert>
              <v-textarea
                required
                :rules="feedbackRules"
                rows="14" row-height="15"
                label="Feedback"
                hint="What did you think of this artist's song?"
                v-model="feedback"
              />
              <v-btn
                type="submit"
                color="primary"
                :disabled="loading"
                @click="onSubmit"
              >
                <span v-if="!loading">Submit</span>
                <span v-if="loading">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular> Processing...
                </span>
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script scoped>
import validationErrorsMixin from '../../../shared/mixins/ValidationErrorsMixin'
import Vue from 'vue'
import { extend } from 'vee-validate'

extend('not_promotional', {
  validate (value) {
    return !(value.includes('@') || value.includes('promotion') || value.includes('promotional'))
  },
  message: 'Please enter feedback that does not contain email addresses or the words \'promotion\' or \'promotional\''
})
export default {
  mixins: [validationErrorsMixin],
  props: ['orderId', 'feedbackMessage'],
  data () {
    return {
      valid: true,
      feedback: this.feedbackMessage,
      loading: false,
      success: false,
      feedbackRules: [
        v => !!v || 'You must provide feedback.',
        v => v && v.length >= 100 || 'Please provide more thorough feedback.',
        v => v && (!v.includes('@') && !v.includes('promotion') && !v.includes('promotional')) || 'Please enter feedback that does not contain email addresses or the words \'promotion\' or \'promotional\''
      ]
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.loading = true
      this.success = false
      Vue.$http.put(`v1/service/playlist-republik/curator/order/${this.orderId}`, {
        feedback: this.feedback
      })
        .then(() => {
          this.success = true
        })
        .catch(error => {
          let items

          if (typeof error.response !== 'undefined') {
            if (error.response.status === 400) {
              items = Object.values(error.response.data.data.message)
            } else if (error.response.status === 422) {
              items = Object.values(error.response.data.errors)
            }
            this.validationErrors = this.formatErrors(items)
          }
        })
        .then(() => this.loading = false)
    }
  }
}

</script>
<style>
.curator-table-modal .modal-header {
  border-bottom: 1px solid #dee2e6;;
}
</style>
