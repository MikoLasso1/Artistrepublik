<template>
  <v-row class="py-8">
    <v-col cols="6" sm="3">
      <router-link class="text-center" to="/merch-dashboard">
        <v-icon
          x-large
          color="#d3d3d3"
          size="100"
          class="coming-soon-icon"
        >
          mdi-label
        </v-icon>
        <h3 class="showtools-heading">Custom Stickers</h3>
        <p class="showtools-text">*Coming Soon</p>
      </router-link>
    </v-col>
    <v-col cols="6" sm="3">
      <router-link class="text-center" to="/dashboard">
        <v-icon
          x-large
          color="#d3d3d3"
          size="100"
          class="coming-soon-icon"
        >
          mdi-ticket
        </v-icon>
        <h3 class="showtools-heading">Ticketing</h3>
        <p class="showtools-text">*Coming soon</p>
      </router-link>
    </v-col>
    <v-col cols="6" sm="3">
      <router-link class="text-center" to="/dashboard">
        <v-icon
          x-large
          color="#d3d3d3"
          size="100"
          class="coming-soon-icon"
        >
          mdi-star
        </v-icon>
        <h3 class="showtools-heading">Shows</h3>
        <p class="showtools-text">*Coming soon</p>
      </router-link>
    </v-col>
    <v-col cols="6" sm="3" class="text-center">
      <v-btn
        fab
        dark
        large
        color="#d3d3d3"
        elevation="0"
        class="showtools-btn"
      >
        <v-icon dark>
          mdi-circle
        </v-icon>
      </v-btn>
      <h3 class="showtools-heading">Show Tools Coming Soon!</h3>
      <p class="showtools-text">There is more on the way...</p>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'ShowTools',
  data () {
    return {
      routeName: this.$route.name
    }
  }
}
</script>
<style>
.showtools-image {
  margin: 0 auto;
}

.showtools-heading {
  font-family: "Montserrat", sans-serif;
  font-size: 0.65rem;
  color: #121d3b;
}

.showtools-text {
  text-transform: uppercase;
  font-size: 0.55rem;
  color: #121d3b;
}

.showtools-link {
  display: block;
}

.coming-soon-icon {
  margin: 0 auto;
  display: block !important;
  font-size: 68px !important;
}

.showtools-btn {
  margin: 5px auto;
}
</style>
