<template>
  <div class="darken-3">
    <v-row justify="center">
      <v-col cols="10" class="text-right">
        <v-img alt="Artist Republik Logo" src="/img/brand/logo_dark_part.png" width="25" class="d-inline-block" />
      </v-col>
    </v-row>
    <v-row class="my-3 justify-center">
      <v-col cols="3" class="py-2">
        <v-avatar class="rounded-circle">
          <v-img :alt="profile.username" :src="profile.profile_photo" />
        </v-avatar>
      </v-col>
      <v-col cols="8" class="py-2 miniprofile-stats-section">
        <v-row class="pt-3 no-gutters">
          <v-col cols="4" class="miniprofile-stats-container">
            <h2 class="miniprofile-stats-number mb-0">{{ profile.repPoints }}</h2>
            <p class="miniprofile-stats-text">Rep</p>
          </v-col>
          <v-col cols="4" class="miniprofile-stats-container">
            <h2 class="miniprofile-stats-number mb-0">{{ profile.tracks }}</h2>
            <p class="miniprofile-stats-text">Songs</p>
          </v-col>
          <v-col cols="4" class="miniprofile-stats-container">
            <h2 class="miniprofile-stats-number mb-0">{{ profile.shows }}</h2>
            <p class="miniprofile-stats-text">Shows</p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'PremiumHeader',
  props: {
    profile: {
      default: null,
      type: Object
    }
  },
  data () {
    return {}
  }
}
</script>
<style scoped>
.miniprofile-stats-section {
  border: 1px solid #f7b7d3;
}

.miniprofile-stats-number,
.miniprofile-stats-text {
  color: #000;
}

.miniprofile-stats-number {
  font-size: 1rem;
}

.miniprofile-stats-text {
  font-size: .9rem;
  margin: 0;
}

.rounded-circle {
  height: 60px !important;
  min-width: 60px !important;
  width: 60px !important;
}
</style>
