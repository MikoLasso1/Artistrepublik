<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <div class="card bg-secondary shadow border-0">
        <div
          v-if="req.token === ''"
          class="card-body px-lg-5 py-lg-5"
        >
          <div class="text-center display-3 mb-4 mt-2">
            Forgot Password
          </div>
          <div
            v-if="message"
            class="alert"
            :class="'alert-' + status"
          >
            {{ message }}
          </div>
          <form
            role="form"
            class="login"
            @submit.prevent=""
          >
            <base-input
              v-model="req.email"
              class="input-group-alternative mb-3"
              placeholder="Email"
              addon-left-icon="ni ni-email-83"
            />
            <div class="text-center">
              <v-btn
                dark
                color="primary"
                type="primary"
                native-type="submit"
                class="my-4"
                @click="forgotPassword"
              >
                Send Request
              </v-btn>
            </div>
          </form>
        </div>
        <div
          v-else
          class="card-body px-lg-5 py-lg-5"
        >
          <div class="text-center display-3 mb-4 mt-2">
            Reset Password
          </div>
          <div
            v-if="message"
            class="alert"
            :class="'alert-' + status"
          >
            {{ message }}
          </div>
          <form
            role="form"
            class="login"
            @submit.prevent=""
            aria-label="create password form"
          >
            <base-input
              v-model="req.email"
              class="input-group-alternative mb-3"
              placeholder="Email"
              addon-left-icon="ni ni-email-83"
              disabled
            />
            <base-input
              v-model="req.password"
              class="input-group-alternative mb-3"
              placeholder="Password"
              type="password"
              addon-left-icon="ni ni-lock-circle-open"
            />
            <base-input
              v-model="req.password_confirmation"
              class="input-group-alternative mb-3"
              placeholder="Password Confirmation"
              type="password"
              addon-left-icon="ni ni-lock-circle-open"
            />
            <div class="text-center">
              <v-btn
                dark
                color="primary"
                type="primary"
                native-type="submit"
                class="my-4"
                @click="resetPassword"
              >
                Reset Password
              </v-btn>
            </div>
          </form>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6">
          <router-link
            to="/login"
            class="text-white"
          >
            <small>Login</small>
          </router-link>
        </div>
        <div class="col-6 text-right">
          <router-link
            to="/register"
            class="text-white"
          >
            <small>Create new account</small>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Forgotpassword',
  data () {
    return {
      errors: [],
      status: null,
      message: null,
      req: {
        email: this.$route.params.email ? decodeURIComponent(this.$route.params.email) : '',
        token: this.$route.params.token || '',
        password: '',
        password_confirmation: ''
      }
    }
  },
  beforeMount () {
    if (this.req.token) {
      this.fetchResetRequest()
    }
  },
  methods: {
    forgotPassword () {
      this.$store.dispatch('forgotPasswordRequest', this.req.email)
        .then(res => {
          this.status = 'success'
          this.message = res.message
        })
        .catch(() => {
          // Catch the error
        })
    },
    fetchResetRequest () {
      this.$store.dispatch('validatePasswordReset', this.req.token)
        .then(res => {
          this.req.email = res.email
        })
        .catch(() => {
          this.req.token = ''
        })
    },
    resetPassword () {
      this.$store.dispatch('resetPasswordRequest', this.req)
        .then(res => {
          if (res.id) {
            this.$router.push('/login')
          }
        })
        .catch(() => {
          // Catch the error
        })
    }
  }
}
</script>
<style scoped>
</style>
