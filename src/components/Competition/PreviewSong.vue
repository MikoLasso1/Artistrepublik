<template>
  <v-row class="miniprofile-artistmedia my-2">
    <div class="hidden">{{ processing }}</div>
    <v-col cols="12" v-if="processing">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-col>
    <v-col
      cols="8"
      v-if="!processing"
    >
      <div class="hidden">{{ song_link }}</div>
      <blockquote
        class="embedly-card"
        :data-card-key="embedlyAppKey"
        data-card-controls="0"
        data-card-branding="0"
        v-if="!processing"
        :key="song_link"
      >
        <h4><a :href="song_link"></a></h4>
      </blockquote>
    </v-col>
  </v-row>
</template>
<script>
import config from '@/config'

export default {
  name: 'ArtistMedia',
  props: {
    songLink: {
      default: null,
      type: [String, Number],
    },
    userName: {
      default: null,
      type: String,
    },
  },
  data () {
    return {
      embedlyAppKey: config.EMBEDLY_APP_KEY,
      username: this.userName ? this.userName : this.$route.params.username,
      processing: false,
      artistMedia: [],
      song_link: false,
    }
  },
  watch: {
    songLink: function (newVal) { // watch it
      this.processing = true

      this.song_link = newVal
      setTimeout(function () {
        this.processing = true
      }.bind(this), 200)

      setTimeout(function () {
        this.processing = false
      }.bind(this), 2000)
    },
  },
  mounted () {
    this.song_link = this.songLink
  },
}
</script>
<style>
.miniprofile-artistmedia iframe {
  max-height: 450px;
}

.hidden {
  display: none;
}
</style>

