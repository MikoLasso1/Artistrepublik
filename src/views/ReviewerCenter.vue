<template>
  <div class="h-100">
    <header class="header" style="position:relative;height: 150px;">
      <picture style="position: absolute;width: 100%;height: 100%;">
        <source
          media="(max-width: 1199px)" srcset="/img/elite-reviews/banner_sm.webp 1x,
                        /img/elite-reviews/banner_sm.webp 2x,
                        /img/elite-reviews/banner_sm.webp 3x" type="image/webp"
        >
        <source
          media="(max-width: 1199px)" srcset="/img/elite-reviews/banner_sm.png 1x,
                        /img/elite-reviews/banner_sm.png 2x,
                        /img/elite-reviews/banner_sm.png 3x" type="image/png"
        >
        <source
          media="(min-width: 1200px)" srcset="/img/elite-reviews/banner_sm.webp 532w,
                        /img/elite-reviews/banner_md.webp 1600w,
                        /img/elite-reviews/banner.webp 2460w" type="image/webp" sizes="100vw"
        >
        <source
          media="(min-width: 1200px)" srcset="/img/elite-reviews/banner_sm.png 532w,
                        /img/elite-reviews/banner_md.png 1600w,
                        /img/elite-reviews/banner.png 2460w" type="image/png" sizes="100vw"
        >
        <img src="/img/elite-reviews/banner.png" style="width: 100%" class="w-100 h-auto" alt="Elite Reviews" loading="lazy" />
      </picture>
      <v-col md="12" style="height: inherit; margin: 0px; width: 100%; display: flex;">
        <v-btn class="account-btn" color="primary" @click="openReviewerModal">{{ elite_reviewer.is_reviewer ? 'Modify Account' : 'List yourself' }}</v-btn>
      </v-col>
    </header>
    <v-container>
      <v-main class="px-5">
        <v-container style="marginTop:10px; padding: 0px!important" class="container-fluid pb-8">
          <v-card class="w-100" style="padding: 1em!important;">
            <v-card-title>
              Elite Review Orders
            </v-card-title>
            <v-row align="center" no-gutters class="w-100 py-1">
              <order-summary :reviewer="seller" :settings="settings" />
            </v-row>
            <v-row align="center" no-gutters class="w-100 py-4">
              <orders-table :manage-orders="true" :seller="seller" :buyer="buyer" />
            </v-row>
          </v-card>
        </v-container>
      </v-main>
    </v-container>
    <reviewer-modal :settings="settings" :is-reviewer="elite_reviewer.is_reviewer" ref="accountModal" @success="updateReviewer" />
  </div>
</template>

<script>
import {
  mapGetters,
  mapMutations,
  mapActions
} from 'vuex'

import ReviewerModal from '@/components/EliteReviews/ReviewerModal'
import OrderSummary from '@/components/EliteReviews/OrderSummary'
import OrdersTable from '@/components/EliteReviews/OrdersTable'

export default {
  components: {
    OrderSummary,
    OrdersTable,
    ReviewerModal
  },
  metaInfo () {
    return {
      title: 'Elite Reviews',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content:
            'Elite Reviews on Artist Republik enables artists to get their music reviewed by top tier artists for feedback and personal growth. We are the only 360 platform.'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content:
            'Elite Reviews | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content:
            'Elite Reviews on Artist Republik enables artists to get their music reviewed by top tier artists for feedback and personal growth. We are the only 360 platform.'
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
            'Elite Reviews | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Elite Reviews on Artist Republik enables artists to get their music reviewed by top tier artists for feedback and personal growth. We are the only 360 platform.'
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
      settings: 'getReviewerSettings',
      socialMedia: 'getReviewSocialMedia',
      genres: 'getReviewGenres',
      elite_reviewer: 'getEliteReviewer',
      types: 'getReviewTypes'
    }),
    seller: function () {
      return this.settings.uuid
    },
    buyer: function () {
      return this.$store.state.settings.account.general.email
    }
  },
  methods: {
    ...mapActions({
      fetchReviewer: 'fetchReviewerSettings',
      fetchGenres: 'fetchReviewGenres',
      fetchSocialMedia: 'fetchReviewSocialMedia',
      fetchTypes: 'fetchReviewTypes'
    }),
    ...mapMutations({
      setReviewer: 'setReviewerSettings',
      setEliteReviewer: 'setEliteReviewer'
    }),
    resetReviewer: function () {
      this.reviewer = {}
    },
    openReviewerModal: function () {
      this.$refs.accountModal.open()
    },
    updateReviewer (data) {
      this.setReviewer(data)
      this.setEliteReviewer({
        uuid: data.uuid,
        is_banned: data.suspended === false ? false : true,
        is_reviewer: data.uuid ? true : false,
        status: data.status || 'pending'
      })
    }
  },
  created () {
    if (this.genres.length === 0) {
      this.fetchGenres()
    }
    if (this.elite_reviewer.is_reviewer && !this.settings.uuid) {
      this.fetchReviewer(this.$store.state.settings.account.uuid) // Prefetch
    }

    if (!this.socialMedia || this.socialMedia.length === 0) {
      this.fetchSocialMedia() // Prefetch
    }

    if (this.types.length === 0) {
      this.fetchTypes() // Prefetch
    }

  }
}
</script>

<style>
.overflow-fix .v-toolbar__content {
  height: auto !important;
  flex-wrap: wrap;
}

@media screen and (min-width: 1660px) {
  .topbar-page-title {
    opacity: 0 !important;
  }

  .account-btn {
    position: absolute;
    background: transparent;
    z-index: 2;
  }
}

.account-btn {
  margin-left: auto;
  margin-top: 10px;
  justify-self: flex-end;
  align-self: flex-start;
}
</style>
