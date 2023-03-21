<template>
  <v-card>
    <v-user-header />
    <v-divider class="ma-0 pa-0" />
    <form class="flex" @submit.prevent="submit">
      <div class="flex-grow-1">
        <a-post-compose-textarea
          v-model="form.body"
          placeholder="Post your comment"
        />
        <a-post-media-progress class="mb-4" :progress="media.progress" v-if="media.progress" />
        <a-post-image-preview
          :images="media.images"
          v-if="media.images.length"
          @removed="removeImage"
        />
        <a-post-video-preview
          :video="media.video"
          v-if="media.video"
          @removed="removeVideo"
        />
        <div class="flex justify-space-between">
          <ul class="flex align-content-center">
            <li class="mr-4">
              <a-post-compose-media-button
                id="media-compose-reply"
                @selected="handleMediaSelected"
              />
            </li>
          </ul>
          <div class="flex align-content-center justify-end">
            <div>
              <a-post-compose-limit
                class="mr-2"
                :body="form.body"
              />
            </div>
            <v-btn
              type="submit"
            >
              Reply
            </v-btn>
          </div>
        </div>
      </div>
    </form>
  </v-card>
</template>

<script>
import APostComposeTextarea from './APostComposeTextarea'
import APostMediaProgress from './Media/APostMediaProgress'
import APostImagePreview from './Media/APostImagePreview'
import APostVideoPreview from './Media/APostVideoPreview'
import APostComposeMediaButton from './Media/APostComposeMediaButton'
import APostComposeLimit from './APostComposeLimit'
import PostCompose from '../../Mixins/Feed/PostCompose'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'APostCommentCompose',
  components: {
    APostComposeLimit,
    APostComposeMediaButton, APostVideoPreview, APostImagePreview, APostMediaProgress, APostComposeTextarea
  },
  mixins: [
    PostCompose
  ],
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      user: 'feed/feedUser'
    })
  },
  methods: {
    ...mapActions({
      commentOnPost: 'feed/commentOnPost'
    }),
    async submitPost () {

    }
  }
}
</script>

<style scoped>

</style>
