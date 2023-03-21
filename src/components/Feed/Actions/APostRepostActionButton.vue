<template>
  <v-btn icon>
    <v-icon>mdi-share-outline</v-icon>
    <span>{{ post.reposts_count }}</span>
  </v-btn>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'APostRepostActionButton',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      reposts: 'reposts/reposts'
    }),
    reposted () {
      return this.reposts.includes(this.post.id)
    }
  }
}
</script>

<style scoped>

</style>
