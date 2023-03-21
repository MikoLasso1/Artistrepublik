<template>
  <div>
    <h3 class="h3">Instagram</h3>
    <v-alert v-model="alert" :type="messageType" dismissible>{{ message }}</v-alert>
    <v-btn v-if="!instagramEnabled" color="#e4405f" dark min-width="100%" @click="goToInstagram">
      <v-icon left dark>mdi-instagram</v-icon>
      Connect Instagram
    </v-btn>
    <v-dialog v-else v-model="confirmationAlert" max-width="290">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="red"
          dark
          min-width="100%"
          v-bind="attrs"
          v-on="on"
        >
          Disconnect Instagram
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">Disconnect Insagram?</v-card-title>
        <v-card-text>Are you sure you want to disconnect your instagram account?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmationAlert = false">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="doDisconnect">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Vue from 'vue'
import config from '../../../config'

export default {
  props: {
    instagramEnabled: Boolean
  },
  data: function () {
    return {
      alert: false,
      messageType: 'success',
      message: '',
      confirmationAlert: false
    }
  },
  computed: {
    instagramUrl: function () {
      return `https://api.instagram.com/oauth/authorize?client_id=${config.INSTAGRAM_APP_ID}&redirect_uri=${config.APP_URL}settings&scope=user_profile&response_type=code`
    }
  },
  methods: {
    ...mapActions({
      fetchSettings: 'fetchSettings'
    }),
    goToInstagram: function () {
      window.localStorage.setItem('code_type', 'instagram')
      window.location = this.instagramUrl
    },
    doDisconnect: async function () {
      await Vue.$http.delete('v1/instagram')
      await this.fetchSettings()
      this.confirmationAlert = false
    }
  },
  created: async function () {
    if (this.$route.query.code && window.localStorage.getItem('code_type') === 'instagram') {
      try {
        await Vue.$http.post('v1/instagram', { code: this.$route.query.code })
        this.messageType = 'success'
        this.message = 'Instagram Account Linked!'
      } catch (err) {
        console.error(err)
        this.messageType = 'error'
        this.message = 'An unknown error has occured!'
      }
      this.alert = true
      this.fetchSettings()
      window.localStorage.removeItem('code_type')
    }
  }
}
</script>

<style>

</style>
