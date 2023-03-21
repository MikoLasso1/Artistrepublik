<template>
  <div>
    <base-header
      class="header align-items-center"
    >
      <span class="mask bg-gradient-custom opacity-8"></span>
      <div class="container-fluid align-items-center"></div>
    </base-header>
    <v-container>
      <v-row class="justify-center">
        <v-col sm="10" md="6" xl="5" class="card-parent">
          <VuetifyProgressDialog message="Processing..." v-if="processing"></VuetifyProgressDialog>
          <v-card class="mx-auto">
            <div class="align-self-center v-center parent text-center" v-if="!offer && !processing">
              <h3>Invalid Unlock ID</h3>
            </div>

            <div class="align-self-center v-center parent text-center" v-else>
              <v-avatar class="user-profile-image rounded-circle" v-if="profile.profile_photo">
                <img :src="profile.profile_photo" loading="lazy" alt="user" />
              </v-avatar>

              <h3 class="mt-4 mb-0">{{ profile.artist_name }}</h3>
              <p class="text--secondary mb-0">
                <v-icon>mdi-google-maps</v-icon>
                {{ profile.hometown }}
                <span v-if="city">, {{ city }}</span>
                <span v-if="country">, {{ country }}</span>
              </p>

              <v-row justify="center">
                <v-col md="4" sm="4" xl="4" class="text-center">
                  <h3 class="mb-0">{{ repPoints }}</h3>
                  <p class="mb-0">Reps</p>
                </v-col>
                <v-col md="4" sm="4" xl="4" class="text-center">
                  <h3 class="mb-0">{{ tracks }}</h3>
                  <p class="mb-0">Songs</p>
                </v-col>
                <v-col md="4" sm="4" xl="4" class="text-center">
                  <h3 class="mb-0">{{ shows }}</h3>
                  <p class="mb-0">Shows</p>
                </v-col>
              </v-row>

              <AppLogos :layout-id="4" :username="username" v-if="username" class="mt-4 pl-2 pr-2"></AppLogos>

              <!-- step1::start-->
              <div v-if="start === false && completed === false">
                <v-card
                  class="mx-auto mt-5"
                  color="grey lighten-2"
                  elevation="0"
                  v-if="offerDescription"
                >
                  <v-card-text>
                    <blockquote class="blockquote">
                      {{ offerDescription }}
                    </blockquote>
                  </v-card-text>
                </v-card>
                <div id="user-must-follow">
                  <h3 class="mt-5">To Unlock you must...</h3>
                  <ol>
                    <li v-for="option in selectedOptions" :key="option.id">
                      {{ option.option_details.name_frontend }}
                    </li>
                  </ol>
                </div>

                <v-btn class="mt-5 mb-5" color="indigo" x-large dark outlined @click="start = true">
                  <v-icon>mdi-chevron-double-right</v-icon>
                  UNLOCK &nbsp; &nbsp;<v-icon>mdi-lock</v-icon>
                </v-btn>
              </div>
              <!-- step1::end-->

              <!-- step3::start-->
              <div v-if="completed === true">
                <h1 class="mb-5 mt-5">You Unlocked</h1>
                <v-card
                  class="mx-auto"
                  color="grey lighten-2"
                  elevation="0"
                  max-width="400"
                >
                  <v-card-text class="headline font-weight-bold">
                    {{ offer }}
                  </v-card-text>
                </v-card>

                <v-btn :href="downloadUrl" class="mt-5 mb-5" color="indigo" x-large dark outlined @click="start = true">
                  <v-icon>mdi-chevron-double-right</v-icon>
                  GO TO OFFER &nbsp; &nbsp;<v-icon>mdi-lock-open</v-icon>
                </v-btn>
              </div>
              <!-- step3::end-->

              <!-- step2::start-->
              <div v-if="start === true && completed === false">
                <h1 class="mt-5">Complete To Unlock</h1>
                <v-card
                  class="mx-auto mt-5"
                  color="grey lighten-2"
                  elevation="0"
                  v-if="offerDescription"
                >
                  <v-card-text>
                    <blockquote class="blockquote">
                      {{ offerDescription }}
                    </blockquote>
                  </v-card-text>
                </v-card>
                <div>
                  <validation-errors :errors="validationErrors" />
                </div>

                <v-row class="justify-center">
                  <v-col cols="10">
                    <v-text-field
                      v-on:blur="updateFan()"
                      v-model="name"
                      label="Name"
                      md="6"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-on:blur="updateFan()"
                      v-if="this.userMustFollow.includes(3)"
                      v-model="email"
                      label="Email Address"
                      md="6"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-on:blur="updateFan()"
                      v-if="this.userMustFollow.includes(4)"
                      v-model="phoneNumber"
                      label="Phone"
                      md="6"
                      required
                    ></v-text-field>


                    <v-btn color="primary" class="mb-5" large dark outlined v-if="this.followSpotify">
                      Connected With Spotify
                    </v-btn>
                    <div v-else-if="this.userMustFollow.includes(1) && this.fanId !== null">
                      <p class="text-center"><strong>Click connect to follow me on Spotify</strong></p>
                      <v-btn :href="spotifyConnectUrl" color="primary" class="mb-5" large dark outlined>
                        <v-icon>mdi-heart-plus-outline</v-icon> &nbsp; &nbsp;Connect With Spotify
                      </v-btn>
                    </div>

                    <v-btn color="primary" class="mb-5" large dark outlined v-if="this.AddSongToPlayList">
                      Added Song to Playlist
                    </v-btn>
                    <v-btn :href="spotifyAddTrackToList" color="primary" class="mb-5" large dark outlined v-else-if="this.userMustFollow.includes(2) && this.fanId !== null">
                      <v-icon>mdi-heart-plus-outline</v-icon> &nbsp; &nbsp;Add Song to Playlist
                    </v-btn>

                    <v-btn class="mt-5 mb-5" color="indigo" x-large dark outlined :loading="processing" :disabled="processing" @click="saveLock()">
                      <v-icon>mdi-chevron-double-right</v-icon>
                      Complete &nbsp; &nbsp;<v-icon>mdi-lock</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
              <!-- step3::end-->

            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import config from '@/config'
import Vue from 'vue'
import VuetifyProgressDialog from '@/shared/components/VuetifyProgressDialog'
import AppLogos from '../../components/MiniProfile/Features/AppLogos'
import validationErrorsMixin from '@/shared/mixins/ValidationErrorsMixin'

export default {
  mixins: [validationErrorsMixin],
  components: {
    VuetifyProgressDialog,
    AppLogos
  },
  data () {
    return {
      unlockId: this.$route.params.unlockId,
      fanId: this.$route.params.fanId ? this.$route.params.fanId : null,
      start: false,
      offer: null,
      offerDescription: null,
      downloadUrl: null,
      selectedOptions: null,
      userMustFollow: [],
      completed: false,
      name: null,
      email: null,
      phoneNumber: null,
      followSpotify: false,
      spotifyArtistId: null,
      AddSongToPlayList: false,
      followTwitter: false,
      followInstagram: false,
      processing: false,
      username: null,
      city: '',
      country: '',
      tracks: 0,
      shows: 0,
      repPoints: 0,
      profile: {
        artist_name: '',
        bio: '',
        hometown: '',
        profile_photo: '',
        stage: '',
        verified: ''
      }
    }
  },
  methods: {
    async getSocialUnlock () {
      this.processing = true
      try {

        let savedLockResponse = await Vue.$http.get(`v1/mini-profile/social-unlock/${this.unlockId}`)
        let savedLockData = savedLockResponse.data.data

        this.offer = savedLockData.offer_options.name
        this.offerDescription = savedLockData.offer_description
        this.downloadUrl = savedLockData.file_url

        this.selectedOptions = savedLockData.selected_options

        this.selectedOptions.forEach(option => {
          this.userMustFollow.push(option.follow_option_id)
          if (option.follow_option_id === 1 && option.url) {
            let urlSpotify = new URL(option.url)

            let pathName = urlSpotify.pathname
            let pathArr = pathName.split('/')

            this.spotifyArtistId = pathArr[2]
          }

          if (option.follow_option_id === 2 && option.url) {
            let urlSpotifyTrack = new URL(option.url)

            let pathNameTrack = urlSpotifyTrack.pathname
            let pathArrTrack = pathNameTrack.split('/')

            this.spotifyTrackId = pathArrTrack[2]
          }
        })


        if (this.fanId) {
          //get fan details

          let fanSavedResponse = await Vue.$http.get(`v1/social-unlock-fan/${this.fanId}`)
          let fanSavedResponseData = fanSavedResponse.data.data

          this.name = fanSavedResponseData.name
          this.email = fanSavedResponseData.email
          this.phoneNumber = fanSavedResponseData.phone
          this.followSpotify = fanSavedResponseData.followed_spotify
          this.AddSongToPlayList = fanSavedResponseData.added_to_playlist
          this.followTwitter = fanSavedResponseData.followed_twitter
          this.followInstagram = fanSavedResponseData.followed_instagram
        }

        this.username = savedLockData.user.username
        let response = await Vue.$http.get(`v1/user/mini-profile/profile`, {
          params: {
            username: this.username
          }
        })

        let res = response.data.data
        this.city = res.city
        this.country = res.country
        this.tracks = res.tracks
        this.shows = res.shows
        this.repPoints = res.rep_points
        Object.entries(res.profile).forEach(([key, val]) => {
          this.profile[key] = val
        })


        this.processing = false
      } catch (error) {
        this.processing = false
      }
    },
    async saveLock () {
      this.processing = true
      try {
        let completedSteps = []

        if (this.followSpotify)
          completedSteps.push(1)

        if (this.AddSongToPlayList)
          completedSteps.push(2)

        if (this.followTwitter)
          completedSteps.push(3)

        if (this.followInstagram)
          completedSteps.push(4)

        if (this.email)
          completedSteps.push(5)

        if (this.phoneNumber)
          completedSteps.push(6)

        if (completedSteps.length === this.userMustFollow.length) {

          await Vue.$http.put(`v1/social-unlock-fan/${this.fanId}`, {
            unlock_id: this.unlockId,
            name: this.name,
            followed_spotify: this.followSpotify,
            added_to_playlist: this.AddSongToPlayList,
            followed_twitter: this.followTwitter,
            followed_instagram: this.followInstagram,
            email: this.email,
            phone: this.phoneNumber,
            unlocked_at: true
          })

          this.completed = true
          this.$noty.success('Saved successfully.')
        } else {
          this.$noty.warning('Please complete all the options.')
        }

        this.processing = false
      } catch (error) {
        let items
        if (error.response.status === 400) {
          items = Object.values(error.response.data.data.message)
        } else if (error.response.status === 422) {
          items = Object.values(error.response.data.errors)
        }

        this.validationErrors = this.formatErrors(items)
        this.processing = false
      }
    },
    encodeURI (url) {
      return encodeURIComponent(url)
    },
    async updateFan () {
      if (this.processing === false) {
        this.processing = true

        let data = {
          unlock_id: this.unlockId,
          name: this.name,
          email: this.email,
          phone: this.phoneNumber,
          followed_spotify: this.followSpotify,
          added_to_playlist: this.AddSongToPlayList,
          followed_twitter: this.followTwitter,
          followed_instagram: this.followInstagram
        }

        try {
          let fanResponse
          if (this.fanId) {
            fanResponse = await Vue.$http.put(`v1/social-unlock-fan/${this.fanId}`, data)
          } else {
            fanResponse = await Vue.$http.post(`v1/social-unlock-fan`, data)
          }

          if (fanResponse.status === 201) {
            this.fanId = fanResponse.data.data.id
          }

          this.processing = false
        } catch (error) {
          this.$noty.warning('Error Occurred while processing request.')
          this.processing = false
        }
      }
    }
  },
  computed: {
    spotifyConnectUrl: function () {
      if (this.unlockId && this.fanId && this.spotifyArtistId) {
        let uri = this.encodeURI(`${config.APP_URL}unlock/spotify/`)
        return `https://accounts.spotify.com/authorize?client_id=${config.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${uri}&scope=user-read-private%20user-read-email%20user-follow-modify&state=${this.unlockId},${this.fanId},${this.spotifyArtistId},artist`
      } else {
        return ''
      }
      //working example
      // return `https://accounts.spotify.com/en/authorize?client_id=${config.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=https:%2F%2Fexample.com%2Fcallback&scope=user-read-private%20user-read-email&state=34fFs29kd09`;
    },

    spotifyAddTrackToList: function () {
      if (this.unlockId && this.fanId && this.spotifyTrackId) {
        let uri = this.encodeURI(`${config.APP_URL}unlock/spotify/`)
        return `https://accounts.spotify.com/authorize?client_id=${config.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${uri}&scope=user-read-private%20user-read-email%20playlist-read-private%20playlist-modify-private%20playlist-modify-public%20playlist-modify-private&state=${this.unlockId},${this.fanId},${this.spotifyTrackId},playlist`
      } else {
        return ''
      }
    }
  },
  mounted () {
    this.getSocialUnlock()
    if (this.$route.params.fanId)
      this.start = true
  }
}
</script>

<style scoped>
.bg-gradient-custom {
  /* background: rgb(172,44,156);
  background: linear-gradient(10deg, rgba(172,44,156,1) 50%, rgba(120,52,157,1) 100%); */
  background: rgb(207, 4, 79);
  background: linear-gradient(17deg, rgba(207, 4, 79, 1) 51%, rgba(68, 57, 136, 1) 100%);
}

.bg-light-gray {
  background-color: #f8f9fe;
}

.black-color {
  color: #000;
}

.white-color {
  color: #fff
}
</style>

<style scoped>
#user-must-follow {
  width: 260px;
  text-align: left;
  margin: 0 auto;
}

#user-must-follow ol {
  list-style-type: none;
  padding: 0;
}

#user-must-follow li {
  line-height: 2;
  counter-increment: must-follow-counter;
}

#user-must-follow li:before {
  content: counter(must-follow-counter);
  background: #443988;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: inline-block;
  line-height: 2rem;
  color: white;
  text-align: center;
  margin-right: 0.5rem;
  margin-bottom: 8px;
}

@media (max-width: 600px) {
  .top-padding {
    padding-top: 5rem !important;
  }

  .header {
    height: 150px;
  }

  .user-profile-image {
    margin-top: -70px;
    height: 125px !important;
    min-width: 125px !important;
    width: 125px !important;
  }

  .card-parent {
    margin-top: -64px;
  }
}

@media (min-width: 600px) {
  .header {
    height: 320px;
  }

  .user-profile-image {
    margin-top: -130px;
    height: 200px !important;
    min-width: 200px !important;
    width: 200px !important;
  }

  .card-parent {
    margin-top: -105px !important;
  }
}
</style>
