<template>
  <div class="h-100">
    <header class="header" style="position:relative;height: 150px;">
      <picture style="position: absolute;width: 100%;height: 100%;">
        <source
          media="(max-width: 1199px)"
          srcset="/img/audio-engineering/banner_sm.webp 1x,
                        /img/audio-engineering/banner_sm.webp 2x,
                        /img/audio-engineering/banner_sm.webp 3x"
          type="image/webp"
        >
        <source
          media="(max-width: 1199px)"
          srcset="/img/audio-engineering/banner_sm.png 1x,
                        /img/audio-engineering/banner_sm.png 2x,
                        /img/audio-engineering/banner_sm.png 3x"
          type="image/png"
        >
        <source
          media="(min-width: 1200px)"
          srcset="/img/audio-engineering/banner_sm.webp 532w,
                        /img/audio-engineering/banner_md.webp 1600w,
                        /img/audio-engineering/banner.webp 2460w"
          type="image/webp" sizes="100vw"
        >
        <source
          media="(min-width: 1200px)"
          srcset="/img/audio-engineering/banner_sm.png 532w,
                        /img/audio-engineering/banner_md.png 1600w,
                        /img/audio-engineering/banner.png 2460w"
          type="image/png" sizes="100vw"
        >
        <img src="/img/audio-engineering/banner.png" class="w-100 h-auto" alt="Audio Engineering" loading="lazy">
      </picture>
    </header>
    <v-container>
      <v-main class="px-5">
        <v-col md="12" style="height: inherit; margin: 0px; width: 100%; display: flex;">
          <v-btn class="account-btn" color="primary" @click="openEngineerModal">{{ audio_engineer.is_audio_engineer ? 'Modify Account' : 'List yourself' }}</v-btn>
        </v-col>
        <v-container style="marginTop:10px; padding: 0px!important" class="container-fluid pb-8">
          <v-card class="w-100" style="padding: 1em!important;">
            <v-card-title>
              Engineer Orders
            </v-card-title>
            <v-row align="center" no-gutters class="w-100 py-1">
              <order-summary />
            </v-row>
            <v-row align="center" no-gutters class="w-100 py-4">
              <orders-table />
            </v-row>
          </v-card>
        </v-container>
      </v-main>
    </v-container>
    <become-engineer-modal ref="accountModal" />
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'

import BecomeEngineerModal from '@/components/AudioEngineering/BecomeEngineerModal'
import OrderSummary from '@/components/AudioEngineering/OrderSummary'
import OrdersTable from '@/components/AudioEngineering/OrdersTable'

export default {
  components: {
    OrderSummary,
    OrdersTable,
    BecomeEngineerModal
  },
  metaInfo () {
    return {
      title: 'Audio Engineering',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content:
            'Artist Republik is a 360 degree platform offering mastering services by talented producers. We offer reviews, mastering, distribution, playlisting, and more!'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content:
            'Audio Engineering | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content:
            'Artist Republik is a 360 degree platform offering mastering services by talented producers. We offer reviews, mastering, distribution, playlisting, and more!'
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
            'Audio Engineering | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Artist Republik is a 360 degree platform offering mastering services by talented producers. We offer reviews, mastering, distribution, playlisting, and more!'
        }
      ]
    }
  },
  data () {
    return {
      loading: false,
      busy: false
    }
  },
  computed: {
    ...mapGetters({
      audio_engineer: 'getAudioEngineer'
    })
  },
  methods: {
    openEngineerModal: function () {
      this.$refs.accountModal.open()
    }
  },
  created () {
    this.$store.dispatch('getGenres').then(() => {
      this.genres = this.$store.getters.getGenres
    }).catch(err => this.$sentry.captureException(err))
  }
}
</script>

<style>
.v-image__image--cover {
  background-size: contain;
}

.overflow-fix .v-toolbar__content {
  height: auto !important;
  flex-wrap: wrap;
}

@media screen and (min-width: 1660px) {
  .topbar-page-title {
    opacity: 0 !important;
  }
}

.account-btn {
  margin-left: auto;
  margin-top: 10px;
  justify-self: flex-end;
  align-self: flex-start;
}
</style>
