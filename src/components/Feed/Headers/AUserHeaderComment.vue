<template>
  <v-card-title class="py-2">
    <v-list-item class="grow">
      <v-list-item-avatar v-if="post.user.profile_photo.length > 0">
        <v-img :src="post.user.profile_photo" :alt="post.user.username || 'user'" loading="lazy" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          <span v-if="post" class="font-weight-bold">
            <router-link :to="{ name: 'profile', params: { username: post.user.username } }">
              <span v-if="post" class="font-weight-bold">
                {{ post.user.name }}
                <span class="font-weight-normal">
                  @{{ post.user.username }}
                </span>
              </span>
            </router-link>
            <span v-if="post.type === 'repost'"> Reposted</span>
            <v-spacer />
          </span>
          <a-follow-button :user="post.user" />
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-card-title>
</template>

<script>
import AFollowButton from '@/components/Feed/Actions/AFollowButton'

export default {
  name: 'AUserHeaderComment',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  components: {
    AFollowButton
  }
}
</script>

<style scoped>

</style>
