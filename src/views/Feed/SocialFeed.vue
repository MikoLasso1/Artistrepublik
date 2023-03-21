<template>
  <feed-layout>
    <a-feed :username="username" :hashtag="$route.params.hashtag" />
  </feed-layout>
</template>

<script>
import FeedLayout from '@/layout/FeedLayout'
import AFeed from '@/components/Feed/AFeed'
import { mapGetters } from 'vuex'

export default {
  name: 'SocialFeed',
  components: {
    FeedLayout,
    AFeed
  },
  props: {
    username: {
      type: String,
      required: false
    },
    hashtag: {
      type: String,
      required: false
    }
  },
  data: () => ({
    requestParams: {}
  }),
  computed: {
    ...mapGetters({
      posts: 'feed/posts',
      topPosts: 'feed/topPosts'
    })
  }
}
</script>

<style scoped>
.card-border--top {
  border-top: 3px solid #5e72e4;
}
</style>
