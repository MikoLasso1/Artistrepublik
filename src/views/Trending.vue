<template>
  <div class="h-100 fancy-bg">
    <header class="header">
      <picture>
        <source
          media="(max-width: 1199px)"
          srcset="/img/trending/trending_header_sm.webp 1x,
                        /img/trending/trending_header_sm.webp 2x,
                        /img/trending/trending_header_sm.webp 3x"
          type="image/webp"
        >
        <source
          media="(max-width: 1199px)"
          srcset="/img/trending/trending_header_sm.jpg 1x,
                        /img/trending/trending_header_sm.jpg 2x,
                        /img/trending/trending_header_sm.jpg 3x"
          type="image/jpg"
        >
        <source
          media="(min-width: 1200px)"
          srcset="/img/trending/trending_header_sm.webp 532w,
                        /img/trending/trending_header_md.webp 1600w,
                        /img/trending/trending_header.webp 2460w"
          type="image/webp" sizes="100vw"
        >
        <source
          media="(min-width: 1200px)"
          srcset="/img/trending/trending_header_sm.jpg 532w,
                        /img/trending/trending_header_md.jpg 1600w,
                        /img/trending/trending_header.jpg 2460w"
          type="image/jpg" sizes="100vw"
        >
        <img src="/img/trending/trending_header.jpg" class="w-100 h-auto" alt="Trending" loading="lazy">
      </picture>
    </header>
    <div class="card">
      <div class="card-body">
        <div class="container card my-1` mb-4 p-0 shadow bg-secondary">
          <div class="card-header border-0">
            <v-row class="align-items-center">
              <v-col>
                <h2 class="trending-title">
                  Top 100 Trending Tracks
                </h2>
              </v-col>
            </v-row>
            <TrendingTrackItem
              v-for="(item, index) in tracks"
              :key="index"
              :track="item"
              :is-selected="selectedItem"
              :track-position="index"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TrendingTrackItem from './../components/Trending/TrendingTrackItem'

export default {
  components: {
    TrendingTrackItem
  },
  props: {},
  metaInfo () {
    return {
      title: 'Trending Tracks',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content:
            'Artist Republik is a trend setting, 360 degree platform trusted by thousands of independent artists! We offer reviews, mastering, distribution, playlisting, and more!'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content:
            'Trending Tracks | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content:
            'Artist Republik is a trend setting, 360 degree platform trusted by thousands of independent artists! We offer reviews, mastering, distribution, playlisting, and more!'
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
            'Trending Tracks | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Artist Republik is a trend setting, 360 degree platform trusted by thousands of independent artists! We offer reviews, mastering, distribution, playlisting, and more!'
        }
      ]
    }
  },
  data () {
    return {
      selectedItem: null,
      selectedTrackId: null
    }
  },
  computed: {
    ...mapGetters({
      tracks: 'getTopTracks',
      user: 'getUser'
    })
  },
  mounted () {
    this.$store.dispatch('getTopTracks')
  },
  methods: {}
}
</script>
<style scoped>
.trending-title {
  text-align: center;
}

.trending-title:after {
  content: '';
  display: block;
  width: 50px;
  height: 3px;
  background-color: #7f244f;
  margin: 20px auto 0;
}

.track-name {
  color: #344072;
  line-height: 1.2;
  font-weight: 600;
  font-size: 16px;
}

.table > tbody > tr > td {
  vertical-align: middle;
}

td.popularity {
  font-size: 16px;
}

.container {
  max-width: 1024px !important;
}
</style>
