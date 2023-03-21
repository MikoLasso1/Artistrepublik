<template>
  <div class="h-100">
    <header class="header">
      <picture>
        <source
          media="(max-width: 1199px)"
          srcset="/img/instagram-placement/banner_sm.webp 1x,
                        /img/instagram-placement/banner_sm.webp 2x,
                        /img/instagram-placement/banner_sm.webp 3x"
          type="image/webp"
        >
        <source
          media="(max-width: 1199px)"
          srcset="/img/instagram-placement/banner_sm.jpg 1x,
                        /img/instagram-placement/banner_sm.jpg 2x,
                        /img/instagram-placement/banner_sm.jpg 3x"
          type="image/jpg"
        >
        <source
          media="(min-width: 1200px)"
          srcset="/img/instagram-placement/banner_sm.webp 532w,
                        /img/instagram-placement/banner_md.webp 1600w,
                        /img/instagram-placement/banner.webp 2460w"
          type="image/webp" sizes="100vw"
        >
        <source
          media="(min-width: 1200px)"
          srcset="/img/instagram-placement/banner_sm.jpg 532w,
                        /img/instagram-placement/banner_md.jpg 1600w,
                        /img/instagram-placement/banner.jpg 2460w"
          type="image/jpg" sizes="100vw"
        >
        <img src="/img/instagram-placement/banner.jpg" class="w-100 h-auto" alt="Instagram Placement" loading="lazy">
      </picture>
    </header>
    <v-container fluid>
      <v-row>
        <v-spacer />
        <v-col cols="12" lg="6" xl="4" class="py-1">
          <order-widget />
        </v-col>
        <v-spacer />
      </v-row>
    </v-container>
  </div>
</template>

<script>
import OrderWidget from '@/components/InstagramPlacement/OrderWidget'

export default {
  components: {
    OrderWidget
  },
  data () {
    return {
      url: 'v1/instagram-placement/stats',
      statData: {},
      loading: false
    }
  },
  metaInfo () {
    return {
      title: 'Instagram Placement',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content:
            'Artist Republik is a 360 degree platform offering social placement to help launch your career! We offer reviews, distribution, playlisting, promotion and more!'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content:
            'Instagram Placement | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content:
            'Artist Republik is a 360 degree platform offering social placement to help launch your career! We offer reviews, distribution, playlisting, promotion and more!'
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
            'Instagram Placement | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Artist Republik is a 360 degree platform offering social placement to help launch your career! We offer reviews, distribution, playlisting, promotion and more!'
        }
      ]
    }
  }
}
</script>

<style>

</style>
