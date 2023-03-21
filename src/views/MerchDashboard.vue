<template>
  <div>
    <header
      class="header pb-9 d-flex align-items-center marketing-hub-header">
      <div class="container-fluid">
        <div class="header-body">
          <!-- Card stats -->
          <DashboardStats />
        </div>
      </div>
    </header>
    <!-- Marketing Dashboard Modules -->
    <div class="container-fluid mt--4 mt-lg--5 pb-8">
      <v-row class="mb-4">
        <v-col cols="12" xl="4" class="mb-4 mb-xl-0">
          <StickerWidget />
        </v-col>
        <v-col cols="12" lg="4" class="my-2 merch">
          <v-card header-classes="bg-transparent p-0">
            <div class="align-items-center">
              <div class="py-3">
                <h6 class="text-uppercase px-3 text-muted ls-1 mb-1">
                  Merchandising
                </h6>
                <h5 class="h3 px-3 mb-0 verification-title">
                  Custom Bulk Merchandising Creation
                </h5>
              </div>
            </div>
            <div class="p-0 text-center">
              <picture>
                <source srcset="/img/merchdashboard/merchcomingsoon.webp" type="image/webp">
                <img class="merch-image" src="/img/merchdashboard/merchcomingsoon.jpg" alt="coming soon preview" loading="lazy" />
              </picture>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" lg="4" class="col-lg-4 my-2 merch">
          <v-card>
            <div class="align-items-center">
              <div class="py-3">
                <h2 class="text-uppercase px-3 text-muted ls-1 mb-1 h6">
                  Management
                </h2>
                <h3 class="h3 px-3 mb-0 verification-title">
                  Custom Bulk Merchandise Management
                </h3>
              </div>
            </div>
            <div class="p-0 text-center">
              <picture>
                <source srcset="/img/merchdashboard/merchandisingmanager.webp" type="image/webp">
                <img class="merch-image" src="/img/merchdashboard/merchandisingmanager.jpg" alt="coming soon preview" loading="lazy" />
              </picture>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
import DashboardStats from '@/components/Dashboard/DashboardStats'
import StickerWidget from '@/components/Stickers/StickerWidget'

export default {
  components: {
    DashboardStats,
    StickerWidget
  },
  metaInfo () {
    return {
      title: 'Merch Dashboard',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content:
            'Artist Republik is a 360 degree platform offering custom merchandise to help launch your career! We offer mastering, distribution, playlisting, and more!'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content:
            'Merch Dashboard | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content:
            'Artist Republik is a 360 degree platform offering custom merchandise to help launch your career! We offer mastering, distribution, playlisting, and more!'
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
            'Merch Dashboard | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Artist Republik is a 360 degree platform offering custom merchandise to help launch your career! We offer mastering, distribution, playlisting, and more!'
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
.merch > .card > .card-body {
  padding: 0;
}

.merch-image {
  width: 100%;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

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
