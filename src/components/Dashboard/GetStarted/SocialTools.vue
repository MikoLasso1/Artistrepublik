<template>
  <v-row class="py-8">
    <v-col cols="6" sm="3">
      <router-link class="text-center" to="/trending">
        <v-img width="60" src="/img/trending/trending_sm.png" srcset="/img/trending/trending_sm.webp" alt="disc and music note" loading="lazy" class="socialtools-image" />
        <h3 class="socialtools-heading">Trending</h3>
        <p class="socialtools-text">Discover popular artists and new music each week.</p>
      </router-link>
    </v-col>
    <v-col cols="6" sm="3">
      <router-link class="text-center" to="/feed">
        <v-img width="60" src="/img/feed/feed_sm.png" srcset="/img/feed/feed_sm.webp" alt="tablet with artist republik logo" loading="lazy" class="socialtools-image" />
        <h3 class="socialtools-heading">Newsfeed</h3>
        <p class="socialtools-text">Promote your activities and discover what other artists are working on.</p>
      </router-link>
    </v-col>
    <v-col cols="6" sm="3">
      <router-link class="text-center" to="/networking">
        <v-img width="60" src="/img/networking/networking_sm.png" srcset="/img/networking/networking_sm.webp" alt="music notes and chart" loading="lazy" class="socialtools-image" />
        <h3 class="socialtools-heading">Networking</h3>
        <p class="socialtools-text">Connect with fans and other independent artists.</p>
      </router-link>
    </v-col>
    <v-col cols="6" sm="3">
      <router-link class="text-center socialtools-link" to="/feed">
        <v-btn
          fab
          dark
          large
          color="#775aa7"
          elevation="0"
          class="socialtools-btn"
        >
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
        <h3 class="socialtools-heading">Explore Social Tools</h3>
        <p class="socialtools-text">There is more to explore...</p>
      </router-link>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'MarketingSuggestions',
  data () {
    return {
      routeName: this.$route.name
    }
  }
}
</script>
<style>
.socialtools-image {
  margin: 0 auto;
}

.socialtools-heading {
  font-family: "Montserrat", sans-serif;
  font-size: 0.65rem;
  color: #121d3b;
}

.socialtools-text {
  text-transform: uppercase;
  font-size: 0.55rem;
  color: #121d3b;
}

.socialtools-link {
  display: block;
}

.socialtools-btn {
  margin: 5px auto;
}
</style>
