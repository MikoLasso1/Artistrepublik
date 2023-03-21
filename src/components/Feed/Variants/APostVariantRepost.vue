<template>
  <div>
    <component
      :is="`a-post-variant-${post.original_post.type}`"
      :post="post.original_post"
      :comments="false"
    />
  </div>
</template>

<script>
import APostVariantPost from '@/components/Feed/Variants/APostVariantPost'
import APostVariantQuote from '@/components/Feed/Variants/APostVariantQuote'
import APostVariantRepost from '@/components/Feed/Variants/APostVariantRepost'

export default {
  name: 'APostVariantRepost',
  components: {
    APostVariantRepost, APostVariantQuote, APostVariantPost
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
