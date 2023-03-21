<template>
  <div class="feedback-wrap">
    <div v-if="response" class="feedback-content">
      <p class="text-center py-3">Thanks for your feedback!</p>
    </div>
    <div v-else class="feedback-content">
      <v-row class="px-4" align="center" justify="space-between">
        <p class="mb-0 py-2 pl-3">How was your experience?</p>
        <div class="pr-2">
          <v-btn
            class="ma-2"
            text
            icon
            color="blue lighten-2" :class="{ active: status === 1 }"
            @click="status = 1"
          >
            <v-icon>mdi-thumb-up</v-icon>
          </v-btn>

          <v-btn
            class="ma-2"
            text
            icon
            color="red lighten-2" :class="{ active: status === 2 }"
            @click="status = 2"
          >
            <v-icon>mdi-thumb-down</v-icon>
          </v-btn>
        </div>
      </v-row>
      <v-row v-if="status" class="pt-2">
        <v-col v-if="status === 1">
          <p class="text-center">Please leave a review on <a href="https://www.trustpilot.com/review/artistrepublik.com">Trust Pilot</a></p>
        </v-col>
        <v-col class="px-7" v-else>
          <v-textarea
            outlined
            label="Provide feedback to improve experience"
            rows="3"
            v-model="feedback"
          ></v-textarea>
          <v-btn
            color="info"
            class="submit-feedback mb-2"
            :disabled="feedback.length === 0 || loading"
            @click="submit"
          >
            <span v-if="loading">Submitting...</span>
            <span v-else>Submit</span>
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  props: ['from'],
  data: function () {
    return {
      status: 0,
      feedback: '',
      loading: false,
      response: false
    }
  },
  methods: {
    submit: async function () {
      this.loading = true

      let thumbsUp = this.status === 1
      await Vue.$http.post('v1/feedback', { feedback: this.feedback, thumbs_up: thumbsUp, feedback_from: this.from }).then((response) => {
        console.log(response)
      }).catch((error) => {
        console.log(error)
      })
      this.loading = false
      this.response = true
    }
  }
}
</script>

<style scoped>
.feedback-wrap {
  padding: 10px 0;
  margin: 16px;
}

.feedback-content {
  background-color: rgba(33, 150, 243, 0.2);
  border-radius: 3px;
  color: #2196f3 !important;
  caret-color: #2196f3 !important;
}

.submit-feedback {
  float: right;
}
</style>

<style>
.feedback-content .v-btn.active::before {
  opacity: 0.5;
}

.feedback-content .v-textarea.v-text-field--enclosed.v-text-field--outlined .v-label {
  top: 18px;
}

.feedback-content .v-textarea.v-text-field--enclosed.v-text-field--outlined:not(.v-input--is-focused, .v-input--is-label-active) .v-label {
  top: 10px;
}
</style>
