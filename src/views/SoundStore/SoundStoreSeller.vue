<template>
  <div>
    <v-base-header image="/img/sound-store/banner.png" />
    <navbar />
    <v-container fluid>
      <v-card :loading="loadingProfile" class="mx-auto" elevation="0">
        <template slot="progress">
          <v-progress-linear
            color="standard"
            height="10"
            indeterminate
          ></v-progress-linear>
        </template>
        <div
          class="profile-header d-flex justify-content-center"
          :style="coverImage"
          v-if="coverPhoto !== null"
        ></div>
        <div class="no-profile-header h-100 soundstore-beat-card v-card v-sheet theme--dark" v-else>
        </div>
        <v-card-text>
          <v-row class="top_row">
            <v-col cols="6" xl="3">
              <v-card class="mb-3 card-profile shadow">
                <v-row class="justify-content-center">
                  <div class="">
                    <v-col md="3" class="text-center" v-if="coverPhoto">
                      <v-avatar size="150px" class="top_profile_image">
                        <img alt="Avatar" :src="profile_photo">
                      </v-avatar>
                    </v-col>
                  </div>
                </v-row>
                <div class="pt-0">
                  <div class="text-center">
                    <h1 class="mb-1 pt-12">{{ $route.params.displayName }}</h1>
                    <h3 class="pt-0 pb-4">Producer</h3>
                  </div>
                </div>
              </v-card>
            </v-col>
            <v-col cols="6" xl="3">
              <stats-card
                title="Rep"
                color="red"
                :stat="repPoints"
                icon="mdi mdi-flare"
                class="mb-4 mb-xl-0"
              />
            </v-col>
            <v-col cols="6" xl="3">
              <stats-card
                title="Beats"
                color="orange"
                :stat="beatCount"
                icon="mdi mdi-music"
                class="mb-4 mb-xl-0"
              />
            </v-col>
            <v-col cols="6" xl="3">
              <stats-card
                title="Sample Packs"
                color="green"
                :stat="samplePacksCount"
                icon="mdi mdi-star"
                class="mb-4 mb-xl-0"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <div v-if="loadingBeats" class="text-center mt-4">
        <v-progress-circular indeterminate color="primary" />
      </div>
      <div v-else>
        <listings-row
          v-if="beat_listings.length > 0"
          class="mt-4"
          :listings="beat_listings"
          :title="'Beats By ' + $route.params.displayName"
          :hide-link="true"
        />
        <div class="text-center" v-if="beat_listings.length">
          <v-pagination
            v-model="beats_page"
            :length="lastBeatsPage"
            total-visible="6"
          ></v-pagination>
        </div>
      </div>
      <div v-if="loadingPacks && !loadingBeats" class="text-center mt-4">
        <v-progress-circular indeterminate color="primary" />
      </div>
      <div v-else>
        <listings-row
          v-if="sample_pack_listings.length > 0"
          class="mt-4"
          :listings="sample_pack_listings"
          :title="'Sample Packs By ' + $route.params.displayName"
          type="sample-packs"
          :hide-link="true"
        />
      </div>
      <div class="text-center" v-if="sample_pack_listings.length">
        <v-pagination
          v-model="sample_packs_page"
          :length="lastSamplePacksPage"
          total-visible="6"
        ></v-pagination>
      </div>

    </v-container>
  </div>
</template>

<script>
import Vue from 'vue'
import Navbar from '@/components/SoundStore/Navbar'
import ListingsRow from '@/components/SoundStore/ListingsRow'

export default {
  components: {
    Navbar,
    ListingsRow
  },
  metaInfo () {
    return {
      title: this.$route.params.displayName + ' | Sound Store',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: 'Artist Republik is a 360 degree platform offering artist submitted beats to support your sound! We offer mastering, distribution, playlisting, and more!'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content: `${this.$route.params.displayName} | Sound Store | The ONLY 360 degree Platform for Independent Artists`
        },
        {
          vmid: 'og:description',
          name: 'og:description',
          content: 'Artist Republik is a 360 degree platform offering artist submitted beats to support your sound! We offer mastering, distribution, playlisting, and more!'
        },
        {
          vmid: 'og:url',
          property: 'og:url',
          content: 'https://app.artistrepublik.com' + this.$route.fullPath
        },
        {
          vmid: 'twitter:title',
          property: 'twitter:title',
          content: `${this.$route.params.displayName} | Sound Store | The ONLY 360 degree Platform for Independent Artists`
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content: 'Artist Republik is a 360 degree platform offering artist submitted beats to support your sound! We offer mastering, distribution, playlisting, and more!'
        }
      ]
    }
  },
  data: function () {
    return {
      loading: true,
      loadingBeats: true,
      loadingPacks: true,
      loadingProfile: true,
      beat_listings: {},
      sample_pack_listings: {},
      beats_pagination: {},
      sample_pack_pagination: {},
      beats_page: 1,
      sample_packs_page: 1,
      beatCount: 0,
      samplePacksCount: 0,
      repPoints: 0,
      coverPhoto: null,
      profile_photo: null
    }
  },
  computed: {
    coverImage () {
      let cover = 'background-image: url(' + this.coverPhoto + ');'
      return cover
    },
    lastBeatsPage () {
      if (this.beats_pagination.hasOwnProperty('last_page')) {
        return this.beats_pagination.last_page
      } else {
        return 1
      }
    },
    lastSamplePacksPage () {
      if (this.sample_pack_pagination.hasOwnProperty('last_page')) {
        return this.sample_pack_pagination.last_page
      } else {
        return 1
      }
    }
  },
  methods: {
    async getUserProfile () {
      this.loadingProfile = true
      try {
        let { data: { data } } = await Vue.$http.get(
          `v1/sound-store/user/${this.$route.params.displayName}`
        )

        this.beatCount = data.beat_count
        this.samplePacksCount = data.sample_packs_count
        this.repPoints = data.rep_points
        this.coverPhoto = data.cover_photo
        this.profile_photo = data.profile_photo
      } catch (err) {
        this.throwError(err)
      }
      this.loadingProfile = false
    },
    async loadUserBeats (beats_page = 1) {
      // this.filteredBeatsProcessing = true;
      this.loadingBeats = true

      try {
        let data = await Vue.$http.post(
          `v1/sound-store/user/?page=${beats_page}`,
          {
            type: 'beats',
            display_name: this.$route.params.displayName
          }
        )
        this.beat_listings = data.data.data
        this.beats_pagination = data.data.meta
      } catch (err) {
        this.throwError(err)
      }
      this.loadingBeats = false
    },
    async loadUserSamplePacks (sample_pack_page = 1) {
      this.loadingPacks = true

      try {
        let data = await Vue.$http.post(
          `v1/sound-store/user/?page=${sample_pack_page}`,
          {
            type: 'sample_pack',
            display_name: this.$route.params.displayName
          }
        )
        this.sample_pack_listings = data.data.data
        this.sample_pack_pagination = data.data.meta
      } catch (err) {
        this.throwError(err)
      }
      this.loadingPacks = false
    }
  },
  watch: {
    beats_page: {
      handler: function () {
        this.loadUserBeats(this.beats_page)
      }
    },
    sample_packs_page: {
      handler: function () {
        this.loadUserSamplePacks(this.sample_packs_page)
      }
    }
  },
  mounted: async function () {
    await this.loadUserBeats()
    await this.loadUserSamplePacks()
    this.getUserProfile()
  }
}
</script>

<style>
.profile-header {
  position: relative;
  min-height: 300px;
  background-size: cover;
  background-position: center top;
}

.no-profile-header {
  min-height: 170px;
  background: linear-gradient(180deg, rgba(2, 0, 36, 1) 0%, rgba(151, 56, 240, 1) 0%, rgba(0, 0, 0, 1) 100%);

}

.top_profile_image {
  height: 150px;
  min-width: 150px;
  width: 150px;
  position: absolute;
  top: -120px;
  left: -59px;
}

.top_row {
  margin-top: -70px;
}
</style>
