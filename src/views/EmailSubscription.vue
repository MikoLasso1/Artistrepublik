<template>
  <v-container>
    <v-row justify="center">
      <v-col md="6">
        <v-card :loading="loading">
          <v-card-title>Email Preferences</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="onSubmit">
              <v-checkbox
                v-model="form.email_opt_in"
                type="checkbox"
                required
                label="Opt-in to emails from Artist Republik"
              >
              </v-checkbox>
              <v-btn type="submit" color="primary">Update</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue'

export default {
  data () {
    return {
      loading: false,
      form: {
        email_opt_in: true
      }
    }
  },
  methods: {
    onSubmit: async function () {
      this.loading = true
      try {
        await Vue.$http.put(`v1/email-preferences/${this.$route.query.token}`, this.form)
      } catch (err) {
        this.throwError(err)
      }
      this.loading = false
      this.$router.push({ name: 'home' })
    }
  },
  mounted: async function () {
    this.loading = true
    try {
      let { data: { data } } = await Vue.$http.get(`v1/email-preferences/${this.$route.query.token}`)
      this.form.email_opt_in = data.email_opt_in
    } catch (err) {
      this.throwError(err)
    }
    this.loading = false
  }
}
</script>

<style>
</style>
