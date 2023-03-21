<template>
  <v-btn
    block
    text
    @click.prevent="likeOrUnlike"
    class="mr-2"
  >
    <v-icon v-if="!liked">mdi-thumb-up-outline</v-icon>
    <v-icon v-else>mdi-thumb-up</v-icon>
    <span>{{ post.likes_count }}</span>
  </v-btn>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'APostLikeAction',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      likes: 'likes/likes'
    }),
    liked () {
      return this.likes.includes(this.post.id)
    }
  },
  methods: {
    ...mapActions({
      likePost: 'likes/likePost',
      unlikePost: 'likes/unlikePost'
    }),
    likeOrUnlike () {
      if (this.liked) {
        this.unlikePost(this.post)
        return
      }
      this.likePost(this.post)
    }
  }
}
</script>

<style scoped>

</style>
