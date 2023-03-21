<template>
  <div class="h-100">
    <header class="header">
      <picture>
        <source
          media="(max-width: 1199px)"
          srcset="/img/curator/curator_banner_sm.webp 1x,
                        /img/curator/curator_banner_sm.webp 2x,
                        /img/curator/curator_banner_sm.webp 3x"
          type="image/webp"
        >
        <source
          media="(max-width: 1199px)"
          srcset="/img/curator/curator_banner_sm.png 1x,
                        /img/curator/curator_banner_sm.png 2x,
                        /img/curator/curator_banner_sm.png 3x"
          type="image/png"
        >
        <source
          media="(min-width: 1200px)"
          srcset="/img/curator/curator_banner_sm.webp 532w,
                        /img/curator/curator_banner_md.webp 1600w,
                        /img/curator/curator_banner.webp 2460w"
          type="image/webp" sizes="100vw"
        >
        <source
          media="(min-width: 1200px)"
          srcset="/img/curator/curator_banner_sm.png 532w,
                        /img/curator/curator_banner_md.png 1600w,
                        /img/curator/curator_banner.png 2460w"
          type="image/png" sizes="100vw"
        >
        <img src="/img/curator/curator_banner.png" class="w-100 h-auto" alt="Curator Hub" loading="lazy">
      </picture>
    </header>
    <div v-if="isCurator" class="container-fluid my-4">
      <CuratorTotals />
      <BecomeCurator class="mb-4" :from-curator-dash="1" />
      <v-row class="mb-4">
        <v-col cols="12" lg="6">
          <GrowPlaylist />
        </v-col>
        <v-col cols="12" lg="6" v-if="!hideSubscriptionBanner">
          <v-card>
            <v-card-text>
              <v-banner class="text-center">
                <v-avatar
                  slot="icon"
                  size="40"
                >
                  <img src="/img/curator/curator_check_mark.png" alt="disc in sleeve" loading="lazy" />
                </v-avatar>
                <h2>Sign Up To Be a Curator Pro Today!</h2>
                <div v-if="plans.length" v-html="plans[0].planable.details"></div>
                <v-btn
                  tile
                  color="primary"
                  outlined
                  @click="buySubscription"
                >
                  Buy Subscription
                </v-btn>
              </v-banner>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <CuratorTable />
      <SubscriptionModal title="Curator" service="playlist-republik" plan-type="curator" @subscribed="subscribed" ref="subscription" />
    </div>
    <div v-else>
      <BecomeCurator class="mb-4" :from-curator-dash="0" />
    </div>
  </div>
</template>
<script>
import BecomeCurator from '@/components/CuratorHub/BecomeCurator'
import CuratorTotals from '@/components/CuratorHub/CuratorTotals.vue'
import CuratorTable from '@/components/CuratorHub/CuratorTable.vue'
import GrowPlaylist from '@/components/CuratorHub/GrowPlaylist.vue'
import SubscriptionModal from '@/components/Subscriptions/SubscriptionModal'
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    CuratorTotals,
    CuratorTable,
    BecomeCurator,
    GrowPlaylist,
    SubscriptionModal
  },
  metaInfo () {
    return {
      title: 'Curator Hub',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content:
            'Join the largest playlisting network here on Artist Republik, the only 360 degree platform! We give playlisting curators the opportunity to discover new music!'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content:
            'Curator Vendor | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'og:description',
          name: 'og:description',
          content:
            'Join the largest playlisting network here on Artist Republik, the only 360 degree platform! We give playlisting curators the opportunity to discover new music!'
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
            'Curator Vendor | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Join the largest playlisting network here on Artist Republik, the only 360 degree platform! We give playlisting curators the opportunity to discover new music!'
        }
      ]
    }
  },
  data () {
    return {
      step: 1,
      planType: 'curator',
      plan: null,
      plans: []
    }
  },
  methods: {
    ...mapActions({
      fetchSettings: 'fetchSettings'
    }),
    buySubscription () {
      this.$refs.subscription.openModal()
    },
    subscribed () {
      this.showSubscriptionBanner = false
    },
    getBannerData: async function () {
      this.loading = true
      try {
        let { data: { data } } = await Vue.$http.get(`v1/service/playlist-republik/subscription/plan?type=${this.planType}`)
        this.plans = data
        this.plan = data[0]
      } catch (err) {
        this.throwError(err)
      }
      this.loading = false
    }
  },
  computed: {
    ...mapGetters({
      subscriptions: 'getSubscriptions',
      isCurator: 'getIsCurator'
    }),
    hideSubscriptionBanner () {
      if (this.subscriptions.hasOwnProperty(this.planType) && this.subscriptions.curator === true) {
        return true
      } else {
        this.getBannerData()
        return false
      }
    }
  }
}
</script>
<style>
.bg-curatorhub {
  padding-top: 25% !important;
}

@media screen and (min-width: 992px) {
  .bg-curatorhub {
    padding-top: 7.5% !important;
  }
}
</style>
<style scoped>
.theme--light.v-banner.v-sheet .v-banner__wrapper {
  border-bottom: 0;
  padding: 0;
}
</style>
