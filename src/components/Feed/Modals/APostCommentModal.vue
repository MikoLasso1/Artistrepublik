<template>
  <v-card tile>
    <component
      v-if="post"
      :is="`a-post-variant-${post.type}`"
      class=""
      :post="post"
    />
    <a-post-compose
      v-if="post"
      :post="post"
      post-type="comment"
      @success="closeModal"
    />
  </v-card>
</template>

<script>
import APostCompose from '@/components/Feed/Compose/APostCompose'
import APostVariantPost from '@/components/Feed/Variants/APostVariantPost'
import APostVariantQuote from '@/components/Feed/Variants/APostVariantQuote'
import APostVariantRepost from '@/components/Feed/Variants/APostVariantRepost'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'APostCommentModal',
  components: {
    APostCompose,
    APostVariantRepost,
    APostVariantQuote,
    APostVariantPost
  },
  computed: {
    ...mapGetters({
      post: 'feedModals/modalPost',
      showModal: 'feedModals/commentModal'
    })
  },
  methods: {
    ...mapActions({
      closeModal: 'feedModals/hideCommentModal'
    })
  }
}
</script>

<style scoped>

</style>
