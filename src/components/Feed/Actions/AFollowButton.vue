<template>
  <div>
    <slot :isFollowing="isFollowing" :followOrUnfollow="followOrUnfollow">
      <v-btn icon large elevation="1" @click.stop="followOrUnfollow">
        <v-icon :color="isFollowing ? 'primary' : 'secondary'">{{ iconString }}</v-icon>
      </v-btn>
    </slot>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'AFollowButton',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      following: 'followers'
    }),
    isFollowing () {
      return this.following.following.includes(this.user.id)
    },
    iconString () {
      return (this.isFollowing ? 'mdi-account-heart' : 'mdi-account-heart-outline')
    }
  },
  methods: {
    ...mapActions({
      unfollowUser: 'followers/unfollowUser',
      followUser: 'followers/followUser'
    }),
    followOrUnfollow () {
      if (this.isFollowing) {
        this.unfollowUser(this.user.id)
        return
      }
      this.followUser(this.user.id)
    }
  }
}
</script>

<style scoped>

</style>
