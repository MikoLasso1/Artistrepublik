<template>
  <div>
    <div ref="trackForm">
      <v-form ref="form" @submit.prevent v-model="valid">
        <div>
          <validation-errors :errors="validationErrors" />
        </div>

        <v-text-field
          v-model="form.track_number"
          :rules="trackNumberRules"
          label="Track #"
          class="required"
        ></v-text-field>

        <v-text-field
          :value="trackPrimaryArtist"
          :rules="trackArtistRules"
          label="Artist"
          class="required"
          disabled
        ></v-text-field>

        <v-col cols="12" md="6">
          <v-radio-group v-model="form.track_has_secondary_artists">
            <template v-slot:label>
              Does the Track have a Secondary Artist?
              <strong class="red--text">*</strong>
            </template>
            <v-radio
              v-for="n in booleanOptions"
              :key="n.value"
              :label="n.text"
              :value="n.value"
            ></v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols="12">
          <DistributionArtistsList
            :artists="form.track_secondary_artists"
            @remove-artist="deleteSecondary"
            @edit-artist="editSecondary"
          />
        </v-col>

        <DistributionArtistForm
          v-if="form.track_has_secondary_artists"
          artist-type="Secondary"
          :artists="form.track_secondary_artists"
          :artist-data="secondayAritistData"
          :form="form"
          @save-artist="saveSecondary"
          ref="secondary-artist-form"
          :artist-roles="artistRoles"
        />

        <v-text-field
          v-model="form.track_title"
          :rules="trackTitleRules"
          label="Track Title"
          class="required"
          placeholder="The title of your musical monument"
        ></v-text-field>

        <v-radio-group v-model="form.is_track_title_english">
          <template v-slot:label>
            Is your release title in english?
            <strong class="red--text">*</strong>
          </template>
          <v-radio
            v-for="n in booleanOptions"
            :key="n.value"
            :label="n.text"
            :value="n.value"
          ></v-radio>
        </v-radio-group>

        <v-text-field
          v-if="!form.is_track_title_english"
          v-model="form.english_track_title"
          :rules="englishTitleRules"
          label="English translation of track title"
          class="required"
          placeholder="The english translation of your musical monument"
        ></v-text-field>

        <v-textarea
          v-model="form.track_lyrics"
          label="Track Lyrics (Optional)"
        ></v-textarea>

        <v-radio-group v-model="form.explicit">
          <template v-slot:label>
            <label>Does this track contain explicit lyrics?</label>
          </template>
          <v-radio
            v-for="n in explicitOptions"
            :key="n.value"
            :label="n.text"
            :value="n.value"
          ></v-radio>
        </v-radio-group>

        <v-radio-group v-model="form.track_previously_distributed">
          <template v-slot:label>
            Has this track been previously distributed?
            <strong class="red--text">*</strong>
          </template>
          <v-radio
            v-for="n in booleanOptions"
            :key="n.value"
            :label="n.text"
            :value="n.value"
          ></v-radio>
        </v-radio-group>
        <p v-if="form.track_previously_distributed" class="text-red">
          *Provide ISRC code to track past streams and royalties. If no ISRC
          provided, tracking will begin at 0
        </p>

        <v-text-field
          v-if="form.track_previously_distributed"
          v-model="form.track_isrc"
          label="Release ISRC"
          :rules="upcIsrcRules"
          placeholder="Add your release ISRC"
        ></v-text-field>

        <v-select
          v-model="form.dsp"
          :items="dsp"
          label="Digital Streaming Platforms"
          multiple
          chips
          hint="Choose which stores you want to sell your music on"
          persistent-hint
          item-text="name"
          item-value="value"
          class="required"
          :rules="dspRules"
        >
          <template v-slot:prepend-item>
            <v-list-item ripple @click="selectAllDSP()">
              <v-list-item-action>
                <v-icon :color="form.dsp.length > 0 ? 'indigo darken-4' : ''">
                  {{ icon }}
                </v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Select All</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-2"></v-divider>
          </template>
        </v-select>
        <p
          class="py-3 text-red"
          v-if="form.dsp && form.dsp.length > 0 && dspSoundcloud"
        >
          * Please read about SoundCloud copyright protection measures in the
          <a
            href="https://support.artistrepublik.com" target="_blank"
          >help center</a
          >.
        </p>

        <v-file-input
          label="Audio File"
          v-model="file"
          :rules="audioFileRules"
          accept="audio/wav,audio/x-wav,audio/mpeg,audio/mp3"
          class="required"
        ></v-file-input>
        <span v-if="uploadPercentage"> Upload: {{ uploadPercentage }}%</span>
        <p class="text-info">
          MP3 uploads may experience slight distortion, please use WAV if
          possible.
        </p>
        <div
          v-if="track && showAudioPlayButton"
          id="play-track"
          @click="playAudioFile"
        >
          <i class="ni ni-button-play" aria-hidden="true" />
          <span> {{ form.track_title }}</span>
        </div>

        <v-btn
          v-if="track"
          :disabled="deleteing"
          :loading="deleteing"
          color="primary"
          @click="doDelete"
        >
          Delete Track
        </v-btn>

        <v-btn
          :disabled="loading"
          :loading="loading"
          color="primary"
          @click="doSave"
          class="float-right"
        >
          Save Track
        </v-btn>
      </v-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'
import validationErrorsMixin from '@/shared/mixins/ValidationErrorsMixin'
import DistributionArtistForm from '@/components/Distribution/Modal/DistributionArtistForm.vue'
import DistributionArtistsList from '@/components/Distribution/Modal/DistributionArtistsList.vue'

export default {
  mixins: [validationErrorsMixin],
  props: {
    release: Object,
    track: Object,
    trackNumber: Number,
    artistRoles: {
      type: Array,
      default () {
        return []
      }
    }
  },
  components: {
    DistributionArtistForm,
    DistributionArtistsList
  },
  data: function () {
    return {
      booleanOptions: [
        { text: 'Yes', value: 1 },
        { text: 'No', value: 0 }
      ],
      dsp: [],
      uploadPercentage: null,
      showAudioPlayButton: true,
      form: {
        release_id: this.release.id,
        track_number: this.track ? this.track.track_number : this.trackNumber,
        track_primary_artist: this.track
          ? this.track.primary_artist
          : {
            apple_music_profile_link: null,
            artist_name: '',
            created_at: null,
            is_apple_music_profile: 0,
            is_primary: 1,
            is_spotify_profile: 0,
            role_id: null,
            spotify_profile_link: null,
            uuid: null
          },
        track_featured_artist: this.track
          ? this.track.track_featured_artist
          : '',
        track_title: this.track ? this.track.track_title : '',
        track_has_secondary_artists: 0,
        track_secondary_artists: this.track
          ? this.track.track_secondary_artists
          : [],
        is_track_title_english: this.track
          ? parseInt(this.track.is_track_title_english)
          : 1,
        english_track_title: this.track ? this.track.english_track_title : '',
        track_previously_distributed: this.track
          ? parseInt(this.track.track_previously_distributed)
          : 0,
        track_isrc: this.track ? this.track.track_isrc : '',
        track_lyrics: this.track ? this.track.track_lyrics : '',
        track_main_genre: this.track ? this.track.track_main_genre : '',
        track_sub_genre: this.track ? this.track.track_sub_genre : '',
        publisher: 'Artist Republik',
        explicit: this.track ? parseInt(this.track.explicit) : 0,
        audio_file: null,
        dsp: []
      },
      file: null,
      valid: true,
      upcIsrcRules: [
        (v) => (v && v.length === 12) || 'Your code must be 12 characters'
      ],
      trackNumberRules: [
        (v) => !!v || 'Track number is required',
        (v) => !isNaN(v) || 'Must be a valid number'
      ],
      dspRules: [(v) => !!v || 'DSP is required'],
      trackArtistRules: [(v) => !!v || 'Artist is required'],
      trackTitleRules: [
        (v) => !!v || 'Track Title is required',
        (v) => (v && v.length >= 3) || 'Must be greater than 3 characters'
      ],
      explicitOptions: [
        { text: 'Yes', value: 0 },
        { text: 'No', value: 1 }
      ],
      audioFileRules: [(v) => !!v || 'Audio file is required'],
      englishTitleRules: [
        (v) => (v && v.length >= 3) || 'Must be greater than 3 characters',
        (v) =>
          /^(["'`,:;=|<.^()A-Za-z0-9\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/.test(
            v
          ) || 'Special characters are not allowed',
        (v) => {
          if (this.form.is_title_english) {
            return !!v || 'English translation is required.'
          } else {
            return true
          }
        }
      ],
      urlRules: [
        (v) => {
          if (v) {
            return (
              /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?)/gi.test(
                v
              ) || 'Link must be valid'
            )
          } else {
            return true
          }
        }
      ],
      loading: false,
      deleteing: false,
      selectedAll: false,
      secondayAritistData: null
    }
  },
  computed: {
    ...mapGetters({
      genres: 'getGenres',
      subGenres: 'getSubGenres'
    }),
    trackPrimaryArtist () {
      if (this.form.track_primary_artist) {
        return this.form.track_primary_artist.artist_name
      } else {
        return ''
      }
    },
    icon () {
      if (this.selectedAll) {
        return 'mdi-close-box'
      } else {
        return 'mdi-checkbox-blank-outline'
      }
    },
    dspSoundcloud () {
      if (this.form.dsp.indexOf(9) !== -1) {
        return true
      }
      return false
    }
  },
  mounted: function () {
    if (this.genres.length === 0) {
      this.$store.dispatch('getGenres')
    }
    if (this.subGenres.length === 0) {
      this.$store.dispatch('getSubGenres')
    }
    Vue.$http.get('v1/distribution/dsps').then((response) => {
      let data = response.data.data
      let dsps = data.reduce((accum, val) => {
        accum.push({ name: val.name, value: val.id })
        return accum
      }, [])
      this.dsp = dsps
      if (this.track) {
        let track_dsps = this.track.dsps.reduce((accum, val) => {
          accum.push(val.id)
          return accum
        }, [])
        this.form.dsp = track_dsps
      }
    })

    let release = this.$store.getters.getRelease

    if (release.release_type === 'Release') {
      this.form.track_primary_artist = release.primary_artist
      this.form.track_featured_artist = release.featured_artist
      this.form.track_title = release.release_title
      this.form.track_main_genre = release.genre.id
      this.form.track_sub_genre = release.sub_genre.id
    } else if (
      release.release_type === 'Album' ||
      release.release_type === 'Mix'
    ) {
      this.form.track_primary_artist = release.primary_artist
      this.form.track_featured_artist = release.featured_artist
      this.form.track_main_genre = release.genre.id
      this.form.track_sub_genre = release.sub_genre.id
    }

    if (this.track) {
      this.form.track_main_genre = this.genres.filter(
        (v) => v.id === this.track.track_main_genre.id
      )[0].id
      this.form.track_sub_genre = this.subGenres.filter(
        (v) => v.id === this.track.track_sub_genre.id
      )[0].id

      if (this.track.track_secondary_artists.length) {
        this.form.track_has_secondary_artists = 1
      }
    }
  },
  methods: {
    savePrimary (artist) {
      this.form.primary_artist = artist
    },
    saveSecondary (artist) {
      let objId = this.getSecondaryArtistObjId(artist)
      if (objId !== -1) {
        this.form.track_secondary_artists[objId] = artist
      } else {
        this.form.track_secondary_artists.push(artist)
      }
    },
    editSecondary (artist) {
      this.counter++
      artist.counter = this.counter
      this.secondayAritistData = artist
    },
    deleteSecondary (artist) {
      let objId = this.getSecondaryArtistObjId(artist)
      if (objId !== -1) {
        this.form.track_secondary_artists.splice(objId, 1)
      }
    },
    getSecondaryArtistObjId (artist) {
      let objId
      if (artist.uuid) {
        objId = this.form.track_secondary_artists.findIndex((v) => {
          return v.uuid === artist.uuid
        })
      } else if (artist.temp_id) {
        objId = this.form.track_secondary_artists.findIndex((v) => {
          return v.temp_id === artist.temp_id
        })
      }
      return objId
    },
    selectAllDSP () {
      if (!this.selectedAll) {
        this.selectedAll = true
        this.dsp.forEach((item) => {
          this.form.dsp.push(item.value)
        })
      } else {
        this.selectedAll = false
        this.form.dsp = []
      }
    },
    getValidationState ({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null
    },
    onAudioFile: function () {
      this.showAudioPlayButton = false
      this.form.audio_file = this.$refs.audio_file.files[0]
    },
    playAudioFile: function () {
      //TODO have audio stop and start playing
      var audio = new Audio(this.track.audio_url)
      audio.play()
    },
    readFile: function (file) {
      return new Promise((resolve) => {
        let audio = document.createElement('audio')
        let reader = new FileReader()

        reader.onload = function (e) {
          audio.src = e.target.result
          audio.addEventListener(
            'loadedmetadata',
            function () {
              let duration = audio.duration
              let status = (duration / 60).toFixed(2) <= 10
              resolve(status)
            },
            false
          )
        }

        reader.readAsDataURL(file)
      })
    },
    doSave: async function () {
      this.$refs.form.validate()
      // Checking Audio File Duration - 8 is the index of inputs
      if (this.file) {
        let audioDurationStatus = await this.readFile(this.file)
        if (!audioDurationStatus) {
          this.$refs.form.inputs[8].errorBucket.push(
            'Track duration must be less than 10 mins'
          )
          this.valid = false
        }
      }

      if (!this.valid) {
        return
      }
      this.loading = true

      this.form.audio_file = this.file
      let formData = new FormData()
      for (let key in this.form) {
        if (key === 'dsp') {
          this.form.dsp.forEach((value) => {
            formData.append('dsp[]', value)
          })
        } else {
          let value = this.form[key]
          if (this.form[key] === null) {
            continue
          } else if (
            key === 'track_primary_artist' ||
            key === 'track_secondary_artists'
          ) {
            value = JSON.stringify(this.form[key])
          }
          formData.append(key, value)
        }
      }
      let url = 'v1/distribution/release/track'
      if (this.track) {
        url += `/${this.track.id}`
        formData.append('_method', 'PUT')
      }
      Vue.$http({
        method: 'POST',
        url: url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: function (progressEvent) {
          this.uploadPercentage = parseInt(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          )
        }.bind(this)
      })
        .then((response) => {
          this.$emit('saving')
          if (this.track === null) {
            this.$store.commit('addTrack', response.data.data)
          } else {
            this.$store.commit('updateTrack', response.data.data)
          }
          this.$emit('track-upsert', response.data.data)
        })
        .catch((error) => {
          this.errors = true
          let items
          if (error.response && error.response.status === 400) {
            items = Object.values(error.response.data.data.message)
          } else if (error.response && error.response.status === 422) {
            items = Object.values(error.response.data.errors)
          } else {
            console.log(error)
          }
          this.validationErrors = this.formatErrors(items)
          this.$refs.trackForm.scrollIntoView()
        })
        .then(() => (this.loading = false))
    },
    doDelete: function () {
      this.deleteing = true
      Vue.$http
        .delete(`v1/distribution/release/track/${this.track.id}`)
        .then(() => {
          this.$store.commit('removeTrack', this.track)
          this.$emit('track-upsert', { id: null })
        })
        .catch((error) => console.log(error))
        .then(() => (this.deleteing = false))
    }

    // checkAudioDuration: async function() {
    //   let status = false;

    //   if(this.file)
    //     status = await this.readFile(this.file)

    //   console.log(status)
    //   return status;
    // }
  },
  watch: {
    track: {
      handler (newVal) {
        this.form.track_secondary_artists = newVal.track_secondary_artists
      },
      deep: true
    }
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
