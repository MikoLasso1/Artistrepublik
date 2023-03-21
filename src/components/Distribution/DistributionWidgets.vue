<template>
  <v-row class="DashboardStats">
    <v-col cols="6" xl="4">
      <stats-card
        title="Total Streams"
        color="red"
        :stat="stats.stream_count"
        icon="mdi-headphones"
        class="mb-4 mb-xl-0"
      />
    </v-col>
    <v-col cols="6" xl="4">
      <stats-card
        title="Total Revenue"
        color="red"
        :stat="stats.revenue"
        icon="mdi-currency-usd"
        class="mb-4 mb-xl-0"
      />
    </v-col>
    <v-col cols="6" xl="4">
      <stats-card
        title="Total Releases"
        color="red"
        :stat="stats.release_count"
        icon="mdi-music"
        class="mb-4 mb-xl-0"
      />
    </v-col>
  </v-row>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      stats: 'getDistributionStats'
    })
  },
  mounted: function () {
    this.$store.dispatch('getDistributionStats')
  }
}
</script>

<style>

</style>
