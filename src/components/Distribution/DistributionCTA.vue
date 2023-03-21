<template>
  <v-card
    id="distributioncta"
    class="distributioncta-card card"
  >
    <v-card-title>
      <h2 class="distributioncta-heading">Distribution</h2>
    </v-card-title>
    <v-card-subtitle>
      Distribute Your Songs
    </v-card-subtitle>
    <v-card-actions class="justify-center distributioncta-card-actions">
      <v-col cols="12">
        <NetworkSlider />
      </v-col>
    </v-card-actions>
    <v-card-text class="text-center">
      <h3 class="distributioncta-description-heading">Distribute Your Music Today!</h3>
      <p class="distributioncta-description">Keep 100% of Royalties | All Major Networks<br>Exclusive Tools</p>
      <router-link
        v-if="shouldBeLink"
        to="/features/distribution#distributioncta"
      >
        <v-btn color="success">
          Release Your Music
        </v-btn>
      </router-link>
      <v-btn
        v-else
        color="success"
        @click="$emit('showDistributionModal')"
      >
        Start
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import NetworkSlider from '@/components/Distribution/DistributionNetworkSlider'

export default {
  name: 'DistributionCTA',
  components: {
    NetworkSlider
  },
  computed: {
    shouldBeLink () {
      return this.$route.name !== 'features.distribution'
    }
  }
}
</script>

<style>
.distributioncta-card {
  height: 100%;
  justify-content: space-between;
}

.distributioncta-heading {
  margin: 0;
}

.distributioncta-description-heading {
  font-family: "Montserrat-SemiBold", sans-serif;
  font-size: 1.25rem;
}

.distributioncta-description {
  text-transform: uppercase;
  font-family: "Montserrat-Light", sans-serif;
  font-size: 0.9rem;
}

.distributioncta-card-actions {
  min-height: 123px;
}
</style>
