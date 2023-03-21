<template>
  <div class="userminiprofile">
    <v-card class="userminiprofile-card card">
      <v-card-title>
        <h2 class="userminiprofile-heading">Artist Links</h2>
      </v-card-title>
      <v-card-subtitle>
        Manage Links and Promote Your Brand
      </v-card-subtitle>
      <v-card-actions class="justify-center userminiprofile-card-actions">
        <picture>
          <source srcset="/img/dashboard/miniprofile_sm.webp" type="image/webp">
          <img src="/img/dashboard/miniprofile_sm.png" width="100" alt="Layout Preview" loading="lazy" />
        </picture>
      </v-card-actions>
      <v-card-text class="text-center">
        <h3 class="userminiprofile-description-heading">Start Promoting Your Link!</h3>
        <p class="userminiprofile-description">Instantly take your music marketing campaigns to the next level.</p>
        <v-btn color="success" @click="showSettings()" v-if="planAlready">Set Up Your Links</v-btn>
        <v-btn color="success" v-else @click="startMiniProfile()" :loading="processing" :disabled="processing">Start Now</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      username: this.$store.getters.getSettings.account.general.username,
      planAlready: false,
      processing: false
    }
  },
  methods: {
    ...mapActions({
      getPlan: 'MiniProfile/getPlan',
      fetchSettings: 'fetchSettings'
    }),
    showSettings () {
      this.$router.push({ name: 'artist.links.settings' })
    },
    async getAlreadySelectedPlan () {
      let layoutResponse = await Vue.$http.get(`v1/user/mini-profile/layout`, {
        params: { username: this.username }
      })
      if (layoutResponse.status === 200) {
        this.planId = layoutResponse.data.data.plan_id

        if (typeof layoutResponse.data.data !== 'undefined' && this.planId) {
          this.planAlready = true
        }
      }
    },
    async startMiniProfile () {
      this.processing = true
      try {
        let buyLayoutResponse = await Vue.$http.post(
          `v1/user/mini-profile/layout`,
          {
            plan_id: 1
          }
        )

        this.planId = buyLayoutResponse.data.data.plan_id
        this.fetchSettings().then(() => {
          this.$router.push({ name: 'artist.links.design' })
        })
        this.$emit('start-plan')
        this.getPlan(this.username)
        this.processing = false
      } catch (error) {
        this.$noty.warning('Error Occurred while processing request.')
        this.showOverlay = false
      }
    }
  },
  mounted () {
    this.getAlreadySelectedPlan()
  }
}
</script>
<style>
.userminiprofile,
.userminiprofile-card {
  height: 100%;
}

.userminiprofile-card {
  justify-content: space-between;
}

.userminiprofile-heading {
  margin: 0;
}

.userminiprofile-description-heading {
  font-family: "Montserrat-SemiBold", sans-serif;
  font-size: 1.25rem;
}

.userminiprofile-description {
  text-transform: uppercase;
  font-family: "Montserrat-Light", sans-serif;
  font-size: 0.9rem;
}

.userminiprofile-card-actions {
  min-height: 123px;
}
</style>
