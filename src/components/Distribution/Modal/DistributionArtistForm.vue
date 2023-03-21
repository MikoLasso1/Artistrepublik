<template>
  <div>
    <v-form ref="form" v-model="valid">
      <v-row>
        <!--ArtistName-->
        <v-col cols="12" lg="8">
          <v-text-field
            v-model="artist.artist_name"
            :placeholder="`Add ${artistType} Artist`"
            :rules="rules.artistRules"
            :hint="`Add ${artistType} Artist's name exactly as you wish it to appear`"
            @focus="showCancel = !showCancel"
          >
            <template v-slot:label>
              {{ `${artistType} Artist` }} <strong class="red--text">*</strong>
            </template>
            <template v-slot:append>
              <v-tooltip top max-width="300">
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on"> mdi-help-circle-outline</v-icon>
                </template>
                <span v-if="artistType === 'Secondary'">
                  For Albums and EP/Mix: Identify Artists on each track in the
                  next step.
                </span>
                <span v-else>
                  Add your artist name exactly as you wish it to appear
                </span>
              </v-tooltip>
            </template>
          </v-text-field>
        </v-col>
        <!--ArtistRole-->
        <v-col cols="12" lg="4">
          <v-select
            v-model="artist.role_id"
            :items="artistRoles"
            :rules="rules.role"
          >
            <template v-slot:label>
              Role <strong class="red--text">*</strong>
            </template>
          </v-select>
        </v-col>
        <!--ArtistHasSpotify?-->
        <v-col cols="12" md="6">
          <v-radio-group v-model="artist.is_spotify_profile">
            <template v-slot:label>
              Does the {{ artistType }} artist have a Spotify Artist Profile?
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
        <!--ArtistSpotifyURL-->
        <v-col v-if="artist.is_spotify_profile" cols="12">
          <v-text-field
            v-model="artist.spotify_profile_link"
            :rules="rules.urlRules"
            :label="`${artistType} Artist Spotify Artist Profile URL`"
            class="required"
            placeholder="Add Spotify Artist Profile URL"
          ></v-text-field>
        </v-col>
        <!--ArtistHasApple-->
        <v-col cols="12" md="6">
          <v-radio-group v-model="artist.is_apple_music_profile">
            <template v-slot:label>
              Does the {{ artistType }} artist have an Apple Music Artist Profile?
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
        <!--ArtistAppleURL-->
        <v-col v-if="artist.is_apple_music_profile" cols="12">
          <v-text-field
            v-model="artist.apple_music_profile_link"
            :rules="rules.urlRules"
            :label="`${artistType} Artist Apple Music Artist Profile URL`"
            class="required"
            placeholder="Add Apple Music Artist Profile URL"
          ></v-text-field>
        </v-col>
        <!--SecondaryArtistSave-->
        <v-col
          v-if="artistType === 'Secondary'"
          cols="12"
          class="d-flex justify-end distributionform-secondaryartist-actions"
        >
          <v-btn
            class="distributionform-secondaryartist-cancel"
            color="#EE3B8D"
            text
            small
            v-if="showCancel"
            @click="clearForm()"
          >
            Cancel
          </v-btn>
          <v-btn
            class="distributionform-secondaryartist-save"
            color="#EE3B8D"
            outlined
            dark
            small
            @click="saveArtist(artist)"
          >
            Save {{ artistType }} Artist
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>
<script>
export default {
  props: {
    artistData: {
      type: Object,
      default: () => null
    },
    artistType: {
      type: String,
      default: null
    },
    artistRoles: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      valid: false,
      booleanOptions: [
        { text: 'Yes', value: 1 },
        { text: 'No', value: 0 }
      ],
      rules: {
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
        artistRules: [
          (v) => !!v || 'Artist is required',
          (v) => (v && v.length >= 3) || 'Must be greater than 3 characters'
        ],
        role: [
          (v) => !!v || 'Role is required'
        ]
      },
      artist: {
        uuid: this.artistData ? this.artistData.uuid : null,
        artist_name: this.artistData ? this.artistData.artist_name : null,
        is_primary: this.artistType === 'Secondary' ? 0 : 1,
        is_spotify_profile: this.artistData ? this.artistData.is_spotify_profile : 0,
        spotify_profile_link: this.artistData ? this.artistData.spotify_profile_link : null,
        is_apple_music_profile: this.artistData ? this.artistData.is_apple_music_profile : 0,
        apple_music_profile_link: this.artistData ? this.artistData.apple_music_profile_link : null,
        role_id: this.artistData ? this.artistData.role_id : null,
        temp_id: this.uuidv4(),
        counter: 0
      },
      showCancel: false
    }
  },
  watch: {
    artist: {
      handler: function () {
        if (this.artistType === 'Primary') {
          this.$emit('save-artist', this.artist)
        }
      },
      deep: true
    },
    artistData: {
      handler: function (newVal) {
        this.artist = newVal
      },
      deep: true
    }
  },
  methods: {
    clearForm () {
      this.artist = {
        uuid: null,
        artist_name: null,
        is_primary: this.artistType === 'Secondary' ? 0 : 1,
        is_spotify_profile: 0,
        spotify_profile_link: null,
        is_apple_music_profile: 0,
        apple_music_profile_link: null,
        role_id: null,
        temp_id: this.uuidv4(),
        counter: 0
      }
      this.showCancel = false
      this.$refs.form.resetValidation()
    },
    saveArtist (artist) {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.$emit('save-artist', artist)
      this.clearForm()
    }
  }
}
</script>
<style>
</style>
