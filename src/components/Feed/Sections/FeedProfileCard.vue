<template>
  <v-card
    class="justify-content-center mb-2"
    tile
  >
    <v-card-title class="justify-content-center mb-2">
      <div>
        <v-avatar
          size="110"
        >
          <img
            :src="feedUser.profile_photo"
            alt="user image"
            loading="lazy"
          >
        </v-avatar>
      </div>
    </v-card-title>
    <v-card-text class="p-0 pb-2">
      <h2 class="text-center display-1 font-weight-500 h5">
        {{ feedUser.username }}
      </h2>
    </v-card-text>
    <v-divider class="ma-0 m-1" />
    <v-card-text>
      <h2 class=" h3 text-center">
        Followers
      </h2>
      <h3 class="text-center h1 headline font-weight-lighter">
        {{ feedUser.followers_count }}
      </h3>
    </v-card-text>
    <v-divider class="ma-0 m-1" />
    <v-card-text>
      <h2 class=" h1text-center">
        Following
      </h2>
      <h2 class="text-center h1 headline font-weight-lighter">
        {{ feedUser.following_count }}
      </h2>
    </v-card-text>
    <v-divider class="ma-0 pa-0" />
    <v-card-text class="text-center">
      <router-link :to="{ name: 'profile', params: { username: feedUser.username} }">
        View Profile
      </router-link>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'FeedProfileCard',
  computed: {
    ...mapGetters({
      feedUser: 'feed/feedUser'
    })
  }

}
</script>
