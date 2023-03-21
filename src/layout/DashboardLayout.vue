<template>
  <div
    class="globallayout"
    :class="{
      'globallayout-enabled': this.drawer,
      'globallayout-minimized': this.mini,
      'globallayout-full': !this.mini,
      'globallayout-artistlinks-enabled': this.getDrawerMiniProfile,
      'globallayout-artistlinks-minimized': this.getMiniMiniProfile,
      'globallayout-full-mini': !this.getMiniMiniProfile,
    }"
  >
    <v-row no-gutters>
      <v-col md="auto" class="flex-grow-0 d-flex flex-shrink-1 globallayout-aside">
        <div class="" v-if="drawer">
          <GlobalNavigation />
        </div>
        <div
          v-if="showMiniProfileNavigation"
          class="black"
          style="display: flex"
        >
          <MiniProfileNavigation class="mini-nav-style" />
        </div>
      </v-col>
      <v-col
        class="globallayout-content-section tutorial-calculation"
        style="min-width: 100px; max-width: 100%"
      >
        <DashboardNavbar :notifications="notifications" />
        <CompetitionSotsBanner />
        <fade-transition :duration="200" origin="center top" mode="out-in" >
          <router-view />
        </fade-transition>
        <ContentFooter v-if="!$route.meta.hideFooter" />
      </v-col>
    </v-row>
    <modal :show.sync="modals.modal">
      <h2 id="modal-title-default" slot="header" class="modal-title">
        Experience the Artist Republik Community!
      </h2>
      <p class="modal-texts">
        Log in or sign up to get full access to all of our features.
      </p>
      <template slot="footer">
        <router-link to="/register">
          <v-btn dark color="primary" type="profile">Sign Up</v-btn>
        </router-link>
        <router-link to="/login">
          <v-btn
            dark
            color="success"
            type="success"
            class="ml-auto"
            @click="modals.modal = false"
          >Log In
          </v-btn
          >
        </router-link>
      </template>
      <v-btn dark color="error" type="link" class="mx-auto not-now" @click="modals.modal = false">Not now</v-btn>
    </modal>
    <div v-if="(modals.modal = false)" class="access-banner">
      <h2 class="access-banner-title">
        Experience the Artist Republik Community!
      </h2>
      <router-link to="/register">
        <v-btn dark color="primary" type="profile" class="sign-up"
        >Sign Up
        </v-btn
        >
      </router-link>
      <router-link to="/login">
        <v-btn
          dark
          color="success"
          type="success"
          class="ml-auto log-in"
          @click="modals.modal = false"
        >Log In
        </v-btn
        >
      </router-link>
    </div>
    <v-dialog
      :value="showCommentModal"
      width="500"
      scrollable
      contaent-class="overflow-x-hidden "
      @click:outside="hideCommentModal"
      style="overflow-x: hidden !important"
    >
      <a-post-comment-modal />
    </v-dialog>
    <v-dialog
      width="500"
      :value="showRepostModal"
      @click:outside="hideRepostModal"
    >
      <a-post-repost-modal />
    </v-dialog>
  </div>
</template>
<script>
import DashboardNavbar from '@/layout/DashboardNavbar.vue'
import ContentFooter from '@/layout/ContentFooter.vue'
import { FadeTransition } from 'vue2-transitions'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import APostCommentModal from '@/components/Feed/Modals/APostCommentModal'
import APostRepostModal from '@/components/Feed/Modals/APostRepostModal'
import FeedListeners from '@/components/Mixins/Feed/FeedListeners'
import GlobalNavigation from '@/components/GlobalLayout/GlobalNavigation'
import MiniProfileNavigation from '@/views/MiniProfile/MiniProfileNavigation'
import CompetitionSotsBanner from '@/components/Competition/Sots/CompetitionSotsBanner'

export default {
  components: {
    DashboardNavbar,
    ContentFooter,
    FadeTransition,
    APostCommentModal,
    APostRepostModal,
    MiniProfileNavigation,
    GlobalNavigation,
    CompetitionSotsBanner
  },
  data() {
    return {
      items: [
        {
          heading: 'Home'
        },
        // {
        //   title: 'Launchpad',
        //   icon: 'mdi-rocket-launch',
        //   to: '/launchpad',
        // },
        {
          title: 'Dashboard',
          icon: 'mdi-home',
          to: '/dashboard'
        },
        {
          title: 'Help Center',
          icon: 'mdi-help',
          href: 'https://support.artistrepublik.com'
        },
        {
          heading: 'Tools'
        },
        {
          title: 'Production',
          icon: 'mdi-music-note',
          items: [
            {
              title: 'Mastering',
              to: '/features/mastering'
            },
            {
              title: 'Elite Reviews',
              to: '/features/reviews'
            },
            {
              title: 'Sound Store',
              to: '/features/sound-store'
            },
            {
              title: 'Featured X',
              href: 'https://featuredx.com/'
            }
          ]
        },
        {
          title: 'Distribution',
          icon: 'mdi-playlist-music',
          to: '/features/distribution'
        },
        {
          title: 'Marketing',
          icon: 'mdi-crosshairs-gps',
          items: [
            {
              title: 'Marketing Hub',
              to: '/marketing-hub'
            },
            {
              title: 'Grow With Us',
              to: '/features/grow'
            },
            {
              title: 'Playlisting',
              to: '/features/playlisting'
            },
            {
              title: 'Blog Promotion Manager',
              to: '/features/blog-promotion-order'
            },
            {
              title: 'Instagram Placement',
              to: '/features/instagram-placement-order'
            },
            {
              title: 'Artist Links',
              to: '/features/artist-links'
            }
          ]
        },
        {
          title: 'Live Shows',
          icon: 'mdi-star',
          disabled: true
        },
        {
          title: 'Social',
          icon: 'mdi-account-multiple',
          items: [
            {
              title: 'Trending',
              to: '/trending'
            },
            {
              title: 'Messages',
              to: '/messages'
            },
            {
              title: 'Feed',
              to: '/feed'
            },
            {
              title: 'Networking',
              to: '/networking'
            }
          ]
        },
        {
          heading: 'Vendors'
        },
        {
          title: 'Biz Resources',
          icon: 'mdi-web',
          items: [
            {
              title: 'Instagram Placement',
              to: '/features/instagram-placement'
            },
            {
              title: 'Blog Promotion Manager',
              to: '/features/blog-promotion'
            },
            {
              title: 'Curator Hub',
              to: '/features/curator'
            },
            {
              title: 'Producer Center',
              to: '/features/audio-engineering'
            },
            {
              title: 'Reviewer Center',
              to: '/features/reviewer-center'
            },
            {
              title: 'Sound Store',
              to: '/features/sound-store/manage'
            }
          ]
        }
      ],
      modals: {
        modal: false
      }
    }
  },
  mixins: [FeedListeners],
  computed: {
    ...mapGetters({
      user: 'getUser',
      messageNotifications: 'notifications/messageNotifications',
      notifications: 'notifications/notificationCounts',
      token: 'token',
      showCommentModal: 'feedModals/commentModal',
      showRepostModal: 'feedModals/repostModal',
      getMini: 'getSideBarMini',
      getDrawer: 'getSideBarDrawer',
      getDrawerMiniProfile: 'MiniProfile/getSideBarDrawer',
      getMiniMiniProfile: 'MiniProfile/getSideBarMini'
    }),
    showMiniProfileNavigation() {
      if (
        this.$route.name === 'artist.links.settings' &&
        this.getDrawerMiniProfile
      ) {
        return true
      } else {
        return false
      }
    },
    mini: {
      get: function () {
        return this.getMini
      },
      set: function (newValue) {
        this.setSidebarMini(newValue)
      }
    },
    drawer: {
      get: function () {
        return this.getDrawer
      },
      set: function (newValue) {
        this.setSidebarDrawer(newValue)
      }
    },
    userAuthenticated() {
      return this.$store.getters.isAuthenticated
    }
  },
  mounted() {
    this.showModal()
    this.$store.dispatch('notifications/fetchNotifications')
    this.$store.dispatch('friendsInit')
  },
  methods: {
    ...mapActions({
      hideCommentModal: 'feedModals/hideCommentModal',
      hideRepostModal: 'feedModals/hideRepostModal'
    }),
    ...mapMutations({
      setSidebarMini: 'SET_SIDEBAR_MINI',
      setSidebarDrawer: 'SET_SIDEBAR_DRAWER'
    }),
    showModal() {
      this.modals.modal = !this.userAuthenticated;
    },
    canView(role) {
      if (!this.user || !this.user.roles) {
        return false
      }
      return this.user.roles.indexOf(role) !== -1
    }
  }
}
</script>
<style lang="scss" scoped>
.globallayout {
  &-content-section {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
  }

  @media screen and (min-width: 960px) {
    &-aside {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 98;
    }
    &.globallayout-enabled.globallayout-full .globallayout-content-section {
      padding-left: 270px;
    }
    &.globallayout-enabled.globallayout-minimized
    .globallayout-content-section {
      padding-left: 100px;
    }
    &.globallayout-enabled.globallayout-minimized.globallayout-artistlinks-enabled.globallayout-full-mini
    .globallayout-content-section,
    .globallayout.globallayout-enabled.globallayout-full.globallayout-artistlinks-enabled.globallayout-artistlinks-minimized
    .globallayout-content-section {
      padding-left: 350px;
    }
    &.globallayout-enabled.globallayout-minimized.globallayout-artistlinks-enabled.globallayout-artistlinks-minimized
    .globallayout-content-section {
      padding-left: 180px;
    }
    &.globallayout-enabled.globallayout-full.globallayout-artistlinks-enabled.globallayout-full-mini
    .globallayout-content-section {
      padding-left: 520px;
    }
  }
}

.modal-title,
.modal-text {
  font-family: "Montserrat", sans-serif;
  font-size: 1.1rem;
}

.modal-body p,
.modal-footer a button {
  font-family: "Montserrat", sans-serif;
}

.access-banner {
  position: fixed;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  width: 100%;
  text-align: center;
  padding: 80px 0;
  font-family: "Montserrat", sans-serif;
  width: 100%;
}

.access-banner-title {
  padding: 20px 0;
}

.sign-up {
  margin-right: 20px;
}

.log-in {
  margin-left: 20px;
}

.not-now {
  display: block;
  color: #7f244f;
  font-weight: 200;
  text-decoration: underline;
  text-transform: uppercase;
}

@media screen and (min-width: 1264px) {
  .mini-nav-style {
    padding-top: 65px;
  }
}

@media screen and (max-width: 500px) {
  .access-banner {
    padding: 40px 20px;
  }
}

@media screen and (max-width: 400px) {
  .access-banner {
    padding: 20px;
  }
}
</style>
