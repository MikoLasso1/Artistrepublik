<template>
  <div>
    <div
      v-if="error"
      class="alert alert-danger"
    >
      {{ error }}
    </div>
    <div class="text-center">
      <picture>
        <source srcset="/img/curator/curator_sm.webp" type="image/webp">
        <img src="/img/curator/curator_sm.png" alt="disc in sleeve" loading="lazy" />
      </picture>
    </div>
    <ul>
      <li>List a playlist</li>
      <li>Discover new music</li>
      <li>Get paid to provide feedback</li>
      <li>Choose to add new music to your leading playlists</li>
      <li id="small-bullet"><span>*Please allow 72hrs for a Curator to review each of your submissions to their playlists. If your submission is approved, please then allow another week for the song to be actually added to the playlist (as Curators add music on their own schedules)</span>
      </li>
    </ul>
    <div class="text-center">
      <b-form-checkbox
        id="agree-terms"
        v-model="agreeStatus"
        name="agree-terms"
        value="accepted"
        unchecked-value="not_accepted"
      >
        I agree to
        <a
          :href="termConditionsUrl"
          target="_blank"
        >Terms and Conditions</a>
      </b-form-checkbox>
      <v-btn
        color="primary"
        @click="onContinue"
      >
        Continue
      </v-btn>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default {
  data: function () {
    return {
      error: null,
      agreeStatus: false,
      termConditionsUrl: 'https://arepublik-static.s3.amazonaws.com/documents/curator+hub+T%26C.pdf'
    }
  },
  computed: {
    ...mapGetters({
      settings: 'getSettings',
      user: 'getUser'
    })
  },
  methods: {
    onContinue: async function () {
      //TODO show error
      if (this.agreeStatus) {
        Vue.$http.post('v1/service/playlist-republik/curator', {
          external_user_id: this.user.id,
          email: this.user.email,
          first_name: this.user.fname,
          last_name: this.user.lname,
          spotify_id: this.settings.account.spotify.spotify_artist_id
        })
          .then(response => {
            if (response.data.data.error) {
              //TODO format error message
              this.error = response.data.data.error
              return
            }
            // Vue.$http.get("v1/spotify/refresh");
            this.$emit('curator-created', response.data.data)
            this.$emit('next-step')
          })
          .catch(err => console.log(err))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.icon {
  font-size: 100px;
  width: 100px;
  height: 100px;
}

ul {
  margin-top: 15px;
  text-align: center;
  list-style: none;
  margin-left: -5%;
}

button {
  margin-top: 15px;
}

#small-bullet {
  font-size: 0.6rem;
  width: 50%;
  margin: auto;
  padding-top: 20px;
}
</style>
