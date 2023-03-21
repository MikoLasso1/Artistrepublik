<template>
  <div>
    <a-post-body :post="post" />
    <v-divider class="ma-0 pa-0" />
    <a-comment :comment="post.original_post" />
    <!--
    <a-user-header-comment :post="post.original_post" />
    <component
        :is="`a-post-variant-${post.original_post.type}`"
        :post="post.original_post"
        :comments="false"
    />-->
  </div>
</template>

<script>
export default {
  name: 'APostVariantQuote',
  components: {
    APostBody: () => (import('@/components/Feed/APostBody')),
    AComment: () => (import('@/components/Feed/AComment'))
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
