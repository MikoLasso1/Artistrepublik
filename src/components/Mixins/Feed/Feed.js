import APost from '@/components/Feed/APost'
import APostCompose from '@/components/Feed/Compose/APostCompose'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    APostCompose,
    APost
  },
  props: {
    username: {
      type: String,
      required: false,
      default: null
    },
    hashtag: {
      type: String,
      required: false,
      default: null
    }
  },
  data: () => ({
    params: {},
    limit: 0
  }),
  computed: {
    ...mapGetters({
      posts: 'feed/posts',
      meta: 'feed/meta',
      user: 'feed/feedUser'
    })
  },
  methods: {
    ...mapActions({
      fetchFeed: 'feed/fetchFeed'
    }),
    handleScrolledToBottomOfFeed (isVisible) {
      if (!isVisible) {
        return
      }
      if (this.meta.last_page === this.meta.current_page) {
        return
      }
      const getParams = this.params
      getParams.page = this.meta.current_page + 1
      this.fetchFeed(getParams)
    }
  },
  mounted () {
    if (this.username !== null) {
      this.params.username = this.username
    }
    if (this.hashtag !== null) {
      this.params.tag = this.hashtag
    }
    this.fetchFeed(this.params)
  },
  watch: {
    $route: function () {
      this.params = {}
      if (this.username !== null) {
        this.params.username = this.username
      }
      if (this.hashtag !== null) {
        this.params.tag = this.hashtag
      }
      this.fetchFeed(this.params)
    }
  }
}
