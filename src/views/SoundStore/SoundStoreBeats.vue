<template>
  <div>
    <v-base-header image="/img/sound-store/banner.png" />
    <navbar @filterUpdated="filters" />
    <BeatsHeader>
      <template v-slot:firstnumber>$19.99</template>
      <template v-slot:firsttext>Licenses starting as low as</template>
      <template
        v-slot:maintext
      >Shop Thousands of Beats with Licensing and Exclusive Deals from Top
        Producers!
      </template
      >
      <template v-slot:lastnumber>500+</template>
      <template v-slot:lasttext>Top tier producers on our network</template>
    </BeatsHeader>
    <v-container fluid>
      <filters class="hidden-sm-and-down mt-4" @filterUpdated="filters" />
      <div v-if="!loading" class="rows">
        <listings-row
          class="mt-4"
          :listings="filteredBeatListings"
          title="All Beats"
          :hideLink="true"
          :loading="filteredBeatsProcessing"
        />
        <div class="text-center" v-if="filteredBeatListings.length">
          <v-pagination v-model="page" :length="lastPage" total-visible="6" />
        </div>
      </div>
      <div v-else class="text-center mt-4">
        <v-progress-circular indeterminate color="primary" />
      </div>
    </v-container>
  </div>
</template>

<script>
import Vue from 'vue'
import Navbar from '@/components/SoundStore/Navbar'
import BeatsHeader from '@/components/SoundStore/BeatsHeader'
import ListingsRow from '@/components/SoundStore/ListingsRow'
import Filters from '@/components/SoundStore/Filters'

export default {
  components: {
    Navbar,
    ListingsRow,
    Filters,
    BeatsHeader
  },
  metaInfo () {
    return {
      title: 'Sound Store | Beats',
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
          content: 'Beats | Sound Store | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
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
            'Beats | Sound Store | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
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
      filteredBeatListings: [],
      pagination: {},
      savedFilters: {
        genre_ids: [],
        style_ids: [],
        mood_ids: [],
        bpm: []
      },
      showListing: true,
      filteredBeatsProcessing: false
    }
  },
  computed: {
    lastPage () {
      if (this.pagination.hasOwnProperty('last_page')) {
        return this.pagination.last_page
      } else {
        return 1
      }
    }
  },
  methods: {
    async filters (filters, page = 1) {
      this.filteredBeatsProcessing = true
      this.savedFilters = filters

      try {
        let response = await Vue.$http.post(
          `v1/sound-store/beat/filtered?page=${page}`,
          {
            genre_ids: filters.genre_ids,
            style_ids: filters.style_ids,
            mood_ids: filters.mood_ids,
            bpm: filters.bpm
          }
        )

        this.filteredBeatListings = response.data.data
        this.pagination = response.data.meta
      } catch (error) {
        console.log(error)
      }
      this.filteredBeatsProcessing = false
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
    await this.filters(this.savedFilters)
    this.loading = false
  }
}
</script>

<style></style>
