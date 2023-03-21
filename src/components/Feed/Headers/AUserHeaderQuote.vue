<template>
  <div class="d-flex flex-row">
    <div class="flex-shrink-1 pa-4">
      <v-avatar v-if="post.user.profile_photo.length > 0">
        <v-img :src="post.user.profile_photo" :alt="post.user.username || 'user'" loading="lazy" />
      </v-avatar>
    </div>
    <div class="flex-grow-1 pa-4">
      <router-link :to="{ name: 'useProfile', params: { username: post.user.username } }">
        <span v-if="post" class="font-weight-bold">
        {{ post.user.name }}
          <span class="font-weight-normal">
            @{{ post.user.username }}
          </span>
        </span>
      </router-link>
      shared and commented on a post
    </div>
  </div>
</template>

<script>

export default {
  name: 'AUserHeaderQuote',
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
