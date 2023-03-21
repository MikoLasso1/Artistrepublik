<template>
  <v-card tile class="mb-4">
    <v-divider class="ma-0 pa-0" />
    <form class="flex" @submit.prevent="submit">
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="form.body"
              :placeholder="placeholderText"
              rows="3"
              solo
              autofocus
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <a-post-image-preview
              :images="media.images"
              v-if="media.images.length"
              @removed="removeImage"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <a-post-video-preview
              :video="media.video"
              v-if="media.video"
              @removed="removeVideo"
            />
          </v-col>
        </v-row>
        <v-row class="d-flex flex-">
          <v-col class="text-center" v-if="allowMedia">
            <a-post-compose-media-button
              id="media-compose"
              @selected="handleMediaSelected"
            />
          </v-col>
          <v-col class="text-center">
            <v-progress-circular
              :value="(form.body.length / 200)"
            />
          </v-col>
          <v-col class="text-center">
            <v-btn
              block
              type="submit"
              class="primary"
            >
              Post
            </v-btn>
          </v-col>
        </v-row>
        <v-row align-content="center" justify="center">

        </v-row>
        <v-row>
          <v-col cols="12">
            <a-post-media-progress class="mb-4" :progress="media.progress" v-if="media.progress" />
            <div class="flex align-content-center justify-end">

            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </form>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import APostVideoPreview from './Media/APostVideoPreview'
import PostCompose from '../../Mixins/Feed/PostCompose'
import APostMediaProgress from '@/components/Feed/Compose/Media/APostMediaProgress'
import APostImagePreview from '@/components/Feed/Compose/Media/APostImagePreview'

export default {
  name: 'APostCompose',
  components: {
    APostVideoPreview,
    APostMediaProgress,
    APostImagePreview,
    APostComposeMediaButton: () => (import('@/components/Feed/Compose/Media/APostComposeMediaButton'))
  },
  mixins: [
    PostCompose
  ],
  props: {
    post: {
      type: Object,
      required: false
    },
    postType: {
      type: String,
      default: 'post'
    },
    allowMedia: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters({
      user: 'getUser'
    }),
    placeholderText () {
      switch (this.postType) {
        case 'post':
          return 'What\'s new?'
        case 'comment':
          return `Comment on ${this.user.username}'s post`
        case 'repost':
          return 'Something to add?'
        default:
          return ''
      }
    }
  },
  methods: {
    ...mapActions({
      commentOnPost: 'feed/commentOnPost',
      quotePost: 'feed/quotePost'
    }),
    async submitPost () {
      switch (this.postType) {
        case 'post':
          await this.$http.post('v1/feed/posts', this.form)
            .then((response) => {
              this.$store.commit('feed/PUSH_POSTS', [response.data.data])
            })

          break
        case 'comment':
          await this.commentOnPost({
            post: this.post,
            data: this.form
          })
          this.$emit('success')
          break
        case 'repost':
          await this.quotePost({
            post: this.post,
            data: this.form
          })
          this.$emit('success')
          break
      }
    }
  }
}
</script>

<style scoped>

</style>
