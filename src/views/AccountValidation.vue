<template>
  <div>
    <div class="card bg-secondary shadow border-0">
      <div class="card-body px-lg-5 py-lg-5 text-center">
        <div v-if="validated === null">
          <h3>Processing your request... Please hold...</h3>
        </div>

        <div v-if="validated">
          <h3>
            Successfully validated your account! You can proceed to login here
            <router-link to="/login">
              Login
            </router-link>
          </h3>
        </div>

        <div v-if="validated === false">
          <h3>Unable to validate that access token... Please try again later or contact us through<a href="https://info.artistrepublik.com/knowledge" target="_blank" rel="noopener">help</a>!</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {},
  data () {
    return {
      token: null
    }
  },
  computed: {
    validated: function () {
      return this.$store.getters.isValidated
    }
  },
  mounted () {
    this.token = this.$route.params.token || null

    if (!this.token) {
      window.location = '/'
      return
    }

    this.attemptValidation()
  },
  methods: {
    attemptValidation: function () {
      this.$store.dispatch('validate', this.token)
    }
  }
}
</script>
<style></style>
