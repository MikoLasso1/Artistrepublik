<template>
  <v-row class="py-8">
    <v-col cols="6" sm="3">
      <router-link class="text-center" to="/features/distribution">
        <v-img
          width="60" src="/img/dashboard/getstarted/distribution_sm.png"
          srcset="/img/dashboard/getstarted/distribution_sm.webp"
          alt="disc and music note"
          loading="lazy"
          class="distributiontools-image"
        />
        <h3 class="distributiontools-heading">Distribution</h3>
        <p class="distributiontools-text">The easiest and most artist friendly music distribution in the world.</p>
      </router-link>
    </v-col>
    <v-col cols="6" sm="3">
      <router-link class="text-center" to="/features/mastering">
        <v-img width="60" src="/img/dashboard/getstarted/mastering_sm.png" srcset="/img/dashboard/getstarted/mastering_sm.webp" alt="disc in sleeve" loading="lazy" class="distributiontools-image" />
        <h3 class="distributiontools-heading">Mastering</h3>
        <p class="distributiontools-text">Have your music mastered by professional audio engineers.</p>
      </router-link>
    </v-col>
    <v-col cols="6" sm="3">
      <router-link class="text-center" to="/features/reviews">
        <v-img
          width="60" src="/img/elite-reviews/elite_reviews_icon_sm.png"
          srcset="/img/elite-reviews/elite_reviews_icon_sm.webp"
          alt="music notes and chart" loading="lazy"
          class="distributiontools-image"
        />
        <h3 class="distributiontools-heading">Elite Reviews</h3>
        <p class="distributiontools-text">Have your song/beat reviewed by top artists / producers in the industry.</p>
      </router-link>
    </v-col>
    <v-col cols="6" sm="3">
      <router-link class="text-center distributiontools-link" to="/features/distribution">
        <v-btn
          fab
          dark
          large
          color="#001834"
          elevation="0"
          class="distributiontools-btn"
        >
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
        <h3 class="distributiontools-heading">See More Distribution Tools</h3>
        <p class="distributiontools-text">There is more to explore...</p>
      </router-link>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'DistributionTools',
  data () {
    return {
      routeName: this.$route.name
    }
  }
}
</script>
<style>
.distributiontools-image {
  margin: 0 auto;
}

.distributiontools-heading {
  font-family: "Montserrat", sans-serif;
  font-size: 0.65rem;
  color: #121d3b;
}

.distributiontools-text {
  text-transform: uppercase;
  font-size: 0.55rem;
  color: #121d3b;
}

.distributiontools-link {
  display: block;
}

.distributiontools-btn {
  margin: 5px auto;
}
</style>
