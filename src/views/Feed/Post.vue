<template>
  <div class="h-100">
    <header class="header">
      <picture>
        <source
          media="(max-width: 1199px)"
          srcset="/img/feed/header_sm.webp 1x,
                        /img/feed/header_sm.webp 2x,
                        /img/feed/header_sm.webp 3x"
          type="image/webp"
        >
        <source
          media="(max-width: 1199px)"
          srcset="/img/feed/header_sm.png 1x,
                        /img/feed/header_sm.png 2x,
                        /img/feed/header_sm.png 3x"
          type="image/png"
        >
        <source
          media="(min-width: 1200px)"
          srcset="/img/feed/header_sm.webp 532w,
                        /img/feed/header_md.webp 1600w,
                        /img/feed/header.webp 2460w"
          type="image/webp" sizes="100vw"
        >
        <source
          media="(min-width: 1200px)"
          srcset="/img/feed/header_sm.png 532w,
                        /img/feed/header_md.png 1600w,
                        /img/feed/header.png 2460w"
          type="image/png" sizes="100vw"
        >
        <img src="/img/feed/header.png" class="w-100 h-auto" alt="Feed" loading="lazy">
      </picture>
    </header>
    <v-container
      fluid
      class="h-100"
    >
      <v-row class="d-flex align-stretch">
        <v-col
          cols="4"
          class="px-3"
        >
          <feed-profile-card
            v-if="post !== undefined"
            :user="post.user"
            :comments="comments"
          />
        </v-col>
        <v-col
          cols="8"
          class="px-3"
        >
          <a-post
            v-if="post.type === 0"
            :post="post"
            :comments="comments"
          >
            <template v-slot:comments>
              <a-single-comment
                v-for="comment in comments"
                :key="comment.id"
                :post="comment"
              />
            </template>
          </a-post>
          <a-comment
            v-if="post.type === 1"
            :post="post"
            :comments="comments"
          >
            <template v-slot:comments>
              <a-single-comment
                v-for="comment in comments"
                :key="comment.id"
                :post="comment"
              />
            </template>
          </a-comment>
          <a-repost
            v-if="post.type === 2"
            :post="post"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import FeedProfileCard from '@/components/Feed/FeedProfileCard'
import AComment from '@/components/Feed/Variants/AComment'
import APost from '@/components/Feed/Variants/APost'
import ARepost from '@/components/Feed/Variants/ARepost'
import ASingleComment from '@/components/Feed/ASingleComment'
import { mapGetters } from 'vuex'

export default {
  name: 'Post',
  components: {
    FeedProfileCard,
    APost,
    AComment,
    ARepost,
    ASingleComment
  },
  data: () => ({
    loading: true
  }),
  computed: {
    ...mapGetters({
      post: 'post',
      comments: 'postComments'
    })
  },
  watch: {
    '$route': 'fetchData'
  },
  created () {
    this.fetchData()
  },
  methods: {
    getPost (id) {
      Promise.all([
        this.$store.dispatch('fetchPost', id)
      ])
        .then(() => {
          this.loading = false
        })
    },
    fetchData () {
      this.loading = true
      this.getPost(this.$route.params.id)
    }
  }
}
</script>

<style scoped>

</style>
