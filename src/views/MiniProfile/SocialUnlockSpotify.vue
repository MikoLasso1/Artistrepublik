<template>
  <div>
    <v-row no-gutters class="justify-center">
      <v-col sm="6" class="vh100 bg-light-gray">
        <div class="align-self-center v-center parent">
          <div class="text-center"><img src="/img/brand/logo.png" width="200" class="mb-5" alt="Artist Republik Logo" loading="lazy" /></div>
          <div>
            <v-card class="mx-auto" color="#f8f9fe" elevation="0" max-width="600">
              <v-card-text class="headline">
                <div class="mt-3 mb-3">
                  <blockquote class="blockquote text-center mb-0" v-if="processing || error || artistFollowed">
                    <span v-if="processing">Please wait. Processing Request ...</span>
                    <span v-else-if="error">Error Occured while procesing. Please try again.</span>
                    <span v-else-if="artistFollowed">Artist Followed successfully. Redirecting ...</span>
                    <span v-else-if="trackAddedToPlaylist">Track has been added to playlist successfully. Redirecting ...</span>
                  </blockquote>


                  <div v-if="artistOrPlaylist === 'playlist'">
                    <!--track details::start-->
                    <blockquote class="blockquote text-center mb-0" v-if="this.track.link">Track details</blockquote>
                    <v-card max-width="344" class="mx-auto" elevation="0" v-if="this.track.link">
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title :href="track.link" class="headline">{{ track.name }}</v-list-item-title>
                          <v-list-item-subtitle>by {{ track.artistName }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>

                      <v-img :src="track.image" height="200" alt="track image" loading="lazy"></v-img>
                    </v-card>
                    <!--track details::end-->

                    <!-- playlist info::start-->
                    <v-form ref="form" v-model="valid" v-if="playList.length">
                      <h3 class="mt-5 mb-0">Select Playlist</h3>
                      <v-select
                        :items="playList"
                        label="Select Playlist"
                        item-text="name"
                        item-value="id"
                        v-model="selectedList"
                        :rules="selectListRules"
                      ></v-select>
                      <div class="text-center">
                        <v-btn
                          :loading="processing"
                          :disabled="processing || !selectedList"
                          @click="addTrackToList()"
                          color="primary"
                          class="mt-5"
                        >Add Song to Playlist
                        </v-btn>
                      </div>
                    </v-form>
                    <!-- playlist info::end-->
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import config from '@/config'
import Vue from 'vue'
import querystring from 'querystring'

export default {
  data () {
    return {
      valid: false,
      code: this.$route.query.code,
      state: this.$route.query.state,
      error: null,
      processing: false,
      playList: [],
      artistOrPlaylist: 'playlist',
      selectedList: null,
      selectListRules: [v => !!v || 'Please select one option'],
      artistFollowed: false,
      trackAddedToPlaylist: false,
      track: {
        image: null,
        name: null,
        link: null,
        artistName: null
      },
      trackId: null,
      unlockId: null,
      fanId: null,
      accessToken: null
    }
  },
  methods: {
    async getAccessToken () {
      this.processing = true

      //header to get access token
      const headers = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${this.encodedBasicSpotifyId}`
        }
      }

      //data to get access token
      const data = {
        grant_type: 'authorization_code',
        code: this.code,
        redirect_uri: `${config.APP_URL}unlock/spotify/`
      }

      try {
        //request for access token
        const response = await Vue.$http.post(
          'https://accounts.spotify.com/api/token',
          querystring.stringify(data),
          headers
        )

        if (response.data.access_token) {
          this.accessToken = response.data.access_token
          //send follow request
          let stateVars = this.state.split(',')

          //if access token check if request is to follow artist or Add track to list
          if (stateVars[3] === 'artist') {
            this.artistOrPlaylist = 'artist'
            if (stateVars[0] && stateVars[1] && stateVars[2]) {
              const headersFollow = {
                headers: {
                  Accept: 'application/json',
                  Authorization: `Bearer ${response.data.access_token}`
                }
              }

              //request to follow artist
              const responseFollow = await Vue.$http.put(
                `${config.SPOTIFY_API_URL}me/following?type=artist&ids=${stateVars[2]}`,
                {},
                headersFollow
              )

              if (responseFollow.status === 204) {
                this.artistFollowed = true
                let data = {
                  unlock_id: stateVars[0],
                  followed_spotify: 1
                }

                //update fan data
                await Vue.$http.put(`v1/social-unlock-fan/${stateVars[1]}`, data)
                this.$router.push({
                  path: `/unlock/${stateVars[0]}/fan/${stateVars[1]}`
                })
              } else {
                this.error = true
              }
            }
          } else if (stateVars[3] === 'playlist') {
            this.artistOrPlaylist = 'playlist'

            if (stateVars[0] && stateVars[1] && stateVars[2]) {
              this.unlockId = stateVars[0]
              this.fanId = stateVars[1]
              this.trackId = stateVars[2]

              //get track details
              const resTrack = await Vue.$http.get(
                `${config.SPOTIFY_API_URL}tracks/${stateVars[2]}`,
                {
                  headers: {
                    Authorization: `Bearer ${response.data.access_token}`
                  }
                }
              )

              if (resTrack.status === 200) {
                let trackData = resTrack.data
                this.track.name = trackData.name
                this.track.image = trackData.album.images[1].url
                this.track.link = trackData.external_urls.spotify
                this.track.artistName = trackData.artists[0].name
              }


              //get all track lists for current access token
              const resLists = await Vue.$http.get(
                `${config.SPOTIFY_API_URL}me/playlists`,
                {
                  headers: {
                    Authorization: `Bearer ${response.data.access_token}`
                  }
                }
              )

              if (resLists.status === 200) {
                this.artistOrPlaylist = 'playlist'
                let playListItems = resLists.data.items
                if (playListItems.length) {
                  playListItems.forEach(list => {
                    this.playList.push({
                      name: list.name,
                      id: list.id
                    })
                  })
                }
              }
            }
          }
        }
        this.processing = false
      } catch (error) {
        this.$sentry.captureException(error)
        this.error = true
      }
    },
    async addTrackToList () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }

      if (this.selectedList && this.trackId && this.unlockId && this.fanId) {
        const headersFollow = {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        }

        //add track to the list
        const responseAddToList = await Vue.$http.post(
          `${config.SPOTIFY_API_URL}playlists/${this.selectedList}/tracks?uris=spotify:track:${this.trackId}`,
          {},
          headersFollow
        )

        if (responseAddToList.status === 201) {
          this.trackAddedToPlaylist = true
          let data = {
            unlock_id: this.unlockId,
            added_to_playlist: 1
          }

          //update fan data
          await Vue.$http.put(`v1/social-unlock-fan/${this.fanId}`, data)
          this.$router.push({
            path: `/unlock/${this.unlockId}/fan/${this.fanId}`
          })
        } else {
          this.error = true
        }
      }

      this.trackAddedToPlaylist = true
    }
  },
  computed: {
    encodedBasicSpotifyId () {
      return window.btoa(
        `${config.SPOTIFY_CLIENT_ID}:${config.SPOTIFY_CLIENT_SECRET}`
      )
    }
  },
  mounted () {
    this.getAccessToken()
  }
}
</script>

