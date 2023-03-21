<template>
  <div class="d-flex flex-column flex">
    <div class="flex-grow-1">
      <v-carousel v-if="images.length">
        <v-carousel-item
          v-for="(image, i) in images"
          :key="i"
          :src="image.url"
        />
      </v-carousel>
      <video width="100%" v-if="video" :src="video.url" controls></video>
      <a-post-body :post="post" v-if="post.body !== null" />
    </div>
    <a-post-action-group :post="post" />
    <a-comment-group :comments="post.comments.data" v-if="comments && post.comments.data.length > 0" />
  </div>
</template>

<script>
import APostBody from '@/components/Feed/APostBody'
import APostActionGroup from '@/components/Feed/Actions/APostActionGroup'
import ACommentGroup from '@/components/Feed/ACommentGroup'

export default {
  name: 'APostVariantPost',
  components: {
    APostBody, APostActionGroup, ACommentGroup
  },
  props: {
    post: {
      type: Object,
      required: true
    },
    comments: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    images () {
      return this.post.media.data.filter(m => m.type === 'image')
    },
    video () {
      return this.post.media.data.filter(m => m.type === 'video')[0]
    }
  }
}
</script>

<style scoped>
.videoPlayer {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: -1; /* for accessing the video by click */
}
</style>
