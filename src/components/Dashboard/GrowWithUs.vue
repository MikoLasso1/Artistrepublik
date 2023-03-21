<template>
  <v-card class="growwithus-card card">
    <v-card-title>
      <h2 class="growwithus-heading">Grow With Us</h2>
    </v-card-title>
    <v-card-subtitle>
      Grow Fan Base and Followers
    </v-card-subtitle>
    <v-card-actions class="growwithus-card-action">
      <v-row class="p-3 align-items-center">
        <v-col cols="12" sm="3" class="text-center">
          <v-img
            src="/img/gwu/widget/spotify.png"
            max-height="103"
            alt="spotify"
            contain
            loading="lazy"
          ></v-img>
        </v-col>
        <v-col cols="12" sm="6" class="text-center">
          <v-sparkline
            :value="value"
            :gradient="gradient"
            :smooth="radius || false"
            :padding="padding"
            :line-width="width"
            :stroke-linecap="lineCap"
            :gradient-direction="gradientDirection"
            :fill="fill"
            :type="type"
            :auto-line-width="autoLineWidth"
            auto-draw
            color="#0f1d3a"
          >
            <template v-slot:label="item">
              {{ item.value }}K
            </template>
          </v-sparkline>
        </v-col>
        <v-col cols="12" sm="3" class="text-center">
          <v-img
            src="/img/gwu/widget/soundcloud.png"
            max-height="103"
            contain
            alt="soundcloud"
            loading="lazy"
          ></v-img>
        </v-col>
      </v-row>
    </v-card-actions>
    <v-card-text class="text-center">
      <h3 class="growwithus-description-heading">Grow Your Fans on Spotify and SoundCloud!</h3>
      <p class="growwithus-description">Trusted by over 30,000 artists for reliable follower growth.</p>
      <router-link to="/features/grow">
        <v-btn
          color="success"
          :bottom="true"
          dark
        >
          Try Now for only $5
        </v-btn>
      </router-link>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    width: 2,
    radius: 10,
    padding: 8,
    lineCap: 'round',
    gradient: ['#f72047', '#ffd200', '#1feaea'],
    value: [1, 2, 9, 13, 20, 31, 40],
    gradientDirection: 'top',
    fill: true,
    type: 'trend',
    autoLineWidth: false
  })
}
</script>
<style scoped>
.growwithus-card {
  height: 100%;
  justify-content: space-between;
}

.growwithus-heading {
  margin: 0;
}

.growwithus-description-heading {
  font-family: "Montserrat-SemiBold", sans-serif;
  font-size: 1.25rem;
}

.growwithus-description {
  text-transform: uppercase;
  font-family: "Montserrat-Light", sans-serif;
  font-size: 0.9rem;
}

.growwithus-card-actions {
  min-height: 123px;
}
</style>
