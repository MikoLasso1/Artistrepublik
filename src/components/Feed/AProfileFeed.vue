<template>
  <v-row align="stretch">
    <v-col v-for="(post, index) in visiblePosts" :key="index" :cols="(12 / cols)" class="d-flex flex-column my-4">
      <v-card class="d-flex flex-column flex">
        <a-user-header-post :post="post" />
        <a-post-variant-post :post="post" :comments="false" />
      </v-card>
    </v-col>
    <v-col :cols="(12 / cols)" v-if="visiblePosts.length > 0" class="d-flex flex-column my-4">
      <v-card class="d-flex flex-column flex">
        <v-card-text class="text-center align-content-center justify-content-center d-flex flex">
          <v-btn
            color="primary"
            class="align-self-center"
            @click.prevent="loadMorePosts"
          >{{ loadMoreButtonText }}
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Feed from '@/components/Mixins/Feed/Feed'
import AUserHeaderPost from '@/components/Feed/Headers/AUserHeaderPost'
import APostVariantPost from '@/components/Feed/Variants/APostVariantPost'

export default {
  name: 'AProfileFeed',
  components: {
    AUserHeaderPost,
    APostVariantPost
  },
  mixins: [Feed],
  data: () => ({
    cols: 3,
    postsShown: 5,
    loadMoreButtonText: ''
  }),
  computed: {
    visiblePosts () {
      return (this.posts.slice(0, this.postsShown) || [])
    }
  },
  methods: {
    loadMorePosts () {
      if (this.postsShown === 11 || this.postsShown.length === this.posts.length) {
        this.$router.push({ name: 'userFeed', params: { username: this.username } })
      }
      this.postsShown = 11
      this.loadMoreButtonText = `Visit ${this.username}'s Feed`
    }
  },
  mounted () {
    if (this.$vuetify.breakpoint.smAndDown) {
      this.cols = 2
    }
  },
  beforeMount () {
    this.limit = 5
    this.loadMoreButtonText = `Load more ${this.username} Posts`
  }
}
</script>

<style scoped>

</style>
