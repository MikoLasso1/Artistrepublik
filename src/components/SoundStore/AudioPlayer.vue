<template>
  <div>
    <audio id="player" ref="player" :src="url"></audio>
    <v-bottom-sheet
      inset
      class="audioplayer"
      v-model="isPlaying"
      dark
      color="#53566a"
    >
      <v-card tile>
        <v-card-title>{{ nowPlaying.name }}</v-card-title>
        <v-card-subtitle>{{ nowPlaying.display_name }}</v-card-subtitle>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-spacer></v-spacer>
              <v-btn
                icon
                color="primary"
                @click.native="playing ? pause() : play()"
                :disabled="!loaded"
              >
                <v-icon v-if="!playing || paused">mdi-play</v-icon>
                <v-icon v-else>mdi-pause</v-icon>
              </v-btn>
              <v-progress-linear
                class="mx-4"
                v-model="percentage"
                height="5"
                @click.native="setPosition()"
                :disabled="!loaded"
              ></v-progress-linear>
              <p style="width: 200px;" class="mb-0">
                {{ currentTime }} / {{ duration }}
              </p>
              <v-btn icon color="primary" @click="close">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
const formatTime = second => new Date(second * 1000).toISOString().substr(11, 8)
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    downloadable: {
      type: Boolean,
      default: false
    },
    autoPlay: {
      type: Boolean,
      default: true
    }
  },
  data: function () {
    return {
      playing: false,
      currentTime: '00:00:00',
      totalDuration: 0,
      percentage: 0,
      loaded: false,
      firstPlay: true,
      audio: undefined,
      nowPlaying: this.beat ? this.beat : ''
    }
  },
  computed: {
    ...mapGetters({
      isPlaying: 'SSAudioPlayer/getIsPlaying',
      paused: 'SSAudioPlayer/getPaused',
      url: 'SSAudioPlayer/getUrl',
      beat: 'SSAudioPlayer/getPlayable'
    }),
    duration: function () {
      return this.audio ? formatTime(this.totalDuration) : ''
    }
  },
  watch: {
    url: function (v) {
      if (!v) {
        return
      }
      this.audio = this.$refs.player
      this.init()
    },
    beat: function (v) {
      if (!v) {
        return
      }
      this.nowPlaying = this.beat
    },
    paused: function () {
      this.paused ? this.audio.pause() : this.audio.play()
    }
  },
  methods: {
    ...mapMutations({
      SET_IS_PLAYING: 'SSAudioPlayer/SET_IS_PLAYING',
      SET_PAUSED: 'SSAudioPlayer/SET_PAUSED'
    }),
    setPosition: function () {
      this.audio.currentTime =
        this.audio.duration === Infinity
          ? 1e101
          : parseInt((this.percentage / 100) * this.audio.duration)
    },
    stop: function () {
      this.audio.pause()
      this.SET_PAUSED(true)
      this.playing = false
      this.audio.currentTime = 0
    },
    play: function () {
      if (this.playing) return
      this.audio.play().then(() => (this.playing = true))
      this.SET_PAUSED(false)
    },
    pause: function () {
      this.SET_PAUSED(!this.paused)
      if (typeof this.audio !== 'undefined') {
        this.paused ? this.audio.pause() : this.audio.play()
      }
    },
    download: function () {
      this.audio.pause()
      window.open(this.file, 'download')
    },
    _handleLoaded: function () {
      if (this.audio.readyState >= 2) {
        if (this.audio.duration === Infinity) {
          // Fix duration for streamed audio source or blob based
          // https://stackoverflow.com/questions/38443084/how-can-i-add-predefined-length-to-audio-recorded-from-mediarecorder-in-chrome/39971175#39971175
          this.audio.currentTime = 1e101
          this.audio.ontimeupdate = () => {
            this.audio.ontimeupdate = () => {
            }
            this.audio.currentTime = 0
            this.totalDuration = parseInt(this.audio.duration)
            this.loaded = true
          }
        } else {
          this.totalDuration = parseInt(this.audio.duration)
          this.loaded = true
        }
        if (this.autoPlay) {
          this.playing = true
          this.SET_PAUSED(false)
          this.audio.play()
        }
      } else {
        throw new Error('Failed to load sound file')
      }
    },
    _handlePlayingUI: function () {
      this.percentage = (this.audio.currentTime / this.audio.duration) * 100
      this.currentTime = formatTime(this.audio.currentTime)
      this.playing = true
    },
    _handlePlayPause: function (e) {
      if (e.type === 'play' && this.firstPlay) {
        // in some situations, audio.currentTime is the end one on chrome
        this.audio.currentTime = 0
        if (this.firstPlay) {
          this.firstPlay = false
        }
      }
      if (
        e.type === 'pause' &&
        this.paused === false &&
        this.playing === false
      ) {
        this.currentTime = '00:00:00'
      }
    },
    init: function () {
      this.audio.addEventListener('timeupdate', this._handlePlayingUI)
      this.audio.addEventListener('loadeddata', this._handleLoaded)
      this.audio.addEventListener('pause', this._handlePlayPause)
      this.audio.addEventListener('play', this._handlePlayPause)
      this.audio.addEventListener('ended', this._handleEnded)
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        this.audio.autoplay = true
      }
    },
    close: function () {
      if (typeof this.audio !== 'undefined') {
        this.audio.pause()
        this.audio.removeEventListener('timeupdate', this._handlePlayingUI)
        this.audio.removeEventListener('loadeddata', this._handleLoaded)
        this.audio.removeEventListener('pause', this._handlePlayPause)
        this.audio.removeEventListener('play', this._handlePlayPause)
        this.audio.removeEventListener('ended', this._handleEnded)
        this.audio.currentTime = 0
      }
      this.SET_PAUSED(true)
      this.playing = false
      this.percentage = 0
      this.SET_IS_PLAYING(false)
    }
  }
}
</script>

<style>
div.audioplayer {
  top: 100%;
  transform: translateY(-100%);
}
</style>
