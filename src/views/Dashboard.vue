<template>
  <div class="dashboard">
    <header class="header pb-5 d-flex align-items-center dashboard-header">
      <div class="container-fluid">
        <div class="pt-15">
          <EmailVerification :user-info="user" />
          <ProfileCompletion />
          <DashboardStats />
        </div>
      </div>
    </header>
    <v-container fluid class="dashboard-content">
      <v-row class="py-2">
        <v-col cols="12">
          <v-card elevation="0">
            <v-card-title>
              <h1 v-if="user.active">Welcome back, {{ user.username }}! Lets grow your career!</h1>
              <h1 v-else>Welcome to Artist Republik! Lets grow your career!</h1>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="py-2">
        <v-col v-if="competitionOpen <= 0" cols="12" lg="8" class="my-2">
          <GetStarted />
        </v-col>
        <v-col v-else cols="12" lg="8" class="my-2">
          <BeatsCompWidget />
        </v-col>
        <v-col cols="12" lg="4" class="my-2">
          <FriendRequests />
        </v-col>
      </v-row>
      <v-row class="py-2">
        <v-col cols="12">
          <v-row class="mb-4">
            <v-col cols="12" lg="4" class="my-2">
              <SotsWidget />
            </v-col>
            <v-col cols="12" lg="4" class="my-2">
              <GWUStats />
            </v-col>
            <v-col cols="12" lg="4" class="my-2">
              <CuratorHub :from-curator-dash="0" />
            </v-col>
            <v-col cols="12" lg="4" class="my-2">
              <DistributionCTA />
            </v-col>
            <v-col cols="12" lg="4" class="my-2">
              <UserMiniProfile />
            </v-col>
            <v-col cols="12" lg="4" class="my-2">
              <PROrderWidget />
            </v-col>
            <v-col cols="12" lg="4" class="my-2">
              <OrderWidget />
            </v-col>
            <v-col cols="12" lg="4" class="my-2">
              <StickerWidget />
            </v-col>
            <v-col cols="12" lg="4" class="my-2">
              <TodoList />
            </v-col>
            <v-col cols="12" lg="4" class="my-2">
              <a href="https://blog.artistrepublik.com" rel="noopener" title="Learn about The State of the Republik on the Artist Republik blog!" target="_blank">
                <picture>
                  <source srcset="/img/dashboard/blog-link.png" type="image/webp">
                  <img class="manager-image" src="/img/dashboard/upcomingshows.png" alt="upcoming shows coming soon preview" loading="lazy" />
                </picture>
              </a>
            </v-col>
          </v-row>
        </v-col>
        <!--
        // New Widgets V3 Dashboard
        <v-col cols="12" lg="5" class="mb-4">
          <v-row class="mb-4">
            <v-col cols="12">
              <h2>NewProducts, Friends, Orders</h2>
            </v-col>
          </v-row>
          <v-row class="mb-4">
            <v-col cols="12">
              <h2>Discover - recently listed services</h2>
            </v-col>
          </v-row>
          <v-row class="mb-4">
            <v-col cols="12">
              <h2>AdSpaces</h2>
            </v-col>
          </v-row>
        </v-col>
        -->
      </v-row>
      <v-row class="mb-4">
        <v-col cols="12" lg="8" class="my-2 upcoming-shows">
          <v-card>
            <v-card-title>
              <h2>Upcoming Shows</h2>
            </v-card-title>
            <div class="p-0 text-center">
              <picture>
                <source srcset="/img/dashboard/upcomingshows.webp" type="image/webp">
                <img class="manager-image" src="/img/dashboard/upcomingshows.png" alt="upcoming shows coming soon preview" loading="lazy" />
              </picture>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" lg="4" class="my-2 social-management">
          <v-card>
            <v-card-title>
              <h2>
                Social Management
              </h2>
            </v-card-title>
            <div class="p-0 text-center">
              <picture>
                <source srcset="/img/dashboard/socialmanager.webp" type="image/webp">
                <img class="manager-image" src="/img/dashboard/socialmanager.png" alt="social management coming soon preview" loading="lazy" />
              </picture>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <UserTutorial v-if="showTutorial" :visible="showUserTutorial" @close="hideTutorial" />
  </div>
</template>
<script>
import GetStarted from '@/components/Dashboard/GetStarted'
import EmailVerification from '@/components/Dashboard/EmailVerification'
import ProfileCompletion from '@/components/Dashboard/ProfileCompletion'
import GWUStats from '@/components/Dashboard/GrowWithUs'
import FriendRequests from '@/components/Dashboard/FriendRequests'
import DashboardStats from '@/components/Dashboard/DashboardStats'
import StickerWidget from '@/components/Stickers/StickerWidget'
import BeatsCompWidget from '@/components/Dashboard/BeatsCompWidget'
import UserTutorial from '../components/Dashboard/UserTutorial'
import CuratorHub from '@/components/CuratorHub/CuratorHub'
import PROrderWidget from '@/components/PRHub/PROrderWidget'
import DistributionCTA from '@/components/Distribution/DistributionCTA.vue'
import TodoList from '@/components/Dashboard/TodoList.vue'
import SotsWidget from '@/components/Dashboard/SotsWidget'
import OrderWidget from '@/components/InstagramPlacement/OrderWidget'
import UserMiniProfile from '@/components/MiniProfile/UserMiniProfile'
import momentTimezone from 'moment-timezone'

export default {
  name: 'Dashboard',
  components: {
    GetStarted,
    EmailVerification,
    ProfileCompletion,
    GWUStats,
    FriendRequests,
    DashboardStats,
    UserTutorial,
    StickerWidget,
    CuratorHub,
    PROrderWidget,
    DistributionCTA,
    TodoList,
    OrderWidget,
    UserMiniProfile,
    BeatsCompWidget,
    SotsWidget,
  },
  metaInfo () {
    return {
      title: 'Dashboard',
      meta: [
        {
          vmid: 'og:url',
          property: 'og:url',
          content: 'https://app.artistrepublik.com' + this.$route.fullPath,
        },
      ],
    }
  },
  data () {
    return {
      showTutorial: false,
      competitionEndTime: '2021-02-07',
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    showUserTutorial () {
      return this.$store.getters.getUserTutorial
    },
    competitionOpen () {
      const now = new Date()
      const endTime = momentTimezone.tz(this.competitionEndTime, 'America/Los_Angeles')
      return endTime - now
    },
  },
  mounted () {
    this.fetchUserTutorial()
    this.showTutorial = true
  },
  methods: {
    hideTutorial () {
      this.showTutorial = !this.showTutorial
    },
    fetchUserTutorial () {
      this.$store.dispatch('getUserTutorial')
    },
  },
}
</script>
<style scoped>
.dashboard-header {
  min-height: 300px;
  background-image: url(/img/dashboard/dashboardBG.png);
  background-size: cover;
  background-position: center top;
}

.webp .dashboard-header {
  background-image: url(/img/dashboard/dashboardBG.webp);
}

.dashboard-content {
  position: relative;
  z-index: 1;
  max-width: 2000px;
  margin: 0 auto;
}

h1 {
  font-family: "Montserrat-Light", sans-serif;
  font-weight: 300;
  word-break: break-word;
}

.social-management > .card > .card-body,
.upcoming-shows > .card > .card-body {
  padding: 0;
}

.manager-image {
  width: 100%;
  border-radius: 0 0 0.375rem 0.375rem;
}
</style>
