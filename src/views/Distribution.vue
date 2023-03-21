<template>
  <div>
    <header class="distribution-header">
      <picture>
        <source
          media="(max-width: 1199px)"
          srcset="/img/distribution/distro_banner_sm.webp 1x,
                        /img/distribution/distro_banner_sm.webp 2x,
                        /img/distribution/distro_banner_sm.webp 3x"
          type="image/webp"
        >
        <source
          media="(max-width: 1199px)"
          srcset="/img/distribution/distro_banner_sm.jpg 1x,
                        /img/distribution/distro_banner_sm.jpg 2x,
                        /img/distribution/distro_banner_sm.jpg 3x"
          type="image/jpg"
        >
        <source
          media="(min-width: 1200px)"
          srcset="/img/distribution/distro_banner_sm.webp 640w,
                        /img/distribution/distro_banner_md.webp 1600w,
                        /img/distribution/distro_banner.webp 2460w"
          type="image/webp" sizes="100vw"
        >
        <source
          media="(min-width: 1200px)"
          srcset="/img/distribution/distro_banner_sm.jpg 640w,
                        /img/distribution/distro_banner_md.jpg 1600w,
                        /img/distribution/distro_banner.jpg 2460w"
          type="image/jpg" sizes="100vw"
        >
        <img src="/img/distribution/distro_banner.jpg" alt="Distribution Hub" class="distribution-header-img" loading="lazy">
      </picture>
    </header>
    <v-container fluid>
      <distribution-widgets class="mt--3 mb-3" />
      <DistributionServices class="my-3" @choice="showDistributionModal($event)" @distribute="showDistributionModal($event)" />
      <v-row>
        <v-col cols="12" xl="3">
          <v-row class="my-2">
            <v-col cols="12" md="6" xl="12" class="my-2">
              <v-card class="distribution-market-card">
                <v-card-title class="text-center">
                  <h2 class="distribution-heading">Market My Releases</h2>
                </v-card-title>
                <v-card-text class="text-center">
                  <v-btn @click="$vuetify.goTo('#marketing', easeInOutCubic)" color="primary">See Options</v-btn>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="6" xl="12" class="my-2">
              <v-card class="distribution-payout-card">
                <v-card-title class="align-items-center">
                  <h2 class="distribution-heading">Revenue</h2>
                </v-card-title>
                <v-card-subtitle>
                  Distribution
                </v-card-subtitle>
                <v-card-text>
                  <payout-widget />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" xl="9" class="my-4">
          <releases-table @open-draft="openReleaseDraft($event)" />
        </v-col>
      </v-row>
      <DistributionInformationPanels class="mb-4" />
      <v-row class="mb-4" id="marketing">
        <v-col cols="12" xl="4" class="my-2">
          <GWUStats />
        </v-col>
        <v-col cols="12" xl="4" class="my-2">
          <CuratorHub />
        </v-col>
        <v-col cols="12" xl="4" class="my-2">
          <PROrderWidget />
        </v-col>
      </v-row>
    </v-container>
    <SubscriptionModal ref="subscriptionModal" @subscribed="$refs.distributionModal.openDialog()" />
    <DistributionModal ref="distributionModal" :cart-key="cartKey" />
  </div>
</template>
<script>
import DistributionWidgets from '@/components/Distribution/DistributionWidgets.vue'
import DistributionModal from '@/components/Distribution/DistributionModal.vue'
import DistributionServices from '@/components/Distribution/DistributionServices.vue'
import DistributionInformationPanels from '@/components/Distribution/DistributionInformationPanels'
import ReleasesTable from '@/components/Distribution/ReleasesTable.vue'
import PayoutWidget from '@/components/Distribution/PayoutWidget.vue'
import GWUStats from '@/components/Dashboard/GrowWithUs'
import CuratorHub from '@/components/CuratorHub/CuratorHub.vue'
import PROrderWidget from '@/components/PRHub/PROrderWidget'
import SubscriptionModal from '@/components/Distribution/SubscriptionModal'
import { mapGetters } from 'vuex'

export default {
  components: {
    DistributionServices,
    DistributionInformationPanels,
    DistributionWidgets,
    DistributionModal,
    ReleasesTable,
    PayoutWidget,
    GWUStats,
    CuratorHub,
    PROrderWidget,
    SubscriptionModal
  },
  metaInfo () {
    return {
      title: 'Distribution',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content:
            'Artist Republik is a 360 degree platform offering distribution services to help launch your career! We offer reviews, mastering, playlisting, and more!'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content:
            'Distribution Hub | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content:
            'Artist Republik is a 360 degree platform offering distribution services to help launch your career! We offer reviews, mastering, playlisting, and more!'
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
            'Distribution | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Artist Republik is a 360 degree platform offering distribution services to help launch your career! We offer reviews, mastering, playlisting, and more!'
        }
      ]
    }
  },
  data () {
    return {
      cartKey: null,
      serviceChoice: 1,
      openDraft: false
    }
  },
  computed: {
    ...mapGetters({
      subscriptions: 'getSubscriptions'
    })
  },
  methods: {
    showDistributionModal (id) {
      this.serviceChoice = id
      if (this.serviceChoice < 2 && !this.subscriptions.distribution) {
        this.$refs.subscriptionModal.openModal()
      } else {
        this.$refs.distributionModal.openDialog()
      }
    },
    openReleaseDraft (release) {
      if (release) {
        this.$refs.distributionModal.openDialog()
        this.$refs.distributionModal.openDraft(release)
      }
    }
  },
  mounted () {
    if (this.isCartPresent() && this.$route.query.tool === 'distribution') {
      this.cartKey = this.$route.query.cart_key
      this.$refs.distributionModal.getRelease()
    }
  }
}
</script>
<style scoped>
.distribution-header {
  position: relative;
  display: block;
}

.distribution-header-img {
  width: 100%;
  height: auto;
}

.distribution-heading {
  margin: 0;
}

.distribution-draft-button {
  position: absolute;
  top: 15px;
  right: 15px;
}

.distribution-payout-card,
.distribution-market-card,
.distribution-releases-card {
  height: 100%;
}

.distribution-market-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
