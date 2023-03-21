<template>
  <div>
    <header
      class="header pb-9 pt-5 pt-lg-8 d-flex align-items-center text-center settings-header"
    >
      <div class="container-fluid d-flex align-items-center">
        <v-row>
          <v-col cols="12">
            <h1 class="display-2 text-white">
              <v-icon class="display-2" dark>mdi-tools</v-icon>
              Settings
            </h1>
          </v-col>
        </v-row>
      </div>
    </header>
    <v-container v-if="loading">
      <v-card>
        <v-card-text class="text-center">
          <v-progress-circular indeterminate size="64" color="purple"></v-progress-circular>
        </v-card-text>
      </v-card>
    </v-container>
    <v-container class="mt--9" style="z-index: 999;" v-if="!loading">
      <v-row>
        <v-col md="8">
          <account :settings="settings" class="mb-4" />
        </v-col>
        <v-col md="4">
          <UpdateProfilePhoto :profile-image="user.profile_photo" />
          <integrations :settings="settings" />
          <password-reset class="my-4" />
          <spotify-connect :settings="settings" class="my-4" />
        </v-col>
      </v-row>
      <v-row>
        <v-col md="3">
          <delete-account />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Account from '@/components/Settings/Account'
import PasswordReset from '@/components/Settings/PasswordReset'
import UpdateProfilePhoto from '@/components/Settings/UpdateProfilePhoto'
import Integrations from '@/components/Settings/Integrations'
import SpotifyConnect from '@/components/Spotify/SpotifyAPI.vue'
import DeleteAccount from '@/components/Settings/DeleteAccount'

export default {
  components: {
    Account,
    PasswordReset,
    UpdateProfilePhoto,
    Integrations,
    SpotifyConnect,
    DeleteAccount
  },
  metaInfo () {
    return {
      title: 'Settings',
      meta: [
        {
          vmid: 'og:url',
          property: 'og:url',
          content: 'https://app.artistrepublik.com' + this.$route.fullPath
        }
      ]
    }
  },
  data () {
    return {
      track: true,
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      user: 'getUser',
      settings: 'getSettings'
    })
  },
  created: async function () {
    await this.$store.dispatch('getGenres')
    this.loading = true
    await this.$store.dispatch('fetchSettings')
    this.loading = false
  }
}
</script>

<style>
.settings-header {
  min-height: 400px;
  background-image: url(/img/bg/settingsBG.png);
  background-size: cover;
  background-position: center top;
}

.webp .settings-header {
  background-image: url(/img/bg/settingsBG.webp);
}
</style>
