<template>
  <v-card>
    <v-card-title>
      Nearby Users
    </v-card-title>
    <v-divider class="ma-0 pa-0" />
    <v-card-text v-if="user.location_id === null">
      You have not set your location. Please visit the
      <router-link :to="{ name: 'settings' }">Settings</router-link>
      page to see nearby users.
    </v-card-text>
    <v-card-text class="justify-center" v-else-if="nearby.length === 0">
      <h2>Sorry, there are no users near you</h2>
    </v-card-text>
    <v-list class="pa-0" v-else>
      <template v-for="(item, index) in nearby">
        <v-list-item class="d-flex align-center" :key="item.uuid" @click="$router.push(`${item.username}`)">
          <v-list-item-avatar>
            <v-img :src="item.profile.profile_photo" :alt="item.username" loading="lazy" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.username }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <h3>Rep: {{ item.rep_points }}</h3>
            </v-list-item-subtitle>
          </v-list-item-content>
          <a-follow-button :user="item" />
        </v-list-item>
        <v-divider class="ma-0 pa-0" v-if="index < (nearby.length - 1)" :key="index" />
      </template>
    </v-list>
  </v-card>
</template>

<script>
import AFollowButton from '@/components/Feed/Actions/AFollowButton'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SuggestNearby',
  components: {
    AFollowButton
  },
  computed: {
    ...mapGetters({
      following: 'followers/getFollowing',
      nearby: 'feed/nearby',
      user: 'getUser'
    })
  },
  methods: {
    ...mapActions({
      follow: 'followers/followUser',
      unfollow: 'followers/unfollowUser',
      fetchNearby: 'feed/fetchNearby'
    })
  },
  mounted () {
    this.fetchNearby()
  }
}
</script>

<style scoped>

</style>
