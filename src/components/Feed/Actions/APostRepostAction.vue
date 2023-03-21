<template>
  <div>
    <v-menu v-if="!reposted">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" class="text-center">
          <v-icon>mdi-share-outline</v-icon>
          <span>{{ post.reposts_count }}</span>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click.prevent="repostOrUnrepost">Repost</v-list-item>
        <v-list-item @click.prevent="showModal(post.id)">Repost with comment</v-list-item>
      </v-list>
    </v-menu>
    <v-btn
      text
      block
      v-else
      @click.prevent="repostOrUnrepost"
      class="text-center"
    >
      <v-icon>
        mdi-share
      </v-icon>
      <span>{{ post.reposts_count }}</span>
    </v-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'APostRepostAction',
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
  },
  methods: {
    ...mapActions({
      repostPost: 'reposts/repostPost',
      unrepostPost: 'reposts/unrepostPost',
      showModal: 'feedModals/showRepostModal'
    }),
    repostOrUnrepost () {
      if (this.reposted) {
        this.unrepostPost(this.post)
        return
      }
      this.repostPost(this.post)
    }
  }
}
</script>

<style scoped>

</style>
