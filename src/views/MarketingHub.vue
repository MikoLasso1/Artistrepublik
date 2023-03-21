<template>
  <div>
    <header
      class="header pb-9 d-flex align-items-center marketing-hub-header"
    >
      <div class="container-fluid">
        <div class="header-body">
          <!-- Card stats -->
          <DashboardStats />
        </div>
      </div>
    </header>
    <!-- Marketing Dashboard Modules -->
    <div class="container-fluid mt--4 mt-lg--5 mt-xl--7 pb-8">
      <v-row class="mb-4">
        <v-col cols="12" xl="5" class="my-2 mb-xl-0">
          <UserMiniProfile />
        </v-col>
        <v-col cols="12" xl="7" class="order-lg-1 my-2 mb-xl-0 mb-4">
          <GWU />
        </v-col>
      </v-row>
      <v-row class="mb-4">
        <v-col cols="12" xl="4" class="my-2 mb-xl-0">
          <IGOrderWidget />
        </v-col>
        <v-col cols="12" xl="4" class="my-2 order-lg-3 mb-xl-0">
          <PROrderWidget />
        </v-col>
        <v-col cols="12" xl="4" class="order-lg-2 my-2 mb-4 mb-xl-0">
          <CuratorHub :from-curator-dash="0" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
import DashboardStats from '@/components/Dashboard/DashboardStats'
import UserMiniProfile from '@/components/MiniProfile/UserMiniProfile'
import GWU from '@/components/Dashboard/GrowWithUs'
import IGOrderWidget from '@/components/InstagramPlacement/OrderWidget'
import PROrderWidget from '@/components/PRHub/PROrderWidget'
import CuratorHub from '@/components/CuratorHub/CuratorHub'

export default {
  components: {
    DashboardStats,
    UserMiniProfile,
    GWU,
    IGOrderWidget,
    PROrderWidget,
    CuratorHub
  },
  metaInfo () {
    return {
      title: 'Marketing Hub',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content:
            'Artist Republik is a 360 degree platform offering marketing tools to help launch your career! We offer reviews, mastering, distribution, playlisting, and more!'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content:
            'Marketing | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content:
            'Artist Republik is a 360 degree platform offering marketing tools to help launch your career! We offer reviews, mastering, distribution, playlisting, and more!'
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
            'Marketing | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Artist Republik is a 360 degree platform offering marketing tools to help launch your career! We offer reviews, mastering, distribution, playlisting, and more!'
        }
      ]
    }
  },
  data () {
    return {}
  }
}
</script>
<style>
.marketing-hub-header {
  background-image: url(/img/marketing-hub/marketinghubBG.png);
  min-height: 400px;
  background-size: cover;
  background-position: center top;
}

.webp .marketing-hub-header {
  background-image: url(/img/marketing-hub/marketinghubBG.webp);
}

@media screen and (min-width: 960px) {
  .marketing-hub-header {
    padding-top: 76px;
  }
}

@media screen and (min-width: 1200px) {
  .marketing-hub-header {
    padding-top: 36px;
  }
}
</style>
