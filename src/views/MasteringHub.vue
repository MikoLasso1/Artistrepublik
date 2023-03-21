<template>
  <div class="h-100">
    <header class="header" style="position:relative;height: 150px;">
      <picture style="position: absolute;width: 100%;height: 100%;">
        <source media="(max-width: 1199px)"
                srcset="/img/audio-engineering/banner_sm.webp 1x,
                        /img/audio-engineering/banner_sm.webp 2x,
                        /img/audio-engineering/banner_sm.webp 3x"
                type="image/webp">
        <source media="(max-width: 1199px)"
                srcset="/img/audio-engineering/banner_sm.png 1x,
                        /img/audio-engineering/banner_sm.png 2x,
                        /img/audio-engineering/banner_sm.png 3x"
                type="image/png">
        <source media="(min-width: 1200px)"
                srcset="/img/audio-engineering/banner_sm.webp 532w,
                        /img/audio-engineering/banner_md.webp 1600w,
                        /img/audio-engineering/banner.webp 2460w"
                type="image/webp" sizes="100vw">
        <source media="(min-width: 1200px)"
                srcset="/img/audio-engineering/banner_sm.png 532w,
                        /img/audio-engineering/banner_md.png 1600w,
                        /img/audio-engineering/banner.png 2460w"
                type="image/png" sizes="100vw">
        <img src="/img/audio-engineering/banner.png" class="w-100 h-auto" alt="Audio Engineering" loading="lazy">
      </picture>
    </header>
    <v-container fluid>
      <v-main class="px-5">
        <v-data-iterator
          :loading="loading"
          :items="services"
          :items-per-page.sync="options.pagination.ipp"
          :page.sync="options.pagination.page"
          hide-default-footer
          class="d-flex flex-column mh-100 overflow-hidden">
          <template #header>
            <v-form v-model="valid" ref="form">
              <v-container fluid class="px-2 py-2" style="background-color: #172b4d">
                <v-row align="center" class="mx-0 py-md-1">
                  <v-col cols="12" lg="6">
                    <v-text-field dark clearable flat solo-inverted hide-details class="mx-0" label="Search" v-model="filters.search" @click:clear="clearSearch" />
                  </v-col>
                  <template v-if="$vuetify.breakpoint.lgAndUp">
                    <v-col cols="12" md="6" style="display: inline-flex; align-items: center; justify-content: space-between;">
                      <v-select dark style="max-width:47%" v-model="options.sort.column" flat solo-inverted hide-details :items="sortBy" item-text="name" item-value="value" label="Sort by"></v-select>
                      <v-btn-toggle dark style="padding: 0 0.5em;background: none;" v-model="options.sort.direction" mandatory>
                        <v-btn dark fab small depressed color="blue" value="asc">
                          <v-icon>mdi-arrow-up</v-icon>
                        </v-btn>
                        <v-btn dark fab small depressed color="blue" value="desc">
                          <v-icon>mdi-arrow-down</v-icon>
                        </v-btn>
                      </v-btn-toggle>
                      <v-btn @click="getServices" rounded outlined color="primary" dark>{{ 'Sort & Filter' }}</v-btn>
                    </v-col>
                  </template>
                </v-row>
                <v-row align="center" class="mx-0 py-md-1">
                  <v-col cols="12" md="3" class="py-1 py-md-0">
                    <v-select clearable dark style="padding: 0em" v-model="filters.genre" flat solo-inverted hide-details :items="genres" item-text="name" item-value="id" label="Genre"></v-select>
                  </v-col>

                  <v-col cols="12" md="3" class="py-1 py-md-0">
                    <v-select clearable dark style="padding: 0em" v-model="filters.price" flat solo-inverted hide-details :items="prices" item-text="name" return-object label="Price"></v-select>
                  </v-col>

                  <v-col cols="12" md="3" class="py-1 py-md-0">
                    <v-select
                      clearable dark style="padding: 0em" v-model="filters.turnaround" flat solo-inverted hide-details :items="turnaround" item-text="name" return-object
                      label="Turnaround Time"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" md="3" class="py-1 py-md-0">
                    <v-select clearable dark style="padding: 0em" v-model="filters.order" flat solo-inverted hide-details :items="orders" item-text="name" return-object label="# of Orders"></v-select>
                  </v-col>
                </v-row>
                <template v-if="$vuetify.breakpoint.mdAndDown">
                  <v-row align="center" class="mx-3 py-md-1">
                    <v-select
                      dark style="max-width: 145px;" v-model="options.sort" flat solo-inverted hide-details :items="sortBy" item-text="name" item-value="value" @change="getServices"
                      label="Sort by"
                    ></v-select>
                    <v-btn-toggle dark style="padding-left: 1em;background: none;" v-model="options.sort.direction" mandatory>
                      <v-btn dark small fab depressed color="blue" value="asc">
                        <v-icon>mdi-arrow-up</v-icon>
                      </v-btn>
                      <v-btn dark small fab depressed color="blue" value="desc">
                        <v-icon>mdi-arrow-down</v-icon>
                      </v-btn>
                    </v-btn-toggle>
                  </v-row>
                  <v-row align="center" class="mx-0 py-4" style="padding: 1em 0em;">
                    <v-col cols="12" md="6">
                      <v-btn @click="getServices" rounded outlined color="primary" dark>{{ 'Sort & Filter' }}</v-btn>
                    </v-col>
                  </v-row>
                </template>
              </v-container>
            </v-form>
            <v-col md="12" class="py-4">
              <v-btn class="account-btn" color="primary" @click="openEngineerModal">{{ audio_engineer.is_audio_engineer ? 'Modify Account' : 'List yourself' }}</v-btn>
            </v-col>
          </template>
          <template #default="props">
            <v-row class="fill-height overflow-auto" id="container">
              <v-col v-for="(item) in props.items" :key="item.name" :cols="(12/itemsPerRow)" class="py-2">
                <v-card class="card fill-height pointer">
                  <v-img class="white--text align-end" @click="() => showService(item)" style="max-height: 200px" height="200px" :src="getImage(item)" alt="reviewer image" loading="lazy" />
                  <v-card-title>
                                    <span class="font-weight-light text-truncate">
                                        {{ item.title }}
                                    </span>
                  </v-card-title>
                  <v-card-subtitle class="pb-0">{{ item.catalog.engineer.user.name }}</v-card-subtitle>
                  <v-card-text>
                    <v-row v-if="item.average_rating && item.average_rating > 0" align="center" class="mx-0">
                      <v-rating :value="item.average_rating" color="amber" dense half-increments readonly></v-rating>
                      <div class="grey--text ml-4">{{ item.average_rating }} ({{ item.total_ratings }})</div>
                    </v-row>
                    <v-row align="center" class="mx-0">
                      <div class="my-4 subtitle-1">
                        {{ (item.total / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}
                      </div>
                    </v-row>
                    <v-row align="center" class="mx-0">
                      <v-chip>{{ item.subtask.task.name }}</v-chip>
                      <v-chip>{{ item.subtask.name }}</v-chip>
                    </v-row>
                  </v-card-text>

                  <v-card-actions>
                    <v-btn color="orange" text @click="() => orderService(item)" @close="resetService">
                      Buy
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="green" text @click="() => showService(item)">
                      Details
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
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
      </v-main>
    </v-container>
    <become-engineer-modal ref="accountModal" @success="getServices" />
    <order-modal :service="service" ref="orderModal" />
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import Vue from 'vue'

const _ = require('lodash')
import BecomeEngineerModal from '@/components/AudioEngineering/BecomeEngineerModal'
import OrderModal from '@/components/AudioEngineering/OrderModal'

export default {
  components: {
    BecomeEngineerModal,
    OrderModal
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
      cartKey: null,
      service: {},
      services: [],
      genres: [],
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
        operation: '<',
        name: 'Under a day'
      },
        {
          value: 86400 * 3,
          name: 'Under 3 days'
        },
        {
          value: 86400 * 7,
          name: 'Under 1 week'
        },
        {
          value: 86400 * 13,
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
        value: 'title',
        name: 'Name'
      },
        {
          value: 'price',
          name: 'Price'
        },
        {
          value: 'turnaround',
          name: 'Turnaround'
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
          column: 'title',
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
        path: '/api/v1/audio-engineering/services',
        per_page: 20,
        to: 0,
        total: 0,
        rpp: 4
      },
      loading: false,
      busy: false,
      valid: false
    }
  },
  computed: {
    ...mapGetters({
      audio_engineer: 'getAudioEngineer'
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
    showService (item) {
      this.$router.push('/features/audio-engineering/service/' + item.id)
    },
    getImage (item) {
      return item.catalog.url ? item.catalog.url : '/img/brand/logo_dark.png'
    },
    clearSearch () {
      this.filters.search = ''
    },
    resetService: function () {
      this.service = {}
    },
    orderService: function (service) {
      this.service = service
      this.openOrderModal()
    },
    openOrderModal: function () {
      this.$refs.orderModal.open()
    },
    openEngineerModal: function () {
      this.$refs.accountModal.open()
    },
    getServices () {
      this.loading = true
      const params = this.serializeQuery(this.removeEmptyObjects({
        filters: this.filters,
        page: this.options.pagination.page,
        options: this.options
      }, _.identity))
      Vue.$http.get(`v1/audio-engineering/services?${params}`)
        .then(response => {
          this.loading = false
          this.services = response.data.data
          this.pagination = {
            ...this.pagination,
            ...response.data.meta
          }
          setTimeout(() => {
            this.calcRowsPerPage()
          }, 100)
        }).catch(() => this.loading = false)
    },
    nextPage () {
      if (this.options.pagination.page + 1 <= this.pagination.last_page) this.options.pagination.page += 1
      this.getServices()
    },
    formerPage () {
      if (this.options.pagination.page - 1 >= 1) this.options.pagination.page -= 1
      this.getServices()
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
    this.$store.dispatch('getGenres').then(() => {
      this.genres = this.$store.getters.getGenres
    }).catch(err => this.$sentry.captureException(err))
    this.getServices()
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

<style scoped>
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

  .account-btn {
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

.pointer {
  cursor: pointer;
}
</style>
