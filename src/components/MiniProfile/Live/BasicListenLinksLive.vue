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
            :src="`/img/mini-profile/${link.app_name}.png`"
            :alt="link.app_name"
            loading="lazy"
          />
        </v-avatar>
      </v-col>
      <v-col xs="7" class="white--text">
        Listen now on
        <span class="text-capitalize">{{ link.app_name }}</span>
      </v-col>
      <v-col xs="3" class="text-left text-md-center">
        <a :href="link.value" target="_blank" rel="noopener">
          <v-btn class="btn-profile" dark>Listen</v-btn>
        </a>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'BasicListenLinksLive',
  props: {
    username: {
      default: null,
      type: [String]
    }
  },
  data () {
    return {
      links: []
    }
  },
  methods: {
    async getLinks () {
      this.processing = true
      try {
        //get mini profile links
        let profileLinkResponse = await Vue.$http.get(
          `v1/user/mini-profile/links`,
          {
            params: {
              username: this.username,
              layout_id: 1
            }
          }
        )
        let reslinks = profileLinkResponse.data.data

        //get link order
        let linkOrderResponse = await Vue.$http.get(`v1/user/mini-profile/links/order`, {
          params: {
            layout_id: 1,
            username: this.username
          }
        })
        let linkOrderData = linkOrderResponse.data.data
        if (linkOrderData.length) {
          linkOrderData.forEach(element => {
            let newArray = reslinks.filter(function (el) {
              return el.app_id === element.id
            })
            if (newArray.length) {
              let app_name = newArray[0].app_name
              let value = newArray[0].url
              this.links.push({
                app_name: app_name,
                value: value
              })
            }
          })
        } else {
          Object.entries(reslinks).forEach((val) => {
            let app_name = val.app_name
            let value = val.url
            this.links.push({
              app_name: app_name,
              value: value
            })
          })
        }
      } catch (error) {
        this.$sentry.captureException(error)
      }


      this.processing = false

    }
  },
  mounted () {
    // console.log('in mounted');
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
