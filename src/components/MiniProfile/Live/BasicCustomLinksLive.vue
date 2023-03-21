<template>
  <div>
    <v-row
      v-for="(link, index) in links"
      :key="index"
      class="app-parent bg-default mb-4"
      align="center"
    >
      <v-col xs="2" class="pa-0 pa-sm-3">
        <v-avatar class="rounded-circle">
          <img
            :src="`/img/mini-profile/music-custom.png`"
            :alt="link.title"
            loading="lazy"
          />
        </v-avatar>
      </v-col>
      <v-col xs="7" class="white--text">
        Listen now on
        <span class="text-capitalize">{{ link.title }}</span>
      </v-col>
      <v-col xs="3" class="text-left text-md-center">
        <a :href="link.link" target="_blank" rel="noopener">
          <v-btn class="btn-profile" dark>Listen</v-btn>
        </a>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'BasicCustomLinksLive',
  props: {
    userName: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      username: this.userName ? this.userName : this.$route.params.username
    }
  },
  methods: {
    async getLinks () {
      this.processing = true
      try {
        //get custom links
        let customLinkResponse = await Vue.$http.get(
          `v1/user/mini-profile/links/custom`,
          {
            params: {
              username: this.username,
              layout_id: 1
            }
          }
        )
        this.links = customLinkResponse.data.data
      } catch (error) {
        this.$sentry.captureException(error)
      }
      this.processing = false
    }
  },
  mounted () {
    this.getLinks()
  }
}
</script>
<style scoped>
.list {
  border-radius: 10px;
  color: #fff;
}

.highlight {
  background-color: #f8f9fa;
}
</style>
