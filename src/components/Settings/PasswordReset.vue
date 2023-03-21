<template>
  <v-card :loading="loading">
    <v-card-title>Reset Password</v-card-title>
    <v-card-text>
      <v-alert v-model="alert" :type="messageType" dismissible>{{ message }}</v-alert>
      <v-form v-model="valid" @submit.prevent="onSubmit" ref="form">
        <v-text-field
          v-model="form.old_password"
          :append-icon="showOldPassword ? `mdi-eye` : `mdi-eye-off`"
          :rules="rules.old_password"
          :type="showOldPassword ? `text` : `password`"
          label="Old Password"
          @click:append="showOldPassword = !showOldPassword"
          required
          tabindex="1"
        ></v-text-field>
        <v-text-field
          v-model="form.password"
          :append-icon="showPassword ? `mdi-eye` : `mdi-eye-off`"
          :rules="rules.password"
          :type="showPassword ? `text` : `password`"
          name="input-10-1"
          label="New Password"
          hint="At least 8 characters"
          counter
          @click:append="showPassword = !showPassword"
          required
          tabindex="2"
        ></v-text-field>
        <v-text-field
          v-model="form.password_confirmation"
          :rules="rules.password_confirmation"
          type="password"
          label="Confirm Password"
          required
          tabindex="3"
        ></v-text-field>
        <v-btn color="primary" type="submit" :loading="loading">Submit</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from 'vue'

export default {
  data: function () {
    return {
      alert: false,
      message: '',
      messageType: 'success',
      valid: true,
      loading: false,
      showOldPassword: false,
      showPassword: false,
      rules: {
        old_password: [
          v => !!v || 'Old Password is required'
        ],
        password: [
          v => !!v || 'Password is required',
          v => (v && v.length >= 8) || 'Password must be at least 8 characters'
        ],
        password_confirmation: [
          v => !!v || 'Password verification is required',
          v => (v === this.form.password) || 'Passwords must match'
        ]
      },
      form: {
        old_password: '',
        password: '',
        password_confirmation: ''
      }
    }
  },
  methods: {
    onSubmit: async function () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.loading = true
      try {
        await Vue.$http.post('v1/settings/reset-password', this.form)
        this.loading = false
        this.message = 'Your password has been changed!'
        this.messageType = 'success'
      } catch (err) {
        console.error(err)
        this.loading = false
        this.message = 'Something went wrong!'
        this.messageType = 'error'
      }
      this.alert = true
    }
  }
}
</script>

<style>

</style>
