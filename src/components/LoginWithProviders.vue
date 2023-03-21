<template>
  <div class="text-center">
    <v-btn color="rgb(59, 89, 152)" dark @click="login('facebook')" min-width="300px">
      <v-icon left>mdi-facebook</v-icon>
      Register with Facebook
    </v-btn>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  methods: {
    login: async function (provider) {
      if (this.$route.query.ref) {
        localStorage.setItem('refer', this.$route.query.ref)
      }
      if ('redirect' in this.$route.query) {
        localStorage.setItem('redirect', this.$route.query.redirect)
      }
      let { data: { url } } = await Vue.$http.get(`v1/auth/provider/${provider}`)
      window.location = url
    }
  }
}
</script>

<style>

</style>
