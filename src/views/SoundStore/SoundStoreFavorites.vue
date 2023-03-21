<template>
  <div>
    <v-base-header image="/img/sound-store/banner.png" />
    <navbar />
    <v-container fluid>
      <div v-if="!loaded" class="text-center mt-4">
        <v-progress-circular indeterminate color="primary" />
      </div>
      <div v-else-if="beats.length > 0 || samplePacks.length > 0">
        <listings-row
          v-if="beats.length > 0"
          :listings="beats"
          title="Beats"
          :hide-link="true"
        />
        <listings-row
          v-if="samplePacks.length > 0"
          :listings="samplePacks"
          title="Sample Packs"
          :hide-link="true"
          type="sample-packs"
        />
      </div>
      <div v-else>
        <v-row justify="center">
          <v-col md="6" class="text-center">
            <v-card class="mt-5 mb-5">
              <v-card-text>
                <div class="text-h3 text-center">You have no favorites!</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Navbar from '@/components/SoundStore/Navbar'
import ListingsRow from '@/components/SoundStore/ListingsRow'

export default {
  components: {
    Navbar,
    ListingsRow
  },
  computed: {
    ...mapGetters({
      favorites: 'SSFavorites/getFavorites',
      loaded: 'SSFavorites/getLoaded'
    }),
    beats: function () {
      let beats = []
      this.favorites.filter(v => v.type === 'beat').forEach(v => beats.push(v.beat))
      return beats
    },
    samplePacks: function () {
      let samplePacks = []
      this.favorites.filter(v => v.type === 'sample-pack').forEach(v => samplePacks.push(v.sample_pack))
      return samplePacks
    }
  }
}
</script>

<style>

</style>
