<template>
  <div>
    <v-divider class="ma-0 pa-0" />
    <v-card-actions>
      <v-row>
        <v-col class="text-center">
          <a-post-comment-action
            :post="post"
          />
        </v-col>
        <v-col
          v-if="post.type === 'post'"
          class="text-center"
        >
          <a-post-repost-action
            :post="post"
          />
        </v-col>
        <v-col class="text-center">
          <a-post-like-action
            :post="post"
          />
        </v-col>
      </v-row>
    </v-card-actions>
  </div>
</template>

<script>
import APostLikeAction from '@/components/Feed/Actions/APostLikeAction'
import APostRepostAction from '@/components/Feed/Actions/APostRepostAction'
import APostCommentAction from '@/components/Feed/Actions/APostCommentAction'

export default {
  components: {
    APostCommentAction, APostRepostAction, APostLikeAction
  },
  props: {
    post: {
      required: true,
      type: Object
    }
  }
}
</script>
