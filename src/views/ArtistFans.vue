<template>
  <div class="h-100">
    <header class="header">
      <picture>
        <source
          media="(max-width: 1199px)"
          srcset="/img/mini-profile/header_sm.webp 1x,
                        /img/mini-profile/header_sm.webp 2x,
                        /img/mini-profile/header_sm.webp 3x"
          type="image/webp"
        >
        <source
          media="(max-width: 1199px)"
          srcset="/img/mini-profile/header_sm.png 1x,
                        /img/mini-profile/header_sm.png 2x,
                        /img/mini-profile/header_sm.png 3x"
          type="image/png"
        >
        <source
          media="(min-width: 1200px)"
          srcset="/img/mini-profile/header_sm.webp 532w,
                        /img/mini-profile/header_md.webp 1600w,
                        /img/mini-profile/header.webp 2460w"
          type="image/webp" sizes="100vw"
        >
        <source
          media="(min-width: 1200px)"
          srcset="/img/mini-profile/header_sm.png 532w,
                        /img/mini-profile/header_md.png 1600w,
                        /img/mini-profile/header.png 2460w"
          type="image/png" sizes="100vw"
        >
        <img src="/img/mini-profile/header.png" class="w-100 h-auto" alt="ArtstLnk" loading="lazy">
      </picture>
    </header>
    <v-container fluid>
      <v-row class="mb-4">
        <v-col>
          <v-card class="card shadow mini-settings">
            <v-card-title class="card-header">My Fans</v-card-title>

            <v-card-text class="mt-4">
              <v-row justify="center">
                <v-col sm="12" md="10">
                  <v-data-table
                    :headers="headers"
                    :items="fans"
                    :items-per-page="10"
                    :loading="processing"
                    class="elevation-1"
                  >
                    <template v-slot:item.followed_spotify="{ item }">
                      <v-icon v-if="item.followed_spotify">mdi-check-bold</v-icon>
                      <v-icon v-else>mdi-close-thick</v-icon>
                    </template>

                    <template v-slot:item.added_to_playlist="{ item }">
                      <v-icon v-if="item.added_to_playlist">mdi-check-bold</v-icon>
                      <v-icon v-else>mdi-close-thick</v-icon>
                    </template>

                    <template v-slot:item.created_at="{ item }">
                      {{ item.created_at | formatDateTimeLocal }}
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
import Vue from 'vue'
import moment from 'moment'

export default {
  metaInfo () {
    return {
      title: 'Fans',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: 'Artist Republik is a 360 degree platform offering artists a way to track fans and grow your following! We offer reviews, distribution, playlisting, and more!'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content:
            'Fans | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content:
            'Artist Republik is a 360 degree platform offering artists a way to track fans and grow your following! We offer reviews, distribution, playlisting, and more!'
        },
        {
          vmid: 'og:url',
          property: 'og:url',
          content: 'https://app.artistrepublik.com' + this.$route.fullPath
        },
        {
          vmid: 'twitter:title',
          property: 'twitter:title',
          content:
            'Fans | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Artist Republik is a 360 degree platform offering artists a way to track fans and grow your following! We offer reviews, distribution, playlisting, and more!'
        }
      ]
    }
  },
  data () {
    return {
      processing: false,
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name'
        },
        { text: 'Email', value: 'email' },
        { text: 'Phone', value: 'phone', sortable: false },
        { text: 'Spotify Followed', value: 'followed_spotify', sortable: false },
        { text: 'Added to Playlist', value: 'added_to_playlist', sortable: false },
        { text: 'Created at', value: 'created_at', sortable: false }
      ],
      fans: []
    }
  },
  filters: {
    formatDateTimeLocal: function (value) {
      if (!value) return ''

      return moment(value).format('MM/DD/YYYY hh:mm a')
    }
  },
  methods: {
    async getFans () {
      this.processing = true
      try {
        let response = await Vue.$http.get('v1/user/social-unlock/fans')
        if (response.status === 200) {
          let fansResponse = response.data.data
          let uniqueMails = []
          fansResponse.forEach(fan => {
            if (fan.email) {
              if (uniqueMails.indexOf(fan.email) === -1) {
                uniqueMails.push(fan.email)
                this.fans.push(fan)
              }
            } else {
              this.fans.push(fan)
            }
          })
        }
      } catch (err) {
        this.$noty.warning('Error Occurred while processing request.')
      }
      this.processing = false
    }
  },
  mounted () {
    this.getFans()
  }
}
</script>
