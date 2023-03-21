<template>
  <div class="elitereviews h-100">
    <FeatureHeaderImage />
    <GenreNavigation :genres="genres" @choice="filterReviewers($event)" />
    <v-navigation-drawer
      v-model="filterDrawer"
      absolute
      temporary
      right
      color="#172b4d"
    >
      <v-form v-model="valid" ref="form">
        <v-list dense>
          <v-list-item>
            <v-list-item-content>
              <v-text-field dark flat solo-inverted hide-details label="Search" prepend-inner-icon="mdi-magnify" v-model="filters.search" @click:clear="clearSearch" />
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-select class="mx-0 py-0" clearable dark v-model="filters.order" flat solo-inverted hide-details :items="orders" item-text="name" return-object label="# of Orders"></v-select>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-select
                class="mx-0 py-0" clearable dark v-model="filters.turnaround" flat solo-inverted hide-details :items="turnaround" item-text="name" return-object
                label="Turnaround Time"
              ></v-select>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-select class="mx-0 py-0" clearable dark v-model="filters.genre" flat solo-inverted hide-details :items="genres" item-text="name" item-value="code" label="Genre"></v-select>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-select class="mx-0 py-0" clearable dark v-model="filters.price" flat solo-inverted hide-details :items="prices" item-text="name" return-object label="Price"></v-select>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-select class="mx-0 py-0" dark v-model="options.sort.column" flat solo-inverted hide-details :items="sortBy" item-text="name" item-value="value" label="Sort by"></v-select>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-row>
                <v-col cols="12">
                  <v-btn-toggle dark v-model="options.sort.direction" mandatory background-color="transparent">
                    <v-btn dark fab small color="#2D87D2" value="asc">
                      <v-icon>mdi-arrow-up</v-icon>
                    </v-btn>
                    <v-btn dark fab small color="#2D87D2" value="desc">
                      <v-icon>mdi-arrow-down</v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-row class="py-3">
                <v-col cols="12">
                  <v-btn @click="getReviewers" rounded color="primary" class="elitereviews-mobile-submit">{{ 'Sort & Filter' }}</v-btn>
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-form>
    </v-navigation-drawer>
    <v-container fluid class="mt--3 elitereviews-page">
      <v-main>
        <v-data-iterator v-if="all" :loading="loading" :items="reviewers" :items-per-page.sync="options.pagination.ipp" :page.sync="options.pagination.page" hide-default-footer hide-default-header>
          <template #header>
            <v-row class="my-3 mx-0">
              <v-btn color="primary" @click="openReviewerModal">{{ elite_reviewer.is_reviewer ? 'Modify Account' : 'List yourself' }}</v-btn>
              <p @click="clearAllFilters()" class="elitereviews-all-link">{{ all ? 'See all genres' : 'See all reviewers' }}
                <v-icon small color="#172B4D">mdi-arrow-right</v-icon>
              </p>
              <v-spacer />
              <v-btn
                color="primary"
                dark
                x-large
                icon
                rounded
                @click.stop="filterDrawer = !filterDrawer"
                class="elitereviews-mobile-filter"
              >
                <v-icon dark>mdi-filter-variant</v-icon>
              </v-btn>
            </v-row>
          </template>
          <!-- eslint-disable-next-line vue/no-unused-vars -->
          <template #default="props">
            <v-row class="fill-height overflow-auto" id="container" />
          </template>
          <template #footer>
            <v-row class="no-gutters mt-auto py-2 shrink" align="center" justify="center">
              <v-spacer></v-spacer>
              <span class="mr-4 grey--text">
                            Page {{ options.pagination.page }} of <span v-text="pagination.last_page" class="font-weight-bold primary--text"></span>
                        </span>
              <v-btn small dark rounded color="blue darken-3" class="mr-1" @click="formerPage">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn small dark rounded color="blue darken-3" class="ml-1" @click="nextPage">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-row>
          </template>
        </v-data-iterator>
        <v-data-iterator v-if="!all" :loading="loading" :items="genreSort" :items-per-page.sync="options.pagination.ipp" :page.sync="options.pagination.page" hide-default-footer hide-default-header>
          <template #header>
            <v-row class="my-3 mx-0">
              <v-btn color="primary" @click="openReviewerModal">{{ elite_reviewer.is_reviewer ? 'Modify Account' : 'List yourself' }}</v-btn>
              <p @click="clearAllFilters()" class="elitereviews-all-link">{{ all ? 'See all genres' : 'See all reviewers' }}
                <v-icon small color="#172B4D">mdi-arrow-right</v-icon>
              </p>
              <v-spacer />
              <v-btn
                color="primary"
                dark
                x-large
                icon
                rounded
                @click.stop="filterDrawer = !filterDrawer"
                class="elitereviews-mobile-filter"
              >
                <v-icon dark>mdi-filter-variant</v-icon>
              </v-btn>
            </v-row>
          </template>
          <!-- eslint-disable-next-line vue/no-unused-vars -->
          <template #default="props">
            <v-row v-for="(genre, i) in genreSort" :key="genre.pair.name" class="fill-height overflow-auto" id="container">
              <v-col cols="12">
                <h2 @click="filterReviewers(genre.pair.name)" class="elitereviews-genre-heading">
                  {{ genres[i].name }}<span class="elitereviews-genre-link">&nbsp;&nbsp;See all <v-icon small color="#172B4D">mdi-arrow-right</v-icon></span>
                </h2>
              </v-col>
              <v-col v-for="(item, idx) in genre.pair.genreReviewers" :key="idx" :cols="(12/itemsPerRow)" class="elitereviews-reviewer">
                <v-card class="fill-height">
                  <v-img :aspect-ratio="1/1" class="white--text align-end" :src="getImage(item)" :lazy-:src="getImage(item)" @click="() => orderReview(item)" />
                  <v-card-title>
                    <h2 class="font-weight-light text-truncate elitereviews-reviewer-brand">
                      {{ item.brand }}
                    </h2>
                  </v-card-title>
                  <v-card-text>
                    <v-row align="center" class="mx-0">
                      <div class="my-4 subtitle-1 elitereviews-reviewer-price">
                        <span v-if="item.price_range.length > 1">
                            <span v-if="item.price_range[0] !== 0">{{ (item.price_range[0] + (item.price_range[0] * 0.3)).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }} - </span>
                            <span v-else-if="item.price_range[1] !== 0 && item.price_range.length !== 2">
                              {{ (item.price_range[1] + (item.price_range[1] * 0.3)).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }} -
                            </span>
                            <span>
                              {{
                                (item.price_range[item.price_range.length - 1] + (item.price_range[item.price_range.length - 1] * 0.3)).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                              }}
                            </span>
                        </span>
                        <span v-else-if="item.price_range[0] !== 0">
                          <span>{{ (item.price_range[0] + (item.price_range[0] * 0.3)).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</span>
                        </span>
                      </div>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="orange" text @click="() => orderReview(item)" @close="resetReviewer">
                      Buy
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="green" text @click="() => showReviewer(item)">
                      Details
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
      </v-main>
    </v-container>
    <reviewer-modal :settings="settings" :is-reviewer="elite_reviewer.is_reviewer" ref="accountModal" @success="updateReviewer" />
    <review-order-modal :reviewer="reviewer" ref="orderModal" />
  </div>
</template>

<script>
import {
  mapGetters,
  mapMutations,
  mapActions
} from 'vuex'
import Vue from 'vue'
import config from '@/config'

const _ = require('lodash')
import FeatureHeaderImage from '@/components/FeatureHeaderImage'
import GenreNavigation from '@/components/EliteReviews/GenreNavigation'
import ReviewerModal from '@/components/EliteReviews/ReviewerModal'
import ReviewOrderModal from '@/components/EliteReviews/ReviewOrderModal'

export default {
  components: {
    ReviewerModal,
    ReviewOrderModal,
    FeatureHeaderImage,
    GenreNavigation
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
      all: false,
      filterDrawer: null,
      cartKey: null,
      reviewers: [],
      reviewer: {},
      genreSort: [],
      prices: [{
        value: 10000,
        operation: '<',
        name: 'Under $100'
      },
        {
          value: [10000, 25000],
          name: '$100 to $250'
        },
        {
          value: [25000, 50000],
          name: '$250 to $500'
        },
        {
          value: [50000, 75000],
          name: '$500 to $750'
        },
        {
          value: [75000, 100000],
          name: '$750 to $1000'
        },
        {
          value: 100000,
          operation: '>',
          name: '$750 to $1000'
        }
      ],
      turnaround: [{
        value: 86400 * 1,
        operation: '<=',
        name: 'Under a day'
      },
        {
          value: 86400 * 3,
          operation: '<=',
          name: 'Under 3 days'
        },
        {
          value: 86400 * 7,
          operation: '<=',
          name: 'Under 1 week'
        },
        {
          value: 86400 * 13,
          operation: '<=',
          name: 'Under 2 weeks'
        },
        {
          value: 86400 * 14,
          operation: '>=',
          name: '2 weeks & above'
        }
      ],
      orders: [{
        value: 10,
        operation: '<',
        name: 'Under 10 orders'
      },
        {
          value: [10, 25],
          name: '10 - 25 orders'
        },
        {
          value: [25, 50],
          name: '10 - 25 orders'
        },
        {
          value: [50, 75],
          name: '50 - 75 orders'
        },
        {
          value: [75, 100],
          name: '75 - 100 orders'
        },
        {
          value: 100,
          operation: '>',
          name: '100 & above orders'
        }
      ],
      sortBy: [{
        value: 'name',
        name: 'Name'
      },
        {
          value: 'order',
          name: 'Orders'
        }
      ],
      filters: {
        search: '',
        order: {},
        turnaround: {},
        price: {},
        genre: {}
      },
      options: {
        sort: {
          column: 'name',
          direction: 'desc'
        },
        pagination: {
          page: 1,
          ipp: 20
        }
      },
      pagination: {
        current_page: 1,
        from: 0,
        last_page: 1,
        path: config.REVIEW_REPUBLIK_API_URL + '/api/v1/reviewers',
        per_page: 20,
        to: 0,
        total: 0,
        rpp: 4
      },
      loading: false,
      busy: false,
      valid: false,
      target: 0,
      scrolloptions: {
        duration: 300,
        offset: 0,
        easing: 'easeInOutCubic'
      }
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
    rowsPerPage () {
      return this.pagination.rpp
    },
    itemsPerRow () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 1
        case 'sm':
          return 2
        case 'md':
          return 3
        case 'lg':
          return 4
        case 'xl':
          return 6
      }
      return 4
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
    showReviewer (item) {
      this.$router.push('/elite-reviews/reviewer/' + item.uuid)
    },
    getImage (item) {
      return item.img_url ? item.img_url : '/img/brand/logo_dark.png'
    },
    clearSearch () {
      this.filters.search = ''
    },
    clearAllFilters () {
      this.filters = {
        search: '',
        order: {},
        turnaround: {},
        price: {},
        genre: {}
      }
      this.all = !this.all
    },
    resetReviewer: function () {
      this.reviewer = {}
    },
    orderReview: function (reviewer) {
      this.reviewer = reviewer
      this.openOrderModal()
    },
    openOrderModal: function () {
      this.$refs.orderModal.open()
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
      this.getReviewers()
    },
    getReviewers () {
      this.filterDrawer = false
      this.loading = true
      const params = this.serializeQuery(this.removeEmptyObjects({
        filters: this.filters,
        page: this.options.pagination.page,
        options: this.options
      }, _.identity))
      Vue.$http.get(config.REVIEW_REPUBLIK_API_URL + `/api/v1/reviewers?${params}`)
        .then(response => {
          this.loading = false
          this.reviewers = response.data.data
          this.pagination = {
            ...this.pagination,
            ...response.data.meta
          }
          if (this.genreSort.length === 0) {
            this.genres.forEach((genre) => {
              let pair = {}
              pair.name = genre.code
              pair.genreReviewers = []
              this.genreSort.push({ pair })
            })
          }
          if (this.genreSort[0].pair.genreReviewers.length < 1) {
            this.reviewers.forEach((rev) => {
              rev.genres.forEach((gen) => {
                this.genreSort.forEach((sort) => {
                  if (sort.pair.name === gen.code) {
                    sort.pair.genreReviewers.push(rev)
                  }
                })
              })
            })
          }
          setTimeout(() => {
            this.calcRowsPerPage()
          }, 100)
        }).catch(() => this.loading = false)
      this.loading = false
    },
    filterReviewers (choice) {
      if (choice !== '') {
        this.filters.genre = choice
      } else {
        this.filters.genre = {}
      }
      this.getReviewers()
      this.all = true
      this.$vuetify.goTo(this.target, this.scrolloptions)
    },
    nextPage () {
      if (this.options.pagination.page + 1 <= this.pagination.last_page) this.options.pagination.page += 1
      this.getReviewers()
    },
    formerPage () {
      if (this.options.pagination.page - 1 >= 1) this.options.pagination.page -= 1
      this.getReviewers()
    },
    calcRowsPerPage () {
      let container = document.getElementById('container')
      let minItemHeight = 170
      if (container) {
        let containerHeight = parseInt(container.clientHeight, 0)
        this.pagination.rpp = Math.floor(Math.max(containerHeight, minItemHeight) / minItemHeight)
      } else {
        this.pagination.rpp = 3
      }
    },
    removeEmptyObjects (obj) {
      return _(obj)
        .pickBy(_.isObject) // pick objects only
        .mapValues(this.removeEmptyObjects) // call only for object values
        .omitBy(_.isEmpty) // remove all empty objects
        .assign(_.omitBy(obj, _.isObject)) // assign back primitive values
        .value()
    },
    serializeQuery (params, prefix) {
      const query = Object.keys(params).map((key) => {
        const value = params[key]
        if (params[key] === undefined) {
          delete params[key]
          return
        }
        if (params.constructor === Array) {
          key = `${prefix}[]`
        } else if (params.constructor === Object) {
          key = (prefix ? `${prefix}[${key}]` : key)
        }

        if (typeof value === 'object') {
          return this.serializeQuery(value, key)
        } else {
          return `${key}=${encodeURIComponent(value)}`
        }
      })

      return [].concat.apply([], query).join('&')
    }
  },
  created () {
    if (this.genres.length === 0) {
      this.fetchGenres()
    }
    this.getReviewers()
    if (this.elite_reviewer.is_reviewer && !this.settings.uuid) {
      this.fetchReviewer(this.$store.state.settings.account.uuid) // Prefetch
    }

    if (!this.socialMedia || this.socialMedia.length === 0) {
      this.fetchSocialMedia() // Prefetch
    }

    if (this.types.length === 0) {
      this.fetchTypes() // Prefetch
    }
  },
  mounted () {
    window.addEventListener('resize', () => {
      //debounce
      if (!this.busy) {
        this.busy = true
        setTimeout(() => {
          this.calcRowsPerPage()
          this.busy = false
        }, 300)
      }
    })
  }
}
</script>

<style>

.elitereviews-page {
  background-color: #fff;
}

.elitereviews-filters {
  background-color: #172b4d;
}

.elitereviews-all-link {
  color: #EF53B1;
  cursor: pointer;
  font-size: 0.8em;
  font-weight: 700;
  padding: 0 10px;
  align-self: center;
}

.elitereviews-all-link:hover {
  color: #172B4D;
}

.elitereviews-genre-heading {
  cursor: pointer;
}

.elitereviews-genre-heading:after {
  content: "";
  display: block;
  height: 1px;
  width: 100%;
  background: #172b4d;
}

span.elitereviews-genre-link {
  color: #EF53B1;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
}

span.elitereviews-genre-link:hover {
  color: #172B4D;
}

.elitereviews-reviewer {
  padding: 12px;
}

.elitereviews-reviewer .v-chip .v-chip__content,
.elitereviews-reviewer .v-btn .v-btn__content {
  font-size: 0.7rem
}

.elitereviews-reviewer .v-chip {
  margin: 3.5px 0;
}

@media screen and (min-width: 600px) {
  .elitereviews-reviewer .v-chip .v-chip__content {
    font-size: 0.875rem
  }

  .elitereviews-reviewer .v-btn .v-btn__content {
    font-size: 14px;
  }

  .elitereviews-reviewer .v-chip {
    margin: 0;
  }
}

@media screen and (min-width: 1200px) {
  .elitereviews-page {
    padding: 15px 60px;
  }
}
</style>
