<template>
  <form class="flex" @submit.prevent="submitPost">
    <div class="flex-grow-1">
      <a-post-compose-textarea
        v-model="form.body"
        placeholder="Add a comment"
      />
      <div class="flex justify-space-between">
        <ul class="flex align-content-center">

        </ul>
        <div class="flex align-items-center justify-end">
          <div>
            <a-post-compose-limit
              class="mr-2"
              :body="form.body"
            />
          </div>
          <v-btn type="submit">
            Repost
          </v-btn>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import APostComposeTextarea from '@/components/Feed/Compose/APostComposeTextarea'
import APostComposeLimit from '@/components/Feed/Compose/APostComposeLimit'
import Compose from '@/components/Mixins/Feed/PostCompose'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'APostRepostCompose',
  components: {
    APostComposeLimit,
    APostComposeTextarea
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  mixins: {
    Compose
  },
  computed: {
    ...mapGetters({
      user: 'feed/feedUser'
    })
  },
  methods: {
    ...mapActions({
      quotePost: 'feed/quotePost'
    }),

    async submitPost () {
      await this.quotePost({
        post: this.post,
        data: this.form
      })
      this.$emit('success')
    }
  }
}
</script>

<style scoped>

</style>
