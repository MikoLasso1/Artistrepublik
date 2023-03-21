<template>
  <div :class="{'dark-header': dark}" class="text-center">
    <v-avatar class="user-profile-image rounded-circle">
      <img :src="profile.profile_photo" alt="profile photo" loading="lazy" />
    </v-avatar>
    <h3 class="mt-4 mb-0">{{ profile.artist_name }}</h3>
    <p class="text--secondary mb-6">
      <v-icon v-if="profile.city || profile.country">mdi-map-marker</v-icon>
      <span v-if="profile.city">{{ profile.city }}</span>
      <span v-if="profile.city && profile.country">, </span>
      <span v-if="profile.country">{{ profile.country }}</span>
    </p>
    <v-row justify="center">
      <v-col md="4" sm="4" xl="4" class="text-center">
        <h3 class="mb-0">{{ profile.repPoints }}</h3>
        <p class="mb-0">Rep Points</p>
      </v-col>
      <v-col md="4" sm="4" xl="4" class="text-center">
        <h3 class="mb-0">{{ profile.tracks }}</h3>
        <p class="mb-0">Songs</p>
      </v-col>
      <v-col md="4" sm="4" xl="4" class="text-center">
        <h3 class="mb-0">{{ profile.shows }}</h3>
        <p class="mb-0">Shows</p>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'DefaultHeader',
  props: {
    profile: {
      default: null,
      type: Object
    },
    dark: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {}
  }
}
</script>
<style scoped>
span, div, p {
  font-size: 16px;
}

.dark-header h3,
.dark-header p,
.dark-header span,
.dark-header .v-icon {
  color: white;
}

@media (max-width: 600px) {
  .top-padding {
    padding-top: 5rem !important;
  }

  .header {
    height: 150px;
  }

  .user-profile-image {
    margin-top: -70px;
    height: 125px !important;
    min-width: 125px !important;
    width: 125px !important;
  }

  .card-parent {
    margin-top: -64px;
  }
}

@media (min-width: 600px) {
  .header {
    height: 269px;
  }

  .user-profile-image {
    margin-top: -130px;
    height: 200px !important;
    min-width: 200px !important;
    width: 200px !important;
  }

  .card-parent {
    margin-top: -105px !important;
  }
}
</style>
