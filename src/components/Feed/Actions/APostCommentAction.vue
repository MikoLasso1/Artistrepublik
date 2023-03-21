<template>
  <v-btn
    text
    block
    @click.prevent="setModal(post.id)"
    class="mr-2"
  >
    <v-icon>mdi-comment-text-outline</v-icon>
    <span>{{ post.comments_count }}</span>
  </v-btn>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'APostCommentAction',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions({
      setModal: 'feedModals/showCommentModal'
    })
  }
}
</script>

<style scoped>

</style>
