<template>
  <div class="h-100">
    <header class="header">
      <picture>
        <source
          media="(max-width: 1199px)"
          srcset="/img/curator/curatorplaylisting_banner_sm.webp 1x,
                        /img/curator/curatorplaylisting_banner_sm.webp 2x,
                        /img/curator/curatorplaylisting_banner_sm.webp 3x"
          type="image/webp"
        >
        <source
          media="(max-width: 1199px)"
          srcset="/img/curator/curatorplaylisting_banner_sm.png 1x,
                        /img/curator/curatorplaylisting_banner_sm.png 2x,
                        /img/curator/curatorplaylisting_banner_sm.png 3x"
          type="image/png"
        >
        <source
          media="(min-width: 1200px)"
          srcset="/img/curator/curatorplaylisting_banner_sm.webp 532w,
                        /img/curator/curatorplaylisting_banner_md.webp 1600w,
                        /img/curator/curatorplaylisting_banner.webp 2460w"
          type="image/webp" sizes="100vw"
        >
        <source
          media="(min-width: 1200px)"
          srcset="/img/curator/curatorplaylisting_banner_sm.png 532w,
                        /img/curator/curatorplaylisting_banner_md.png 1600w,
                        /img/curator/curatorplaylisting_banner.png 2460w"
          type="image/png" sizes="100vw"
        >
        <img src="/img/curator/curatorplaylisting_banner.png" class="w-100 h-auto" alt="Curator Hub" loading="lazy">
      </picture>
    </header>
    <v-container fluid>
      <v-row>
        <v-spacer />
        <v-col cols="12" lg="6" xl="4" class="py-1">
          <CuratorHub :from-curator-dash="0" />
        </v-col>
        <v-spacer />
      </v-row>
    </v-container>
  </div>
</template>
<script>
import CuratorHub from '@/components/CuratorHub/CuratorHub'

export default {
  components: {
    CuratorHub
  },
  metaInfo () {
    return {
      title: 'Curator Hub',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content:
            'Artist Republik is a 360 degree platform offering playlisting and curation services to help launch your career! We offer mastering, distribution, and more!'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content:
            'Curator Hub | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content:
            'Artist Republik is a 360 degree platform offering playlisting and curation services to help launch your career! We offer mastering, distribution, and more!'
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
            'Curator Hub  | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Artist Republik is a 360 degree platform offering playlisting and curation services to help launch your career! We offer mastering, distribution, and more!'
        }
      ]
    }
  },
  data () {
    return {}
  }
}
</script>
