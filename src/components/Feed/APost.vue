<template>
  <v-card class="mb-4">
    <component
      :is="`a-user-header-${post.type}`"
      :post="post"
    />
    <v-divider class="ma-0 pa-0" />
    <component
      :is="`a-post-variant-${post.type}`"
      :post="post"
    />
  </v-card>
</template>

<script>
export default {
  components: {
    APostVariantPost: () => (import('@/components/Feed/Variants/APostVariantPost')),
    APostVariantQuote: () => (import('@/components/Feed/Variants/APostVariantRepost')),
    APostVariantRepost: () => (import('@/components/Feed/Variants/APostVariantQuote')),
    AUserHeaderComment: () => (import('@/components/Feed/Headers/AUserHeaderComment')),
    AUserHeaderPost: () => (import('@/components/Feed/Headers/AUserHeaderPost')),
    AUserHeaderQuote: () => (import('@/components/Feed/Headers/AUserHeaderQuote')),
    AUserHeaderRepost: () => (import('@/components/Feed/Headers/AUserHeaderRepost'))
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
.border-b {
  border-bottom: 1px solid #0c001e;
}
</style>
