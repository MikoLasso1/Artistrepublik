<template>
  <div>
    <v-base-header image="/img/sound-store/banner.png" />
    <navbar @filterUpdated="filters" :show-styles="false" :show-bpm="false" />
    <v-container fluid>
      <!-- <featured /> -->
      <filters class="hidden-sm-and-down mt-4" :show-styles="false" :show-bpm="false" @filterUpdated="filters" />
      <div v-if="!loading" class="rows">
        <listings-row
          class="mt-4"
          :listings="filteredSampleListings"
          title="All Samples"
          type="sample-packs"
          :hideLink="true"
          :loading="filteredSamplesProcessing"
        />
        <div class="text-center" v-if="filteredSampleListings.length">
          <v-pagination
            v-model="page"
            :length="lastPage"
            :total-visible="perPage"
          ></v-pagination>
        </div>
      </div>
      <div v-else class="text-center mt-4">
        <v-progress-circular indeterminate color="primary" />
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Vue from 'vue'
import Navbar from '@/components/SoundStore/Navbar'
import ListingsRow from '@/components/SoundStore/ListingsRow'
import Filters from '@/components/SoundStore/Filters'

export default {
  components: {
    Navbar,
    ListingsRow,
    Filters
  },
  metaInfo () {
    return {
      title: 'Sound Store | Sample Packs',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content:
            'Artist Republik is a 360 degree platform offering artist submitted beats to support your sound! We offer mastering, distribution, playlisting, and more!'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'Sample Packs | Sound Store | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'og:description',
          name: 'og:description',
          content:
            'Artist Republik is a 360 degree platform offering artist submitted beats to support your sound! We offer mastering, distribution, playlisting, and more!'
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
            'Sample Packs | Sound Store | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Artist Republik is a 360 degree platform offering artist submitted beats to support your sound! We offer mastering, distribution, playlisting, and more!'
        }
      ]
    }
  },
  data: function () {
    return {
      loading: false,
      page: 1,
      filteredSampleListings: [],
      pagination: {},
      savedFilters: {
        genre_ids: [],
        style_ids: [],
        mood_ids: [],
        bpm: []
      },
      showListing: true,
      filteredSamplesProcessing: false
    }
  },
  computed: {
    ...mapGetters({
      listings: 'SSListings/getListings'
    }),
    lastPage () {
      if (this.pagination.hasOwnProperty('last_page')) {
        return this.pagination.last_page
      } else {
        return 1
      }
    },
    perPage () {
      if (this.pagination.hasOwnProperty('per_page')) {
        return this.pagination.per_page
      } else {
        return 1
      }
    }
  },
  methods: {
    ...mapActions({
      fetchListings: 'SSListings/fetchListings'
    }),
    async filters (filters, page = 1) {
      this.filteredSamplesProcessing = true
      this.savedFilters = filters

      try {
        let response = await Vue.$http.post(`v1/sound-store/sample-pack/filtered?page=${page}`, {
          genre_ids: filters.genre_ids,
          style_ids: filters.style_ids,
          mood_ids: filters.mood_ids,
          bpm: filters.bpm
        })

        this.filteredSampleListings = response.data.data
        this.pagination = response.data.meta
      } catch (error) {
        console.log(error)
      }

      this.filteredSamplesProcessing = false
    }
  },
  watch: {
    page: {
      handler: function (val) {
        this.filters(this.savedFilters, val)
      }
    },
    savedFilters: {
      handler: function () {
        this.showListing = false
      },
      deep: true
    }
  },
  mounted: async function () {
    this.loading = true
    await this.fetchListings()
    this.filters(this.savedFilters)
    this.loading = false
  }
}
</script>

<style>

</style>
