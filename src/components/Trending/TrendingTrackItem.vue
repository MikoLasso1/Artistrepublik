<template>
  <v-container class="trending-track">
    <v-row class="main-content bg-white py-2 trending-track-container">
      <v-col cols="5" md="2" class="h1 trending-track-position">{{ trackPosition + 1 }}</v-col>
      <v-col cols="6" md="2">
        <a :href="track.external_track_link" class="d-block" target="_blank">
          <img :src="track.album_cover_photo" width="100" height="100" loading="lazy" :alt="track.track_name" />
        </a>
      </v-col>
      <v-col cols="12" lg="6" class="trending-track-name pt-3 h3">
        <a
          :href="track.external_track_link"
          class="d-block"
          target="_blank"
        >{{ track.track_name }}</a>
        <p class="trending-artist-name">{{ track.artist_name }}</p>
      </v-col>
      <v-col cols="12" lg="2">
        <v-row class="trending-track-popularity">
          <v-col cols="6">
                        <span
                          v-if="popularityDiff"
                          class="trendsing-track-change"
                        >( {{ popularityDiff }} )</span>
            <span v-if="isSongPopular() === 'higher'" class="d-inline">
                            <i class="mdi mdi-arrow-up text-success" aria-hidden="true" />
                        </span>
            <span v-else-if="isSongPopular() === 'lower'">
                            <i class="mdi mdi-arrow-down text-warning" aria-hidden="true" />
                        </span>
            <span v-else>
                            <i class="mdi mdi-arrow-right" aria-hidden="true" />
                        </span>
          </v-col>
          <v-col cols="4" lg="6">{{ getTrackPopularity() }}</v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  components: {},
  props: {
    track: Object,
    isSelected: Boolean,
    trackPosition: [Number, String]
  },
  data () {
    return {
      popularityDiff: ''
    }
  },
  computed: {
    tracks_popularity () {
      return this.track.tracks_popularity
    },
    tracks_popularity_count () {
      return this.track.tracks_popularity.length
    }
  },
  methods: {
    getTrackPopularity () {
      return (((this.track || {}).tracks_popularity[0] || {}).popularity || 0)
    },
    isSongPopular () {
      if (this.track.tracks_popularity.length >= 2) {
        var trackPopularity = this.track.tracks_popularity
        var trackPopularitySliced = trackPopularity.slice(0, 2)
        var latestPopularity = ((trackPopularitySliced[0] || {}).popularity || 0)
        var previousPopularity = ((trackPopularitySliced[1] || {}).popularity || 0)
        if (latestPopularity === previousPopularity) {
          return 'equal'
        } else {
          this.popularityDiff =
            parseInt(latestPopularity) -
            parseInt(previousPopularity)
          return latestPopularity > previousPopularity
            ? 'higher'
            : 'lower'
        }
      } else {
        return 'equal'
      }
    }
  }
}
</script>
<style scoped>
.trending-track-container {
  border-bottom: 1px solid #adb5bd;
}

.trending-track-name {
  text-align: center;
}

.trending-track-name a {
  color: #525f7f;
}

.trending-artist-name {
  font-size: 0.875rem;
  color: #adb5bd;
  font-weight: bold;
}

.trending-track-change {
  font-size: 12px;
}

.trending-track-popularity {
  align-content: center;
  justify-content: flex-end;
}

@media screen and (min-width: 992px) {
  .trending-track-container {
    align-content: center;
  }

  .trending-track-name {
    text-align: left;
  }

  .trending-track-position {
    align-self: center;
  }
}
</style>
