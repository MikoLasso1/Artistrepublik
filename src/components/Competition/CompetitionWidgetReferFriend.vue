<template>
  <div>
    <v-form ref="form" @submit.prevent v-model="valid">
      <v-alert v-show="success" color="success">
        Thanks for sharing.
      </v-alert>
      <v-alert v-show="errors" color="danger">
        <p class="mb-0" v-if="error500">{{ error500 }}</p>
        <p v-else>Sorry! These users have already been invited or are already a members.</p>
        <ul v-if="errorsEmails.length">
          <li v-for="(error, index) in errorsEmails" :key="index">
            {{ error }}
          </li>
        </ul>
      </v-alert>
      <v-text-field v-model="email_1" :rules="emailRule1" label="E-mail" required />
      <v-text-field v-model="email_2" :rules="emailRule2" label="E-mail" required />
      <v-text-field v-model="email_3" :rules="emailRule3" label="E-mail" required />
      <v-card-actions class="pa-0">
        <v-btn color="primary" class="mt-4" type="submit" :disabled="loading" @click="onSubmitRefer">
          <span v-if="!loading">Submit</span>
          <span v-if="loading">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          Processing...
        </span>
        </v-btn>
        <v-spacer />
        <v-btn color="primary" class="mt-4" type="submit" @click="success = false; $emit('hide-modal')" v-if="success">
          Done
        </v-btn>
      </v-card-actions>
    </v-form>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  props: ['isShowDoneBtn'],
  data () {
    return {
      valid: true,
      email_1: null,
      email_2: null,
      email_3: null,
      success: null,
      errors: false,
      loading: false,
      errorsEmails: [],
      error500: false,
      emailRule1: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        v => !(v === this.email_2 || v === this.email_3) || 'All email fields should be unique.',
      ],
      emailRule2: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        v => !(v === this.email_1 || v === this.email_3) || 'All email fields should be unique.',
      ],
      emailRule3: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        v => !(v === this.email_1 || v === this.email_2) || 'All email fields should be unique.',
      ],
    }
  },
  watch: {
    isShowDoneBtn (val) {
      if (val) {
        this.$refs.form.reset()
        this.success = null
      }
    },
  },
  methods: {
    onSubmitRefer () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      let invites = []
      this.loading = true
      this.success = false
      this.errors = false
      this.errorsEmails = []
      this.error500 = false
      invites.push(this.email_1)
      if (this.email_2)
        invites.push(this.email_2)

      if (this.email_3)
        invites.push(this.email_3)

      Vue.$http.post(`v1/competition/invites`, { 'invites': invites }).then(() => {
        this.success = true
      }).catch(error => {
        this.errors = true
        if (error.response.status === 422) {
          this.errorsEmails = error.response.data
        }
        if (error.response.status === 500) {
          this.error500 = 'Error Occurred while processing request.'
        }
      }).then(() => {
        this.email_1 = ''
        this.email_2 = ''
        this.email_3 = ''
        this.loading = false
        this.$refs.form.reset()
        // this.$emit('hide-modal');
      })

    },
  },
}
</script>
