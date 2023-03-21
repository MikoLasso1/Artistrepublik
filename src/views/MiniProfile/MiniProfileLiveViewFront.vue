<template>
  <div>
    <DefaultCoverDesign :bg-details="coverBgDetails" />
    <v-container>
      <v-row justify="center">
        <v-col md="6" sm="10" xl="5" class="mb-5 text-center card-parent">
          <VuetifyProgressDialog
            message="Processing..."
            v-if="processing"
          ></VuetifyProgressDialog>
          <v-card class="mx-auto">
            <v-card-text>
              <v-row justify="center" v-if="!processing">
                <v-col cols="12" class="text-center mt-2 mb-2">
                  <v-row
                    v-for="(element, index) in layoutData"
                    :key="index"
                    no-gutters
                  >
                    <v-col>
                      <div v-if="Array.isArray(element.componentFE)">
                        <div
                          v-for="(element1, index1) in element.componentFE"
                          :key="index1"
                        >
                          <component
                            v-bind:is="`${element1}`"
                            v-bind="componentData"
                          ></component>
                        </div>
                      </div>
                      <component
                        v-else
                        v-bind:is="`${element.componentFE}`"
                        v-bind="componentData"
                      ></component>
                      <p class="m-4"></p>
                    </v-col>
                  </v-row>

                  <v-row
                    justify="center"
                    v-if="!processing && profile.planId === 1"
                  >
                    <v-col class="text-center mt-2 mb-2">
                      <h2>
                        Sponsored by
                        <a
                          href="http://artistrepublik.com" target="_blank"
                        >Artist Republik</a
                        >.
                      </h2>
                      <a
                        href="http://artistrepublik.com" target="_blank"
                      >Sign up FREE </a
                      >today and get your own layout!
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import Vue from 'vue'
import DefaultCoverDesign from '@/components/MiniProfile/Features/DefaultCoverDesign'
import VuetifyProgressDialog from '@/shared/components/VuetifyProgressDialog'

import BasicListenLinks from '@/components/MiniProfile/Features/BasicListenLinks'
import BasicCustomLinks from '@/components/MiniProfile/Features/BasicCustomLinks'
import FeaturedMedia from '@/components/MiniProfile/Features/FeaturedMedia'
import StreamNow from '@/components/MiniProfile/Features/StreamNow'
import ArtistMedia from '@/components/MiniProfile/Features/ArtistMedia'
import MiniProfileShowListHorizontal from '@/components/MiniProfile/Features/MiniProfileShowListHorizontal'
import MiniProfileMerchandiseListHorizontal from '@/components/MiniProfile/Features/MiniProfileMerchandiseListHorizontal'
import DefaultHeader from '@/components/MiniProfile/Features/DefaultHeader'
import PremiumHeader from '@/components/MiniProfile/Features/PremiumHeader'
import SocialUnlock from '@/components/MiniProfile/Live/SocialUnlock'
import FeaturedTrack from '@/components/MiniProfile/Features/FeaturedTrack'
import MiniProfileTopTracksList from '@/components/MiniProfile/Features/MiniProfileTopTracksList'
import AppLogos from '@/components/MiniProfile/Features/AppLogos'
import FeaturedMerchandise from '@/components/MiniProfile/Features/FeaturedMerchandise'
import FeaturedShow from '@/components/MiniProfile/Features/FeaturedShow'
import MiniProfileSpotifyFollowButton from '@/components/MiniProfile/Features/MiniProfileSpotifyFollowButton'

export default {
  name: 'MiniProfileLiveViewFront',
  components: {
    DefaultCoverDesign,
    VuetifyProgressDialog,
    BasicListenLinks,
    BasicCustomLinks,
    FeaturedMedia,
    StreamNow,
    ArtistMedia,
    MiniProfileShowListHorizontal,
    MiniProfileMerchandiseListHorizontal,
    DefaultHeader,
    PremiumHeader,
    SocialUnlock,
    FeaturedTrack,
    MiniProfileTopTracksList,
    AppLogos,
    FeaturedMerchandise,
    FeaturedShow,
    MiniProfileSpotifyFollowButton
  },
  metaInfo () {
    return {
      title: 'Artist Links',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content:
            'Artist Republik is a 360 degree platform offering Artist Links to help grow your career! We offer reviews, mastering, distribution, playlisting, and more!'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content:
            'Artist Links | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content:
            'Artist Republik is a 360 degree platform offering Artist Links to help grow your career! We offer reviews, mastering, distribution, playlisting, and more!'
        },
        {
          vmid: 'og:url',
          property: 'og:url',
          content: 'https://app.artistrepublik.com' + this.$route.fullPath
        },
        {
          vmid: 'twitter:title',
          property: 'twitter:title',
          content:
            'Artist Links | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Artist Republik is a 360 degree platform offering Artist Links to help grow your career! We offer reviews, mastering, distribution, playlisting, and more!'
        }
      ]
    }
  },
  data () {
    return {
      userNameRoute: this.$route.params.username,
      layoutId: this.$route.params.layoutId,
      username: null,
      processing: false,
      layoutName: null,
      layoutData: [],
      coverBgDetails: {
        cover_type: null,
        cover_bg_color: null,
        cover_bg_image: null
      },
      profile: {
        artist_name: '',
        bio: '',
        profile_photo: '',
        stage: '',
        verified: '',
        city: '',
        country: '',
        tracks: 0,
        shows: 0,
        repPoints: 0,
        spotify_artist_id: null,
        unlockId: null,
        planId: null,
        isOldUser: null
      }
    }
  },
  methods: {
    async getData () {
      this.processing = true
      try {
        //check if username is custom
        let customProfileRes = await Vue.$http.get(
          `v1/user/mini-profile/domain/custom`,
          {
            params: {
              username: this.userNameRoute
            }
          }
        )

        if (customProfileRes.data.is_custom) {
          this.username = customProfileRes.data.username
        } else {
          this.username = this.userNameRoute
        }

        let responseProfile = await Vue.$http.get(
          `v1/user/mini-profile/profile`,
          {
            params: {
              username: this.username
            }
          }
        )
        let res = responseProfile.data.data
        this.profile.city = res.city
        this.profile.country = res.country
        this.profile.tracks = res.tracks
        this.profile.shows = res.shows
        this.profile.repPoints = res.rep_points
        this.profile.spotify_artist_id = res.spotify_artist_id
        this.profile.unlockId = res.social_unlock_id
        this.profile.planId = res.plan_id
        this.profile.isOldUser = res.is_old_user

        if (this.layoutId === null) {
          this.layoutId = res.default_layout
        }

        Object.entries(res.profile).forEach(([key, val]) => {
          this.profile[key] = val
        })

        let params = {}
        if (this.isOldUser(this.profile, this.layoutId)) {
          params = {
            username: this.username,
            old_layout_id: this.layoutId
          }
        } else {
          params = {
            username: this.username
          }
        }
        let response = await Vue.$http.get(
          `v1/user/mini-profile/user-layout/${this.layoutId}`,
          {
            params: params
          }
        )

        if (response.status === 200) {
          let result = response.data
          this.layoutData = JSON.parse(result.data)
          this.layoutName = result.name
          this.coverBgDetails = {
            cover_type: result.cover_type,
            cover_bg_color: result.cover_bg_color,
            cover_bg_image: result.cover_bg_image
          }
          if (this.isOldUser(this.profile, this.layoutId)) {
            this.layoutId = result.id
          }
        }
      } catch (error) {
        this.$sentry.captureException(error)
        this.$noty.warning('Error Occurred while processing request.')
        this.throwError(error)
      }
      this.processing = false
    },
    isOldUser (profile, layoutId) {
      return profile.isOldUser !== null && (layoutId === 1 || layoutId === 2 || layoutId === 3)
    }
  },
  computed: {
    componentData () {
      return {
        userName: this.username,
        layoutId: this.layoutId,
        profile: this.profile,
        unlockIdLiveView: this.profile.unlockId,
        liveView: false,
        spotifyArtistId: this.profile.spotify_artist_id
      }
    }
  },
  created () {
    this.getData()
  }
}
</script>
<style scoped>
.card-parent {
  margin-top: -64px;
}

@media (min-width: 600px) {
  .card-parent {
    margin-top: -105px !important;
  }
}
</style>
