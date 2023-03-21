<template>
  <v-row class="py-8">
    <v-col cols="6" sm="3">
      <router-link class="text-center" to="/tools/curator-hub">
        <v-img width="60" src="/img/curator/curator_sm.png" srcset="/img/curator/curator_sm.webp" alt="disc in sleeve" loading="lazy" class="marketing-suggestion-image" />
        <h3 class="marketing-suggestion-heading">Playlisting</h3>
        <p class="marketing-suggestion-text">#1 Playlisting tool in the industry with 500+ lists.</p>
      </router-link>
    </v-col>
    <v-col cols="6" sm="3">
      <router-link class="text-center" to="/features/grow">
        <v-img
          width="60" src="/img/dashboard/getstarted/gwu_header_image_sm.png" srcset="/img/dashboard/getstarted/gwu_header_image_sm.webp" alt="music notes and chart" loading="lazy"
          class="marketing-suggestion-image"
        />
        <h3 class="marketing-suggestion-heading">Grow With Us</h3>
        <p class="marketing-suggestion-text">The most powerful tool to grow followers.</p>
      </router-link>
    </v-col>
    <v-col cols="6" sm="3">
      <router-link class="text-center" to="/features/blog-promotion-order">
        <v-img width="60" src="/img/blog-promotion/blog-promotion_sm.png" srcset="/img/blog-promotion/blog-promotion_sm.webp" alt="blog" loading="lazy" class="marketing-suggestion-image" />
        <h3 class="marketing-suggestion-heading">Blog Promotion</h3>
        <p class="marketing-suggestion-text">Get your release featured in blogs across the world.</p>
      </router-link>
    </v-col>
    <v-col cols="6" sm="3">
      <router-link class="text-center marketing-suggestion-link" to="/marketing-hub">
        <v-btn
          fab
          dark
          large
          color="#ee4699"
          elevation="0"
          class="marketing-suggestion-btn"
        >
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
        <h3 class="marketing-suggestion-heading">See More Marketing Tools</h3>
        <p class="marketing-suggestion-text">There is more to explore...</p>
      </router-link>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'MarketingTools',
  data () {
    return {
      routeName: this.$route.name
    }
  }
}
</script>
<style>
.marketing-suggestion-image {
  margin: 0 auto;
}

.marketing-suggestion-heading {
  font-family: "Montserrat", sans-serif;
  font-size: 0.65rem;
  color: #121d3b;
}

.marketing-suggestion-text {
  text-transform: uppercase;
  font-size: 0.55rem;
  color: #121d3b;
}

.marketing-suggestion-link {
  display: block;
}

.marketing-suggestion-btn {
  margin: 5px auto;
}
</style>
