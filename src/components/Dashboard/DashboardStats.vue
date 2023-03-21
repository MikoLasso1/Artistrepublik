<template>
  <div class="DashboardStats">
    <v-row>
      <v-col cols="6" xl="3">
        <StatsCard
          v-if="stats !== undefined && stats !== null"
          title="Rep Score"
          color="#7f2450"
          :stat="stats.rep"
          icon="mdi-flare"
          class="mb-4 mb-xl-0"
        />
      </v-col>
      <v-col cols="6" xl="3">
        <StatsCard
          v-if="stats !== undefined && stats !== null"
          title="Tracks"
          color="#ee378e"
          :stat="stats.tracks"
          icon="mdi-music"
          class="mb-4 mb-xl-0"
        />
      </v-col>
      <v-col cols="6" xl="3">
        <StatsCard
          v-if="stats !== undefined && stats !== null"
          title="Sales"
          color="#7b549f"
          :stat="stats.orders"
          icon="mdi-currency-usd"
          class="mb-4 mb-xl-0"
        />
      </v-col>
      <v-col cols="6" xl="3">
        <StatsCard
          v-if="stats !== undefined && stats !== null"
          title="Friends"
          color="#0f1d3a"
          :stat="stats.connects"
          icon="mdi-account-multiple"
          class="mb-4 mb-xl-0"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import StatsCard from '@/components/StatsCard'

export default {
  components: {
    StatsCard
  },
  computed: {
    stats () {
      return this.$store.getters.getDashboardStats
    }
  },
  mounted () {
    this.$store.dispatch('getStats')
  }
}
</script>
