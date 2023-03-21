<template>
  <v-card elevation="2" class="mb-5">
    <v-card-title>Live View
    </v-card-title>
    <v-card-text>
      <DefaultCoverDesign :component-data="componentData" :bg-details="coverBgDetails" :plan-id="planId" />
      <div class="mb-4 parent" ref="printLiveView">
        <v-row justify="center">
          <v-col>
            <v-card elevation="0" class="mx-auto" max-width="480px">
              <v-card-text class="p-0">
                <div class="mt-4 mb-4">
                  <draggable
                    class="list-group pl-0"
                    tag="ul"
                    handle=".drag-active"
                    v-model="layoutData"
                    v-bind="dragOptions"
                    @start="drag = true"
                    @end="drag = false"
                  >
                    <v-row
                      v-for="(element, index) in layoutData"
                      :key="index"
                      no-gutters
                    >
                      <v-col md="1" cols="1" class="drag-active cursor-move">
                        <v-icon v-if="showActions" left>mdi-arrow-all</v-icon>
                      </v-col>
                      <v-col md="10" cols="10">
                        <v-btn
                          @click="selectComponent(element.component)"
                          color="primary"
                          small
                          text
                          class="mb-4 pl-0"
                          v-if="showActions"
                        >{{ element.name }}
                          <v-icon right>mdi-pencil-outline</v-icon>
                        </v-btn>

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
                      <v-col md="1" cols="1">
                        <v-icon
                          class="cursor-pointer"
                          @click="removeComponent(element.component)"
                          left
                          v-if="showActions"
                        >mdi-close-thick
                        </v-icon
                        >
                      </v-col>
                    </v-row>
                  </draggable>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from 'vue'
import draggable from 'vuedraggable'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import DefaultCoverDesign from '@/components/MiniProfile/Features/DefaultCoverDesign'
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
  display: 'Transitions',
  order: 7,
  components: {
    draggable,
    DefaultCoverDesign,
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
  data () {
    return {
      drag: false,
      username: this.$store.getters.getSettings.account.general.username,
      printOutput: null,
      showActions: true,
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
        unlockId: null
      }
    }
  },
  methods: {
    ...mapMutations({
      removeComponent: 'MiniProfile/REMOVE_COMPONENT',
      setLiveLayoutData: 'MiniProfile/SET_LIVE_LAYOUT_DATA',
      setMainSidebarMini: 'SET_SIDEBAR_MINI',
      setCaptureLiveView: 'MiniProfile/SET_CAPTURE_LIVE_VIEW'
    }),
    ...mapActions({
      updateLayout: 'MiniProfile/updateLayout'
    }),
    selectComponent (component) {
      this.$emit('select-component', component)
    },
    async print () {
      try {
        await Vue.$http.post(`v1/user/mini-profile/user-layout/screenshot/${this.layoutId}`)
        this.setCaptureLiveView(false)
      } catch (error) {
        this.setCaptureLiveView(false)
        this.$sentry.captureException(error)
      }
    },
    update (type, data) {
      let name
      let layoutData
      if (type === 'name') {
        name = data
        layoutData = this.layoutData
      } else {
        layoutData = data
        name = this.layoutName
      }

      this.updateLayout({ name, layoutData })
    },
    remove (componentName) {
      this.removeComponent(componentName)
    },
    async getProfileInfo () {
      this.processing = true
      try {
        let response = await Vue.$http.get(`v1/user/mini-profile/profile`, {
          params: {
            username: this.username
          }
        })
        let res = response.data.data
        this.profile.city = res.city
        this.profile.country = res.country
        this.profile.tracks = res.tracks
        this.profile.shows = res.shows
        this.profile.repPoints = res.rep_points
        this.profile.spotify_artist_id = res.spotify_artist_id
        this.profile.unlockId = res.social_unlock_id
        Object.entries(res.profile).forEach(([key, val]) => {
          this.profile[key] = val
        })
      } catch (error) {
        this.$sentry.captureException(error)
      }
      this.processing = false
    }
  },
  computed: {
    ...mapGetters({
      userLayoutData: 'MiniProfile/getUserLayoutData',
      layoutId: 'MiniProfile/getSelectedLayout',
      selectedLayoutCompleteData: 'MiniProfile/getSelectedLayoutCompleteData',
      liveLayoutData: 'MiniProfile/getLiveLayoutData',
      userSettings: 'getSettings'
    }),
    planId () {
      return this.userLayoutData.planId
    },
    componentData () {
      return {
        userName: this.username,
        layoutId: this.layoutId,
        profile: this.profile,
        unlockIdLiveView: this.profile.unlockId,
        liveView: true,
        spotifyArtistId: this.userSettings.account.spotify.spotify_artist_id
      }
    },
    layoutName: {
      get: function () {
        return this.selectedLayoutCompleteData.name
      },
      set: function (newValue) {
        this.selectedLayoutCompleteData.name = newValue
        this.update('name', newValue)
      }
    },
    layoutData: {
      get: function () {
        return this.liveLayoutData
      },
      set: function (newValue) {
        this.setLiveLayoutData(newValue)
        this.update('data', newValue)
      }
    },
    coverBgDetails () {
      return {
        cover_type: this.selectedLayoutCompleteData.cover_type,
        cover_bg_color: this.selectedLayoutCompleteData.cover_bg_color,
        cover_bg_image: this.selectedLayoutCompleteData.cover_bg_image
      }
    },
    dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    },
    rawData () {
      return JSON.stringify(this.layoutData, null, 2)
    },
    hasHeader () {
      let result = this.liveLayoutData.filter(
        v => v.component === 'MiniProfileHeaderType'
      )

      return result.length ? true : false
    }
  },
  mounted () {
    this.getProfileInfo()
    this.$root.$on('getLiveViewProfile', () => {
      this.getProfileInfo()
    })

    this.$root.$on('captureLiveView', () => {
      this.print()
    })
  },
  watch: {
    liveLayoutData: {
      deep: true,
      handler (newVal) {
        if (newVal) {
          this.update('data', newVal)
        }
      }
    }
  }
}
</script>
<style scoped>
.parent {
  margin-top: -150px;
}
</style>
<style>
.button {
  margin-top: 35px;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  min-height: 20px;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-move {
  cursor: move;
}
</style>
