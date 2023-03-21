import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      following: 'followers/getFollowing'
    })
  },
  methods: {
    ...mapActions({
      follow: 'followers/followUser',
      unfollow: 'followers/unfollowUser'
    })
  }
}
