<template>
  <v-container fluid class="ma-0 pa-0">
    <v-divider class="ma-0 px-0 py-4" />
    <a-comment v-for="(comment) in comments" :comment="comment" :key="comment.id" />
    <v-divider class="ma-0 pa-0" />
  </v-container>
</template>

<script>
import AComment from '@/components/Feed/AComment'

export default {
  name: 'ACommentGroup',
  components: {
    AComment
  },
  props: {
    comments: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
