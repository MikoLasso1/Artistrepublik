<template>
  <div>
    <loading-overlay :loading="loading" />
    <FeatureHeader />
    <v-container class="elitereviews-page">
      <v-main>
        <v-card class="reviewer-card">
          <v-container>
            <v-col cols="12">
              <v-row justify="end">
                <router-link :to="'/features/reviews'">
                  <p class="elitereviews-all-link">See all reviewers
                    <v-icon small color="#172B4D">mdi-arrow-right</v-icon>
                  </p>
                </router-link>
              </v-row>
              <v-row>
                <v-col cols="12" md="5">
                  <div class="reviewer-logo">
                    <v-img :aspect-ratio="1/1" :lazy-src="image" :src="image" class="reviewer-image my-auto"></v-img>
                  </div>
                </v-col>
                <v-col cols="12" md="7">
                  <div class="reviewer-details">
                    <h1 class="reviewer-name">{{ reviewer.brand }}</h1>
                    <div class="reviewer-services d-flex flex-row flex-wrap">
                      <div class="reviewer-services-item" v-for="(service) in reviewer.services" :key="service.type">
                        <div v-show="service.enabled" class="label body-2 mr-2">
                          {{ service.name }}<br>
                          <span class="reviewer-services-price">
                            {{ (service.price + service.price * 0.3).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="reviewer-about">
                      <h2 class="body-2 reviewer-about-heading">About</h2>
                      <p class="body-2 reviewer-about-text">{{ reviewer.description }}</p>
                    </div>
                  </div>
                  <v-col cols="12" class="text-center">
                    <v-btn rounded color="primary" @click="openOrderModal" class="text-center">
                      Buy
                    </v-btn>
                  </v-col>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="3" class="reviewer-est">
                  <h2 class="body-2 reviewer-est-heading">Reviewer Est.</h2>
                  <p class="reviewer-est-date">{{ reviewer.created_at | formatDate }}</p>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="12" md="8" class="reviewer-genre">
                  <h2 class="body-2 reviewer-genre-heading">Genres</h2>
                  <v-row class="reviewer-genre-chips">
                    <v-col cols="12">
                      <v-chip class="mx-1 my-1" v-for="(genre, key) in reviewer.genres" :key="key">{{ genre.name }}</v-chip>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <reviewer-social-links :links="reviewer.links" />
              <how-it-works />
            </v-col>
          </v-container>
        </v-card>
        <v-card class="pa-3" flat outline tile v-if="reviewer.orders.length > 0">
          <v-card-title>Past Projects</v-card-title>
          <v-card-text>
            <carousel :per-page="4" :navigate-to="0" :mouse-drag="true" :centerMode="true" :perPageCustom="perPage" :pagination-active-color="'#128c33'" :pagination-color="'#cfd1d0'">
              <slide v-for="(order, i) in reviewer.orders" :key="i">
                <past-order :src="image" :order="order" />
              </slide>
            </carousel>
          </v-card-text>
        </v-card>
        <review-order-modal :reviewer="reviewer" ref="orderModal" />
      </v-main>
    </v-container>
  </div>
</template>

<script>
import Vue from 'vue'
import ReviewerSocialLinks from '@/components/EliteReviews/ReviewerDetails/ReviewerSocialLinks'
import PastOrder from '@/components/EliteReviews/ReviewerDetails/PastOrder'
import ReviewOrderModal from '@/components/EliteReviews/ReviewOrderModal'
import LoadingOverlay from '@/components/LoadingOverlay'
import FeatureHeader from '@/components/FeatureHeaderImage'
import HowItWorks from '@/components/EliteReviews/ReviewerDetails/HowItWorks'

import {
  Carousel,
  Slide
} from 'vue-carousel'
import config from '@/config'

export default {
  components: {
    PastOrder,
    ReviewerSocialLinks,
    ReviewOrderModal,
    LoadingOverlay,
    Carousel,
    Slide,
    FeatureHeader,
    HowItWorks
  },
  props: {
    uuid: String
  },
  metaInfo () {
    return {
      title: this.reviewer.brand,
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: this.reviewer.description
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content:
            `${this.reviewer.brand} on Elite Reviews | Artist Republik | The ONLY 360 degree Platform for Independent Artists`
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content: this.reviewer.description
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
            `${this.reviewer.brand} on Elite Reviews | Artist Republik | The ONLY 360 degree Platform for Independent Artists`
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content: this.reviewer.description
        }
      ]
    }
  },
  data () {
    return {
      loading: false,
      reviewer: {
        uuid: null,
        name: null,
        brand: null,
        description: null,
        img_url: null,
        average_price: null,
        average_turnaround: null,
        cartKey: null,
        services: [],
        genres: [],
        links: [],
        orders: [],
        total_ratings: null,
        average_rating: null,
        created_at: null,
        updated_at: null
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
      return this.reviewer.img_url ? this.reviewer.img_url : '/img/brand/logo_dark.png'
    },
    turnaround: function () {
      return this.secondsToTime(this.reviewer.average_turnaround)
    }
  },
  methods: {
    openOrderModal: function () {
      this.$refs.orderModal.open()
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
    if (this.isCartPresent() && this.$route.query && this.$route.query.tool === 'elite-reviews') {
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
      } = await Vue.$http.get(config.REVIEW_REPUBLIK_API_URL + '/api/v1/reviewers/' + this.$route.params.uuid)
      Object.keys(this.reviewer).forEach((key) => {
        if (key in data) {
          this.reviewer[key] = data[key]
        }
      })
      this.loading = false
      if (this.isCartPresent() && this.$route.query.tool === 'elite-reviews') {
        this.openOrderModal()
      }
    } catch (err) {
      this.loading = false
      console.log(err)
      this.$sentry.captureException(err)
    }
  }
}
</script>

<style lang="scss" scoped>
.reviewer-logo {
  height: 100%;
  display: flex;
  align-items: center;
}

.reviewer-details {
  & > div {
    border-bottom: 1px solid #e8e4e4;
    padding: 8px;
  }
}

.elitereviews {
  @media screen and (min-width: 960px) {
    &-page {
      margin: -30px auto 0;
    }
  }
}

.reviewer {
  &-header {
    position: relative;
  }

  &-all {
    padding: 0 20px;
  }

  &-card {
    width: 90%;
    margin: 1em auto;
  }

  &-logo {
    width: 90%;
    margin: 0 auto;
  }

  &-image {
    border-radius: 50%;
  }

  &-name {
    color: #121D3B;
    text-align: center;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 30px;
  }

  &-services {
    justify-content: space-around;

    &-item {
      text-align: center;
      margin: 10px 0;
      color: #121D3B;
    }

    &-price {
      color: #2196F3;
      font-size: 20px;
      font-weight: 700;
    }
  }

  &-about {
    margin: 10px auto;
    padding: 10px 0;

    &-heading {
      text-transform: uppercase;
      text-align: center;
      color: #121D3B;
      margin: 0 0 10px;
      line-height: 1;
    }

    &-text {
      color: #121D3B;
      margin: 0;
      padding: 0 10px;
      line-height: 1.2;
    }
  }

  &-est {
    text-align: center;
    margin: 10px auto;
    border: 1px solid #121D3B;
    padding: 10px 0;

    &-heading {
      text-transform: uppercase;
      color: #121D3B;
      margin: 0 0 10px;
      line-height: 1;
    }

    &-date {
      font-size: 2rem;
      color: #121D3B;
      margin: 0;
      line-height: 1;
    }
  }

  &-genre {
    text-align: center;
    margin: 10px auto;
    border: 1px solid #121D3B;
    padding: 10px 0;

    &-heading {
      text-transform: uppercase;
      color: #121D3B;
      margin: 0 0 10px;
      line-height: 1;
    }

    &-chips {
      justify-content: space-around;
      color: #d3d3d3;
    }
  }

  @media screen and (min-width: 500px) {
    &-logo {
      max-width: 500px;
    }
  }
  @media screen and (min-width: 960px) {
    &-image {
      max-width: 80%;
    }
    &-name {
      margin: 30px auto;
      text-align: left;
    }
    &-services {
      justify-content: flex-start;

      &-item {
        margin-right: 30px;
      }
    }
    &-about {
      margin: 30px auto;

      &-heading {
        text-align: left;
      }

      &-text {
        padding: 0;
      }
    }
  }
}
</style>
