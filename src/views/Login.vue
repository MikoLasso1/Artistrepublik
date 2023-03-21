<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5">
          <div class="text-center mb-4 display-3 w-100">
            Login
          </div>
          <div
            v-if="error"
            class="alert alert-danger text-center"
          >The information you entered does not match our records!
          </div>
          <form role="form" class="login" @submit.prevent="login">
            <base-input
              v-model="email"
              class="input-group-alternative mb-3"
              placeholder="Email"
              addon-left-icon="ni ni-email-83"
            />
            <base-input
              v-model="password"
              class="input-group-alternative"
              placeholder="Password"
              type="password"
              addon-left-icon="ni ni-lock-circle-open"
            />
            <base-checkbox class="custom-control-alternative">
              <span class="text-muted">Remember me</span>
            </base-checkbox>
            <div class="text-center">
              <v-btn dark color="primary" type="primary" native-type="submit" class="my-4">Sign in</v-btn>
            </div>
          </form>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6">
          <router-link to="/password/reset" class="text-white">
            <small>Forgot password?</small>
          </router-link>
        </div>
        <div class="col-6 text-right">
          <router-link to="/register" class="text-white">
            <small>Create new account</small>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: '',
      error: false,
      track: true
    }
  },
  methods: {
    login: function () {
      let email = this.email
      let password = this.password
      this.$store
        .dispatch('login', { email: email, password: password })
        .then(() => {
          this.error = false
          if ('to' in this.$route.query) {
            this.$router.push({
              path: this.$route.query.to, query: {
                cart_key: this.$route.query.cart_key,
                continue: this.$route.query.continue,
                tool: this.$route.query.tool
              }
            })
          } else if ('redirect' in this.$route.query) {
            this.$router.push(this.$route.query.redirect)
          } else {
            this.$router.push({ name: 'dashboard' })
          }
        })
        .catch(err => {
          if (err) {
            this.error = true
          }
        })
    }
  }
}
</script>
<style scoped>
.display-3 {
  font-size: 2.1875rem !important;
  font-weight: 600 !important;
  line-height: 1.5 !important;
  letter-spacing: normal !important;
  color: rgb(82, 95, 127);
}
</style>
