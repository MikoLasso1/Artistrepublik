<template>
  <div class="soundstore">
    <header>
      <v-base-header image="/img/sound-store/banner.png" />
      <navbar />
    </header>
    <v-container fluid>
      <featured />
      <!-- <filters class="hidden-sm-and-down mt-4" /> -->
      <div v-if="!loading" class="rows">
        <listings-row
          class="mt-4"
          :listings="listings.cents_beats"
          title="$0.99 Beats"
          :link="`/features/sound-store/cents-beats`"
        />
        <listings-row
          class="mt-4"
          :listings="listings.top_beats"
          title="Top Beats"
          :link="`/features/sound-store/beats`"
        />
        <!-- <listings-row
          class="mt-4"
          :listings="listings.top_sample_packs"
          title="Top Sample Packs"
          type="sample-packs"
          :link="`/features/sound-store/samples`"
        /> -->
        <listings-row
          class="mt-4"
          :listings="listings.newest_beats"
          title="Newest Beats"
          :link="`/features/sound-store/beats`"
        />
        <!-- <listings-row
          class="mt-4"
          :listings="listings.newest_sample_packs"
          title="Newest Sample Packs"
          type="sample-packs"
          :link="`/features/sound-store/samples`"
        /> -->
      </div>
      <div v-else class="text-center mt-4">
        <v-progress-circular indeterminate color="primary" />
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Navbar from '@/components/SoundStore/Navbar'
import Featured from '@/components/SoundStore/Featured'
import ListingsRow from '@/components/SoundStore/ListingsRow'

export default {
  components: {
    Navbar,
    Featured,
    ListingsRow
  },
  metaInfo () {
    return {
      title: 'Sound Store',
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
          content: 'Sound Store | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
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
            'Sound Store | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
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
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      listings: 'SSListings/getListings'
    })
  },
  methods: {
    ...mapActions({
      fetchListings: 'SSListings/fetchListings'
    })
  },
  mounted: async function () {
    this.loading = true
    await this.fetchListings()
    this.loading = false
  }
}
</script>

<style>
.soundstore {

}
</style>
