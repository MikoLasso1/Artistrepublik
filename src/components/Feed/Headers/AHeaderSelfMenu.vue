<template>
  <div>
    <v-menu
      bottom
      left
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>
      <v-list class="py-0">
        <v-list-item @click="deletePost(post.id)">
          <v-list-item-title>Delete Post</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'AHeaderSelfMenu',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions({
      deletePost: 'feed/deletePost'
    })
  }
}
</script>

<style scoped>

</style>
