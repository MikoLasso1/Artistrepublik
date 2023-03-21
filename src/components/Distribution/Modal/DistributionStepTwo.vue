<template>
  <div>
    <v-alert outlined type="info" color="primary" v-if="showAlert" elevation="2">
      To add more songs, please go back and change the "Release Type" to "Album" or "MixTape/EP:max 5 songs"
    </v-alert>

    <v-alert outlined type="info" color="primary" v-if="showMaxAlert" elevation="2">
      To add more songs, please go back and change the "Release Type" to "Album"
    </v-alert>

    <v-alert outlined type="info" color="primary" v-if="showAlbumTrackLimitAlert" elevation="2">
      You can only add 20 songs per album.
    </v-alert>

    <v-divider class="mt-2 mb-2"></v-divider>

    <v-row>
      <v-col md="4">
        <v-list>
          <v-list-item-group
            v-model="modelList"
            active-class="border"
            color="indigo"
          >
            <v-list-item
              v-for="track in release.tracks"
              :key="track.id"
              @click="onSelected(track.id)"
            >
              <v-list-item-content>
                <v-list-item-title v-text="track.track_title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              @click="onSelected(null)"
              :class="{'v-list-item--active': selectedId === null}"
            >
              <v-list-item-icon>
                <v-icon v-text="`mdi-hospital`"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="`Add Song`"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col md="8">
        <track-form
          :key="selectedId"
          :artist-roles="artistRoles"
          :release="release"
          :track="track"
          :track-number="nextTrackNumber"
          @track-upsert="selectSidebarTab"
          @saving="$emit('track-saving')"
          class="mt-5"
        />
      </v-col>
    </v-row>
    <v-divider class="mt-4 mb-4"></v-divider>
    <v-btn @click="doBack" color="primary">
      Back
    </v-btn>

    <v-btn
      @click="doContinue"
      color="primary"
      :disabled="release.tracks.length === 0"
      class="float-right"
    >Continue
    </v-btn>
  </div>
</template>

<script>
//TODO when the song title is too long, the text overlaps on the sidebar
import TrackForm from '@/components/Distribution/Modal/TrackForm.vue'
import { mapGetters } from 'vuex'

export default {
  props: {
    artistRoles: {
      type: Array,
      default () {
        return []
      },
    },
  },
  components: {
    TrackForm,
  },
  data: function () {
    return {
      selectedId: null,
      showAlert: false,
      showMaxAlert: false,
      showAlbumTrackLimitAlert: false,
      modelList: null,
    }
  },
  computed: {
    ...mapGetters({
      release: 'getRelease',
    }),
    track: function () {
      let track = this.release.tracks.filter(v => v.id === this.selectedId)
      if (track.length !== 0) {
        return track[0]
      }
      return null
    },
    nextTrackNumber: function () {
      return this.release.tracks.length + 1
    },
  },
  mounted: function () {
    this.$store.dispatch('updateIntentStep', 'add tracks')
    if (this.release.release_type !== 'Album' && this.release.tracks.length !== 0) {
      this.selectedId = this.release.tracks[0].id
    }
    //TODO If i originally select album, but change to single we should delete all but one track if there are any
  },
  methods: {
    onSelected: function (id) {
      if (
        this.release.release_type === 'Album' &&
        this.release.tracks.length >= 20
      ) {
        this.showAlbumTrackLimitAlert = true
      } else if (
        this.release.release_type === 'Mix' &&
        this.release.tracks.length > 4
      ) {
        this.showMaxAlert = true
      } else if (
        this.release.release_type !== 'Album' &&
        this.release.release_type !== 'Mix' &&
        id === null &&
        this.release.tracks.length !== 0
      ) {
        this.showAlert = true
      } else {
        this.showAlert = false
        this.selectedId = id
      }
    },
    selectSidebarTab: function (track) {
      this.selectedId = track.id
    },
    doBack: function () {
      this.$emit('back-step')
    },
    doContinue: function () {
      if (this.release.tracks.length === 0) {
        return
      }
      this.$emit('next-step')
    },
  },
}
</script>

<style lang="scss" scoped>
.border {
  border: 2px dashed orange;
}

.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

#sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid rgba(0, 0, 0, 0.1);

  > div {
    height: 40px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    line-height: 0;
    text-align: center;
    cursor: pointer;

    &:hover, &.selected {
      background: #5e72e4;
      color: #fff;
    }

    .ni-fat-add {
      line-height: 0;
    }
  }
}

#content {
  padding: 1.5rem;
}
</style>
