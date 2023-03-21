<template>
  <v-container>
    <v-row align="stretch">
      <v-col v-for="(user, index) in nearby" :key="index" :cols="(12 / cols)" class="d-flex flex-column mb-4">
        <v-card class="d-flex flex-column flex">
          <v-card-title class="d-flex justify-center">
            <v-avatar size="80">
              <v-img :src="user.profile.profile_photo" :alt="user.username || 'user'" loading="lazy" />
            </v-avatar>
          </v-card-title>
          <v-card-title class="d-flex justify-center py-0">
            <h2 class="">{{ user.username }}</h2>
          </v-card-title>
          <v-card-text class="d-flex justify-center py-0">
            <p class="ma-0 pa-0">
              REP <span class="font-weight-700 rep">
                {{ user.rep_points }}
              </span>
            </p>
            <p class="ma-0 pa-0">
              {{ user.city }}
            </p>
          </v-card-text>
          <v-card-actions>
            <v-row no-gutters>
              <v-col cols="6">
                <v-btn tile color="primary" width="95%" v-if="!friends.includes(user.id) && !pending.includes(user.id)" @click="addFriend(user.id)">Add Friend</v-btn>
                <v-btn tile color="secondary" width="95%" v-if="pending.includes(user.id)" @click="removeFriend(user.id)">Cancel</v-btn>
                <v-btn tile color="info" width="95%" v-if="friends.includes(user.id)" @click="removeFriend(user.id)">Unfriend</v-btn>
              </v-col>
              <v-col cols="6" class="text-right">
                <v-btn tile color="primary" width="95%" v-if="!following.includes(user.id)" @click="follow(user.id)">Follow</v-btn>
                <v-btn tile color="info" width="95%" v-if="following.includes(user.id)" @click="unfollow(user.id)">Unfollow</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import FollowingMixin from '@/components/Mixins/Follow/FollowingMixin'
import FriendshipMixin from '@/components/Mixins/Friendship/FriendshipMixin'

export default {
  name: 'SuggestNearbyTiles',
  data: () => ({
    cols: 4
  }),
  mixins:
    [
      FollowingMixin,
      FriendshipMixin
    ]
  ,
  computed: {
    ...mapGetters({
      friendIds: 'friendIds',
      pendingFriendIds: 'pendingFriendIds',
      nearby: 'feed/nearby'
    }),
    friends () {
      return Object.values(this.friendIds)
    },
    pending () {
      return Object.values(this.pendingFriendIds)
    }
  },
  methods: {
    ...mapActions({
      fetchNearby: 'feed/fetchNearby'
    })
  },
  mounted () {
    this.fetchNearby()
    if (this.$vuetify.breakpoint.smAndDown) {
      this.cols = 2
    }
  }
}
</script>

<style scoped>

</style>
