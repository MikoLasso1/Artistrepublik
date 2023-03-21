<template>
  <div>
    <loading-overlay :loading="loading" />
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
      <v-main>
        <v-card class="w-100" style="padding:1em">
          <v-row>
            <v-col lg="6" md="6" sm="12">
              <div class="service-details">
                <div class="d-flex align-center flex-wrap mb-2">
                  <div class="label body-1 font-weight-bold mr-2">
                    Producer's Name:
                  </div>
                  <div class="body-2">{{ service.catalog.engineer.user.name }}</div>
                </div>
                <div class="mb-2">
                  <div class="label body-1 font-weight-bold mr-2 mb-2">
                    Product Details
                  </div>
                  <div class="product-details pl-6">
                    <div class="d-flex align-center flex-wrap mb-2">
                      <div class="label body-2 mr-2">Name:</div>
                      <div class="body-2">{{ service.title }}</div>
                    </div>
                    <div class="d-flex align-center flex-wrap mb-2">
                      <div class="label body-2 mr-2">Description:</div>
                      <div class="body-2">{{ service.description }}</div>
                    </div>
                    <div class="d-flex align-center flex-wrap mb-2">
                      <div class="label body-2 mr-2">Date Created:</div>
                      <div class="body-2">{{ service.created_at | formatDateTime }}</div>
                    </div>
                  </div>
                </div>
                <div class="d-flex align-center flex-wrap mb-2">
                  <div class="label body-1 font-weight-bold mr-2">Rating:</div>
                  <div v-if="service.total_ratings > 0" class="d-flex align-center mr-4">
                                    <span class="body-2 mr-2">
                                        ({{ service.total_ratings }})
                                    </span>
                    <v-rating color="warning" length="5" size="16" :value="service.average_rating" dense empty-icon="$ratingEmpty" full-icon="$ratingFull" half-icon="$ratingHalf" readonly></v-rating>
                  </div>
                  <div v-else class="d-flex align-center mr-4">
                                    <span class="body-2 mr-2">
                                        No average ratings yet.
                                    </span>
                  </div>
                  <v-btn v-if="hasOrdered" rounded color="warning" @click.prevent="review">
                    {{ hasReview ? 'Update Review' : 'Review' }}
                  </v-btn>
                </div>
                <div class="d-flex align-center flex-wrap mb-2">
                  <div class="label body-1 font-weight-bold mr-2">
                    Turn-Around Time:
                  </div>
                  <div class="body-2">{{ turnaround }}</div>
                </div>
                <div class="d-flex align-center flex-wrap mb-2">
                  <div class="label body-1 font-weight-bold mr-2">Genre:</div>
                  <div class="body-2">{{ service.catalog.engineer.genre.name }}</div>
                </div>
                <div class="d-flex align-center flex-wrap mb-2">
                  <div class="label body-1 font-weight-bold mr-2">Price:</div>
                  <div class="body-2 mr-6">
                    {{ service.total | centsToDollar }}
                  </div>
                  <v-btn rounded color="primary" @click="openOrderModal">
                    Buy
                  </v-btn>
                </div>
              </div>
            </v-col>
            <v-col lg="6" md="6" sm="12">
              <div class="service-logo">
                <v-img contain max-height="250" :lazy-src="image" :src="image" alt="logo"></v-img>
              </div>
            </v-col>
          </v-row>
        </v-card>
        <v-card
          class="pa-3"
          flat
          outline
          tile
          v-if="service.orders.length > 0"
        >
          <v-card-title>Past Projects</v-card-title>
          <v-card-text>
            <carousel :per-page="4" :navigate-to="0" :mouse-drag="true" :centerMode="true" :perPageCustom="perPage" :pagination-active-color="'#128c33'" :pagination-color="'#cfd1d0'">
              <slide v-for="(order, i) in service.orders" :key="i">
                <past-order :src="image" :order="order"></past-order>
              </slide>
            </carousel>
          </v-card-text>
        </v-card>
        <review-modal v-if="hasOrdered" ref="reviewModal" :order="service.order || {}" />
        <order-modal :service="service" ref="orderModal" />
      </v-main>
    </v-container>
  </div>
</template>

<script>
import Vue from 'vue'
import PastOrder from '@/components/AudioEngineering/ServiceDetails/PastOrder'
import ReviewModal from '@/components/AudioEngineering/ServiceDetails/ReviewModal'
import OrderModal from '@/components/AudioEngineering/OrderModal'
import LoadingOverlay from '@/components/LoadingOverlay'

import {
  Carousel,
  Slide
} from 'vue-carousel'

export default {
  components: {
    PastOrder,
    ReviewModal,
    OrderModal,
    LoadingOverlay,
    Carousel,
    Slide
  },
  props: {
    id: Number
  },
  metaInfo () {
    return {
      title: this.service.catalog.engineer.user.name,
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: this.service.description
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content:
            `${this.service.catalog.engineer.user.name}, Producer | Artist Republik | The ONLY 360 degree Platform for Independent Artists`
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content: this.service.description
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
            `${this.service.catalog.engineer.user.name}, Producer | Artist Republik | The ONLY 360 degree Platform for Independent Artists`
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content: this.service.description
        }
      ]
    }
  },
  data () {
    return {
      loading: false,
      service: {
        'id': null,
        'title': null,
        'description': null,
        'img_url': null,
        'price': null,
        'estimated_turnaround': null,
        cartKey: null,
        'catalog': {
          engineer: {
            genre: {},
            user: {}
          }
        },
        'subtask': {},
        'orders': [],
        'order': {
          review: {}
        },
        'average_rating': null,
        'created_at': null,
        'updated_at': null
      },
      perPage: [
        [320, 1],
        [810, 2],
        [1050, 3],
        [1380, 4]
      ]
    }
  },
  computed: {
    image: function () {
      return this.service.catalog.url ? this.service.catalog.url : '/img/brand/logo_dark.png'
    },
    turnaround: function () {
      return this.secondsToTime(this.service.estimated_turnaround)
    },
    hasOrdered: function () {
      return this.service.order && this.service.order.id
    },
    hasReview: function () {
      return this.hasOrdered &&
      this.service.order.review &&
      this.service.order.review.id ? true : false
    }
  },
  methods: {
    openReviewModal: function () {
      this.$refs.reviewModal.open()
    },
    openOrderModal: function () {
      this.$refs.orderModal.open()
    },
    review: function () {
      this.$refs.reviewModal.openModal()
    },
    secondsToTime: function (totalSeconds) {
      let days = Math.floor(totalSeconds / 86400)
      totalSeconds %= 86400
      let hours = Math.floor(totalSeconds / 3600)
      totalSeconds %= 3600
      let minutes = Math.floor(totalSeconds / 60)
      let seconds = totalSeconds % 60
      days = String(days)
      minutes = String(minutes).padStart(2, '0')
      hours = String(hours).padStart(2, '0')
      seconds = String(seconds).padStart(2, '0')
      return days + 'd ' + hours + ':' + minutes + ':' + seconds
    }
  },
  created: function () {
    if (this.isCartPresent() && this.$route.query.tool === 'audio-engineering-service') {
      this.cartKey = this.$route.query.cart_key
    }
  },
  mounted: async function () {
    try {
      this.loading = true
      let {
        data: {
          data
        }
      } = await Vue.$http.get('v1/audio-engineering/service/' + this.id)
      this.loading = false
      this.service = data
      if (this.isCartPresent() && this.$route.query.tool === 'audio-engineering-service') {
        this.openOrderModal()
      }
    } catch (err) {
      this.loading = false
      this.$sentry.captureException(err)
      console.log(err)
    }
  }
}
</script>

<style lang="scss" scoped>
.service-logo {
  height: 100%;
  display: flex;
  align-items: center;
}

.service-details {
  & > div {
    border-bottom: 1px solid #e8e4e4;
    padding: 8px;
  }
}
</style>
