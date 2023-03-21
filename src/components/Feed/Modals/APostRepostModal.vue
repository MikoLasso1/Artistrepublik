<template>
  <v-card>
    <div class="pa-4">
      Repost with comment
    </div>
    <a-user-header-post :post="post" />
    <component
      v-if="post"
      :is="`a-post-variant-${post.type}`"
      class=""
      :comments="false"
      :post="post"
    />
    <a-post-compose
      v-if="post"
      :post="post"
      :allow-media="false"
      postType="repost"
      @success="closeModal"
    />
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'APostRepostModal',
  components: {
    APostCompose: () => (import('@/components/Feed/Compose/APostCompose')),
    APostVariantPost: () => (import('@/components/Feed/Variants/APostVariantPost')),
    APostVariantQuote: () => (import('@/components/Feed/Variants/APostVariantQuote')),
    APostVariantRepost: () => (import('@/components/Feed/Variants/APostVariantRepost')),
    AUserHeaderPost: () => (import('@/components/Feed/Headers/AUserHeaderPost'))
  },
  computed: {
    ...mapGetters({
      post: 'feedModals/modalPost',
      showModal: 'feedModals/repostModal'
    })
  },
  methods: {
    ...mapActions({
      closeModal: 'feedModals/hideRepostModal'
    })
  }
}
</script>

<style scoped>

</style>
