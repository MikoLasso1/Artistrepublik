<template>
  <v-col cols="12" class="order-xl-2 mb-5 mx-auto mb-xl-0" v-if="tracks !== undefined && tracks.length > 0">
    <v-card class="mb-3 card-profile shadow component-container component-container-even pb-5">
      <h2 class="pt-5 pl-xl-4 text-center">
        Latest Tracks
      </h2>
      <section class="card-body text-center mb-5 pt-0 pt-md-4 w-100">
        <Slick
          ref="slick"
          v-bind="slickOptions"
          class="pt-5 artist-tracks"
        >
          <div
            v-for="(track, index) in tracks"
            :key="index"
            class="artist-track"
          >
            <a
              v-if="track.external_track_link !== undefined && track.external_track_link !== null && track.external_track_link !== ''"
              :href="track.external_track_link"
              target="_blank"
            >
              <img
                v-if="track.album_cover_photo !== undefined && track.album_cover_photo !== null && track.album_cover_photo !== ''"
                :src="track.album_cover_photo"
                :alt="track.track_name"
                loading="lazy"
              >
              <h3
                v-if="track.track_name !== undefined && track.track_name !== null && track.track_name !== ''"
                class="mt-2"
              >{{ track.track_name }}</h3>
              <p v-if="track.song_info !== undefined && track.song_info !== null && track.song_info !== ''">{{ track.song_info }}</p>
            </a>
          </div>
        </Slick>
      </section>
    </v-card>
  </v-col>
</template>
<script>
import Slick from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
  name: 'LatestTracks',
  components: {
    Slick
  },
  data () {
    return {
      slickOptions: {
        slidesToShow: 5,
        slidesToScroll: 1,
        dots: true,
        autoplay: false,
        arrows: true,
        vertical: false,
        responsive: [
          {
            breakpoint: 1599,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 1,
              infinite: true,
              dots: false,
              arrows: true,
              vertical: false
            }
          },
          {
            breakpoint: 1281,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              infinite: true,
              dots: false,
              arrows: true,
              vertical: false
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
              dots: false,
              arrows: true,
              vertical: false
            }
          }
        ]
      },
      username: this.$route.params.username
    }
  },
  computed: {
    tracks () {
      return this.$store.getters.getTracksInfo
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.$store.dispatch('getLatestTracksInfo', this.$route.params.username)
    }
  },
  watch: {
    $route (to) {
      this.$store.dispatch('getLatestTracksInfo', to.params.username)
    }
  }
}
</script>
<style scoped>
section {
  max-width: 1920px;
}

h2, h3, span {
  font-family: 'Montserrat-SemiBold', sans-serif;
}

h2 {
  text-transform: uppercase;
}

h3, p, a {
  color: #121d3b;
}

h3:hover, p:hover, a:hover {
  color: #7a549d;
}

.artist-track img {
  width: 90%;
  max-width: 300px;
  display: block;
  margin: 0 auto;
  border-radius: 0.25rem;
}

.component-container-even {
  background-image: url(/img/profile/component_background_image.png);
  background-position: left top;
}

.webp .component-container-even {
  background-image: url(/img/profile/component_background_image.webp);
}

.component-container-odd {
  background-image: url(/img/profile/component_background_image_flipped.png);
  background-position: right top;
}

.webp .component-container-odd {
  background-image: url(/img/profile/component_background_image_flipped.webp);
}

.component-container {
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
