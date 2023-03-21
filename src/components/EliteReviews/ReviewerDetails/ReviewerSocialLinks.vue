<template>
  <v-row>
    <v-col md="12" cols="12" class="social-links">
      <h2 class="social-links-heading body-2">Connect</h2>
      <template v-for="(icon, key) in icons">
        <reviewer-social-icon
          v-if="icon.label"
          :name="icon.name"
          :label="icon.label"
          size="md"
          target="_blank"
          :url="icon.url"
          :key="key"
        />
      </template>
    </v-col>
  </v-row>
</template>

<script>
import ReviewerSocialIcon from './ReviewerSocialIcon'

const _ = require('lodash')

export default {
  components: {
    ReviewerSocialIcon
  },
  props: {
    links: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  computed: {
    icons: function () {
      const icons = []

      if (this.links.length === 0) {
        return []
      }

      _.forEach(this.links, (link) => {
        const label = link.url
        const name = link.icon
        const url = link.prefix ? 'https://' + link.prefix + link.url : null
        const icon = { label, name }
        if (url) {
          icon.url = url
        }
        icons.push(icon)
      })
      return icons
    }
  }
}
</script>

<style lang="scss" scoped>
.social {
  &-links {
    text-align: center;
    margin: 10px auto;
    border: 1px solid #121D3B;
    padding: 10px 0;

    &-heading {
      text-transform: uppercase;
      color: #121D3B;
      margin: 0 0 10px;
      line-height: 1;
    }
  }
}
</style>
