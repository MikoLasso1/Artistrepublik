<template>
  <v-container fluid>
    <v-form class="" @submit.prevent="login">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="email"
            dark
            validate-on-blur
            label="Email"
            :rules="[rules.required, rules.email]"
            prepend-inner-icon="mdi mdi-email"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="password"
            dark
            validate-on-blur
            label="Password"
            type="password"
            :rules="[rules.required]"
            prepend-inner-icon="mdi mdi-lock"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="5" offset="1" class="text-left">
          <v-btn type="button" block class="artist-button" @click="$emit('cancel')">Cancel</v-btn>
        </v-col>
        <v-col cols="5" class="text-right">
          <v-btn type="submit" block class="artist-button" @click.prevent="login">Login</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" v-if="error" class="alert">
          <small>
            The information you entered does not match our records!
          </small>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <router-link to="/password/reset" class="text-white">
            <small>Forgot password?</small>
          </router-link>
        </v-col>
      </v-row>
      <v-row class="mt-3">
        <v-col cols="10" offset="1" class="d-flex justify-center px-2">
          <login-with-providers />
        </v-col>
      </v-row>
    </v-form>

  </v-container>
</template>

<script>
import LoginWithProviders from '@/components/LoginWithProviders'

export default {
  name: 'Login',
  components: {
    LoginWithProviders
  },
  data: () => ({
    //login
    email: '',
    password: '',
    error: false,
    rules: {
      required: value => !!value || 'Required.',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
      }
    }
  }),
  methods: {
    login () {
      this.$store.dispatch('login', { email: this.email, password: this.password })
        .then(res => {
          this.$router.push({ name: 'dashboard' })
          return res
        })
        .catch((err) => {
          console.log(err)
          this.error = true
        })
    }
  }
}
</script>

<style scoped>

</style>
