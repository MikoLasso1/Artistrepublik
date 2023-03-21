<template>
  <div class="d-flex flex-row">
    <div class="flex-shrink-1 pa-4">
      <v-avatar v-if="post.user.profile_photo.length > 0">
        <v-img :src="post.user.profile_photo" :alt="post.user.username || 'user'" loading="lazy" />
      </v-avatar>
    </div>
    <div class="flex-grow-1 pa-4">
      <router-link :to="{ name: 'profile', params: { username: post.user.username } }">
        <span v-if="post" class="font-weight-bold">
        {{ post.user.name }}
          <span class="font-weight-normal">
            @{{ post.user.username }}
          </span>
        </span>
      </router-link>
    </div>
    <div class="flex-shrink-1 pr-2 d-flex align-center">
      <a-follow-button v-if="post.user.id !== user.id" :user="post.user" />
      <a-header-self-menu v-else :post="post" />
    </div>
  </div>
</template>

<script>
import AFollowButton from '@/components/Feed/Actions/AFollowButton'
import AHeaderSelfMenu from '@/components/Feed/Headers/AHeaderSelfMenu'
import { mapGetters } from 'vuex'

export default {
  name: 'AUserHeaderPost',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      user: 'getUser'
    })
  },
  components: {
    AFollowButton,
    AHeaderSelfMenu
  }
}
</script>

<style scoped>

</style>
