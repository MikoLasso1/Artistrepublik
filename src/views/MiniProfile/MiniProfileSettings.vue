<template>
  <div class="artist-link-settings">
    <v-container class="p-0" fluid>
      <v-row justify="center" v-if="processing" class=" mb-4">
        <v-col cols="6">
          <v-card class="p-2 text-center card">
            <v-card-text>
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row justify="center" v-if="!hasAcount && !processing" class="mb-4">
        <v-col cols="12">
          <UserMiniProfile></UserMiniProfile>
        </v-col>
      </v-row>

      <v-btn class="drawer-button-mobile hidden-sm-and-up" color="primary" v-if="this.activeSetting !== 'MiniProfileLayoutSlider'" @click="drawer = !drawer" :style="drawerButtonStyleMobile">
        <v-icon
          dark
          class="rotating"
        >
          mdi-cog-outline
        </v-icon>
      </v-btn>

      <!--start::Details-->
      <div v-if="hasAcount && !processing">
        <MiniProfileSettingsAppBar class="mb-4" @select-component="showComponent" v-if="showAppBar" />


        <v-row justify="center">
          <v-col :lg="contentMD" md="6" cols="12" class="d-flex flex-column">
            <div>
              <MiniProfileHeaderType
                v-if="activeSetting === 'MiniProfileHeaderType'"
              />
              <MiniProfileLayoutComponents
                v-else-if="activeSetting === 'MiniProfileLayoutComponents'"
              />
              <MiniProfileUpdateLinksView
                v-else-if="activeSetting === 'MiniProfileUpdateLinksView'"
              />
              <MiniProfileSocialUnLockView
                v-else-if="activeSetting === 'MiniProfileSocialUnLockView'"
              />
              <MiniProfileAllShows
                :refresh="refresh"
                v-else-if="activeSetting === 'MiniProfileAllShows'"
              />
              <MiniProfileMerchandiseList
                :refresh="refreshMerchandise"
                v-else-if="activeSetting === 'MiniProfileMerchandiseList'"
              ></MiniProfileMerchandiseList>
              <CreateArtistMedia
                :layout="layoutId"
                v-else-if="activeSetting === 'CreateArtistMedia'"
              />
              <CreateFeaturedMedia
                v-else-if="activeSetting === 'CreateFeaturedMedia'"
              />
              <CreateStreamNow v-else-if="activeSetting === 'CreateStreamNow'" />
              <MiniProfileTrack v-else-if="activeSetting === 'MiniProfileTrack'" />

              <MiniProfileSpotifyFollowButtonView v-else-if="activeSetting === 'MiniProfileSpotifyFollowButtonView'" />

              <MiniProfileFeaturedComponent title="Top Tracks" component-name="MiniProfileTopTracksCreate" v-else-if="activeSetting === 'MiniProfileTopTracksCreate'" />

              <MiniProfileFeaturedComponent title="Featured Merchandise" component-name="MiniProfileFeaturedMerchandiseCreate" v-else-if="activeSetting === 'MiniProfileFeaturedMerchandiseCreate'" />

              <MiniProfileFeaturedComponent title="Featured Show" component-name="MiniProfileFeaturedShowCreate" v-else-if="activeSetting === 'MiniProfileFeaturedShowCreate'" />
            </div>
            <div v-if="planId > 1" class="mt-4">
              <v-row>
                <v-col>
                  <v-btn
                    color="primary"
                    class="mt-2"
                    elevation="2"
                    v-if="previousSetting"
                    @click="previousComponent()"
                  >
                    <v-icon
                      left
                      dark
                    >
                      mdi-chevron-left
                    </v-icon>
                    Previous
                  </v-btn>
                </v-col>
                <v-spacer></v-spacer>
                <v-col md="auto">
                  <v-btn
                    color="primary"
                    class="mt-2"
                    elevation="2"
                    v-if="nextSetting"
                    @click="nextComponent()"
                  >Next
                    <v-icon
                      right
                      dark
                    >
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <div class="text-center">
              <p class="text-center">
                <v-btn
                  color="primary"
                  class="mt-2"
                  elevation="2"
                  :loading="getCaptureLiveView"
                  :disabled="getCaptureLiveView"
                  @click="finished"
                >Finished
                  <v-icon
                    right
                    dark
                  >
                    fa-question
                  </v-icon>
                </v-btn>
              </p>
              <v-row v-if="showSharingDialog">
                <v-col>
                  <MiniProfileShareLayoutLinkDialog :layout-id="layoutId" :show-actions="true" class="mb-2" />
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col cols="12" v-if="showLiveView" md="6" lg="5" class="live-view">
            <MiniProfileLiveView @select-component="showComponent" />
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>
<script>
import UserMiniProfile from '@/components/MiniProfile/UserMiniProfile'
import MiniProfileHeaderType from '@/components/MiniProfile/views/MiniProfileHeaderType'
import MiniProfileLayoutComponents from '@/components/MiniProfile/views/MiniProfileLayoutComponents'
import MiniProfileLiveView from '@/components/MiniProfile/views/MiniProfileLiveView'
import MiniProfileUpdateLinksView from '@/components/MiniProfile/views/MiniProfileUpdateLinksView'
import MiniProfileSocialUnLockView from '@/components/MiniProfile/views/MiniProfileSocialUnLockView'
import MiniProfileAllShows from '@/components/MiniProfile/MiniProfileAllShows'
import MiniProfileMerchandiseList from '@/components/MiniProfile/MiniProfileMerchandiseList'
import CreateArtistMedia from '@/components/MiniProfile/CreateArtistMedia'
import CreateFeaturedMedia from '@/components/MiniProfile/CreateFeaturedMedia'
import CreateStreamNow from '@/components/MiniProfile/CreateStreamNow'
import MiniProfileTrack from '@/components/MiniProfile/MiniProfileTrack'
import MiniProfileSpotifyFollowButtonView from '@/components/MiniProfile/MiniProfileSpotifyFollowButtonView'
import MiniProfileFeaturedComponent from '@/components/MiniProfile/views/MiniProfileFeaturedComponent'
import MiniProfileSettingsAppBar from '@/components/MiniProfile/views/MiniProfileSettingsAppBar'
import MiniProfileShareLayoutLinkDialog from '@/components/MiniProfile/Modals/MiniProfileShareLayoutLinkDialog'

import Vue from 'vue'
import config from '@/config'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    MiniProfileAllShows,
    MiniProfileMerchandiseList,
    CreateArtistMedia,
    UserMiniProfile,
    MiniProfileHeaderType,
    MiniProfileLayoutComponents,
    MiniProfileLiveView,
    MiniProfileUpdateLinksView,
    MiniProfileSocialUnLockView,
    CreateFeaturedMedia,
    CreateStreamNow,
    MiniProfileTrack,
    MiniProfileSpotifyFollowButtonView,
    MiniProfileFeaturedComponent,
    MiniProfileSettingsAppBar,
    MiniProfileShareLayoutLinkDialog
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
      items: [
        { text: 'Real-Time', icon: 'mdi-clock' },
        { text: 'Audience', icon: 'mdi-account' },
        { text: 'Conversions', icon: 'mdi-flag' }
      ],
      showLiveView: false,
      contentMD: null,
      appUrl: config.APP_URL,
      defaultLayout: null,
      defaultLayoutItems: [],
      dialogMiniProfileAddShow: false,
      dialogMiniProfileAddMerchandise: false,
      miniProfileShortlink: config.MINI_PROFILE_SHORTLINK,
      modelId: null,
      persistPlanModal: false,
      processing: false,
      processingSpotify: false,
      refresh: null,
      refreshMerchandise: null,
      selectedLayoutDb: null,
      selectLayout: { layoutName: 'Layout 1', id: 1 },
      selectLayoutItems: [],
      showMiniProfileModal: false,
      spotifyFollowButton: false,
      username: this.$store.getters.getSettings.account.general.username,
      incrementMiniProfile: 0,
      panel: [0, 1],
      layoutPanel: 0,
      finishProcessing: false,
      showSharingDialog: false,
      showComponentsWihoutPlan: ['MiniProfileUpdateLinksView', 'MiniProfileHeaderType', 'MiniProfileSubscriptionView']
    }
  },
  methods: {
    ...mapActions({
      getPlan: 'MiniProfile/getPlan',
      getLayouts: 'MiniProfile/getLayouts',
      fetchSettings: 'fetchSettings'
    }),
    ...mapMutations({
      setActiveSetting: 'MiniProfile/SET_ACTIVE_SETTING',
      setSocialUnlockId: 'MiniProfile/SET_SOCIAL_UNLOCK_ID',
      setSidebarMini: 'SET_SIDEBAR_MINI',
      setLayout: 'MiniProfile/SET_SELECTED_LAYOUT',
      setSidebarDrawer: 'MiniProfile/SET_SIDEBAR_DRAWER',
      setSidebarDrawerMobile: 'MiniProfile/SET_SIDEBAR_DRAWER_MOBILE',
      setCaptureLiveView: 'MiniProfile/SET_CAPTURE_LIVE_VIEW'
    }),
    finished () {
      this.finishProcessing = true
      this.$root.$emit('captureLiveView')
      this.setCaptureLiveView(true)
      this.showSharingDialog = true
    },
    nextComponent () {
      this.setActiveSetting(this.nextSetting)
    },
    previousComponent () {
      this.setActiveSetting(this.previousSetting)
    },
    showComponent (setting) {

      if (this.planId !== 1) {
        this.contentMD = 6
        let increasWidth = [
          'MiniProfileAllShows',
          'MiniProfileMerchandiseList'
        ]

        if (increasWidth.includes(setting)) {
          this.contentMD = 7
        }

        //show live view only when some layout is selected
        if (this.layoutId) {
          this.showLiveView = true
          this.setActiveSetting(setting)
        } else {
          this.contentMD = null
          this.showLiveView = false
          this.$noty.warning('Please select a layout first')
        }

      } else {
        if (this.showComponentsWihoutPlan.includes(setting)) {
          if (this.layoutId) {
            this.contentMD = 6
            this.showLiveView = true
            this.setActiveSetting(setting)
          }
        } else {
          this.showLiveView = false
          this.contentMD = null
          this.setActiveSetting('MiniProfileSubscriptionView')
        }
      }
      this.$vuetify.goTo(0, {
        duration: 300
      })
    },
    updateActiveSetting (settingId) {
      this.setActiveSetting(settingId)
    },
    layoutSwitched (selected_layout) {
      this.selectLayout = {
        layoutName: `Layout ${selected_layout}`,
        id: parseInt(selected_layout)
      }
    },
    async updateSpotifyFollow () {
      this.processingSpotify = true
      this.$noty.info('Processing Request.')
      try {
        let spotifyFollow = this.spotifyFollowButton ? 1 : 0
        await Vue.$http.put(`v1/user/mini-profile/layout/${this.modelId}`, {
          enable_follow_spotify: spotifyFollow
        })
        this.$noty.success('Enabled successfully.')
      } catch (error) {
        this.$noty.warning('Error Occurred while processing request.')
      }
      this.processingSpotify = false
    },
    initialData () {
      if (!this.userlayoutData.modelId) {
        this.processing = true
        this.getPlan(this.username).catch(err => {
          this.$sentry.captureException(err)
        })
          .finally(() => this.processing = false)
      }

      if (this.layoutId === null) {
        this.$router.push({ name: 'artist.links.myLinks' })
      } else {
        this.setSidebarDrawer(true)
        this.showLiveView = true
        this.setActiveSetting('MiniProfileHeaderType')
      }
    }
  },
  mounted () {
    this.fetchSettings()
    if (this.hasAcount) {
      this.initialData()
    }
    if (this.layoutId) {
      this.showLiveView = true
    }
  },
  computed: {
    ...mapGetters({
      userlayoutData: 'MiniProfile/getUserLayoutData',
      // validPlan: "MiniProfile/getValidPlan",
      layoutId: 'MiniProfile/getSelectedLayout',
      activeSetting: 'MiniProfile/getActiveSetting',
      sidebarSettingsMenu: 'MiniProfile/getSidebarSettingsMenu',
      getSideBarDrawer: 'MiniProfile/getSideBarDrawer',
      getSideBarDrawerMobile: 'MiniProfile/getSideBarDrawerMobile',
      mini: 'MiniProfile/getSideBarMini',
      settings: 'getSettings',
      getCaptureLiveView: 'MiniProfile/getCaptureLiveView'
    }),
    nextSetting () {
      let sidebarItems = this.sidebarSettingsMenu
      let currentActiveSetting = this.activeSetting
      let currentIndex = sidebarItems.findIndex(i => {
        return i.componentName === currentActiveSetting
      })

      if (currentIndex < sidebarItems.length - 1) {
        return sidebarItems[currentIndex + 1].componentName
      } else {
        return false
      }
    },
    previousSetting () {
      let sidebarItems = this.sidebarSettingsMenu
      let currentActiveSetting = this.activeSetting
      let currentIndex = sidebarItems.findIndex(i => {
        return i.componentName === currentActiveSetting
      })

      if (currentIndex > 0) {
        return sidebarItems[currentIndex - 1].componentName
      } else {
        return false
      }
    },

    defaultProfileLink () {
      return `${this.miniProfileShortlink}${this.username}`
    },
    planId () {
      return this.userlayoutData.planId
    },
    hasAcount () {
      return this.settings.mini_profile.is_account
    },
    selectedSidebarItem: {
      get () {
        let currentSetting = this.activeSetting
        if (this.activeSetting && this.activeSetting !== 'MiniProfileLayoutSlider') {
          return this.sidebarSettingsMenu.findIndex(i => {
            return i.componentName === currentSetting
          })
        } else {
          return null
        }
      },
      set (value) {
        console.log(value)
        // this.$emit("input", value);
      }
    },
    drawerMobile: {
      get () {
        return this.getSideBarDrawerMobile
      },
      set (value) {
        this.setSidebarDrawerMobile(value)
      }

    },
    drawer: {
      get () {
        return this.getSideBarDrawer
      },
      set (value) {
        this.setSidebarDrawer(value)
      }

    },
    drawerButtonStyleMobile () {
      if (this.mini && this.drawer) {
        return 'right: 70px'
      } else if (this.drawer) {
        return 'right: 242px'
      }
      return 'right: 2px'
    },
    showAppBar () {
      if (this.activeSetting === 'MiniProfileLayoutSlider' || this.activeSetting === 'MiniProfileSubscriptionView') {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    activeSetting: function (newVal) {
      this.showComponent(newVal)
    },
    hasAcount: function (newVal) {
      if (newVal) {
        this.initialData()
      }
    }
  },
  destroyed () {
    this.setSidebarDrawer(false)
  }
}
</script>
<style scoped>
.icon-styles {
  font-size: 18px;
}

.drawer-button-mobile {
  position: fixed;
  top: 340px;
  right: -20px;
  z-index: 8;
  box-shadow: 1px 1px 18px #e4a;
}

.drawer-button {
  position: absolute;
  top: 340px;
  z-index: 8;
  box-shadow: 1px 1px 18px #e4a;
}

.live-view {
  max-width: 770px;
}
</style>
<style>
.mini-settings-spotify label.v-label {
  line-height: 1;
  margin: 0;
}

@-webkit-keyframes rotating /* Safari and Chrome */
{
  from {
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes rotating {
  from {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.rotating {
  -webkit-animation: rotating 2s linear infinite;
  -moz-animation: rotating 2s linear infinite;
  -ms-animation: rotating 2s linear infinite;
  -o-animation: rotating 2s linear infinite;
  animation: rotating 2s linear infinite;
}
</style>
<style>
.mini-settings-spotify label.v-label {
  line-height: 1;
  margin: 0;
}
</style>
