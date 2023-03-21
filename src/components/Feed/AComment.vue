<template>
  <div class="d-flex flex-row">
    <div class="flex-shrink-1 px-4">
      <v-avatar>
        <v-img :src="comment.user.profile_photo" :alt="comment.user.username" loading="lazy" />
      </v-avatar>
    </div>
    <div class="flex-grow-1 px-4">
      <router-link :to="{ name: 'profile', params: { username: comment.user.username } }">
        <a-post-username :user="comment.user" />
      </router-link>
      <a-follow-button :user="comment.user" class="mx-4" />
      <a-post-variant-post :post="comment" :comments="false" />
    </div>
  </div>
</template>

<script>
import APostUsername from '@/components/Feed/APostUsername'
import AFollowButton from '@/components/Feed/Actions/AFollowButton'

export default {
  name: 'AComment',
  components: {
    APostUsername, APostVariantPost: () => import ('@/components/Feed/Variants/APostVariantPost'), AFollowButton
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
