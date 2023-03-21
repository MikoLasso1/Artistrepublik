export default {
  data: () => ({
    userId: null
  }),
  mounted () {
    this.userId = this.user.id
    window.Echo.channel('posts')
      .listen('.PostLikesWereUpdated', (e) => {
        if (e.user_id === this.userId) {
          this.$store.dispatch('likes/syncLike', e.id)
        }
        this.$store.commit('feed/SET_LIKES', e)
        this.$store.commit('notifications/SET_LIKES', e)
      })
      .listen('.PostRepostsWereUpdated', (e) => {
        if (e.user_id === this.userId) {
          this.$store.dispatch('reposts/syncRepost', e.id)
        }
        this.$store.commit('feed/SET_REPOSTS', e)
        this.$store.commit('notifications/SET_REPOSTS', e)
      })
      .listen('.PostCommentsWereUpdated', (e) => {
        this.$store.commit('feed/SET_COMMENTS', e)
        this.$store.commit('notifications/SET_COMMENTS', e)
      })
      .listen('.PostWasDeleted', (e) => {
        this.$store.commit('feed/POP_POST', e.id)
      })
    window.Echo.private(`user.${this.userId}`)
      .listen('App\\Notifications\\Messages\\MessageCreatedNotification', (e) => {
        console.log(e)
      })
      .listen('App\\Notifications\\Feed\\PostLiked', (e) => {
        console.log(e)
      })
  },
  beforeDestroy () {
    window.Echo.leave('posts')
    window.Echo.leave(`user.${this.userId}`)
  }
}
