<template>
  <div class="h-100">
    <header class="header">
      <v-img
        src="/img/networking/networking-banner.png"
        alt="Networking"
        width="100%"
        loading="lazy"
      />
    </header>

    <v-container>
      <v-row class="d-flex align-stretch">
        <v-col
          cols="12"
          class="px-3"
        >
          <v-card>
            <v-card-title>
              Nearby
            </v-card-title>
            <suggest-nearby-tiles />
          </v-card>

        </v-col>
      </v-row>
      <v-row class="d-flex align-stretch">
        <v-col
          cols="12"
          class="px-3"
        >
          <v-card>
            <v-card-title>
              Trending Tags
            </v-card-title>
            <suggest-hashtag-tiles />
          </v-card>

        </v-col>
      </v-row>
      <v-row class="d-flex align-stretch">
        <v-col
          cols="12"
          class="px-3"
        >
          <v-card>
            <v-card-title>
              Groups
            </v-card-title>
            Coming Soon...
          </v-card>

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import SuggestNearbyTiles from '@/components/Users/Nearby/SuggestNearbyTiles'
import SuggestHashtagTiles from '@/components/Hashtags/SuggestHashtagTiles'

export default {
  name: 'Networking',
  components: {
    SuggestNearbyTiles,
    SuggestHashtagTiles
  }
}
</script>

<style scoped>

</style>
