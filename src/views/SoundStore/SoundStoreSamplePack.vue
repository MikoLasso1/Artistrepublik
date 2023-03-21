<template>
  <div>
    <v-base-header image="/img/sound-store/banner.png" />
    <navbar />
    <v-container fluid>
      <div v-if="!samplePack" class="text-center mt-4">
        <v-progress-circular indeterminate color="primary" />
      </div>
      <div v-else>
        <v-card dark class="soundstore-samplepack-card">
          <v-card-text>
            <v-container fluid>
              <v-row>
                <v-col cols="12" md="3">
                  <v-img :src="samplePack.img_url" max-width="300" class="mx-auto mx-md-0" />
                </v-col>
                <v-col cols="12" md="9">
                  <v-row>
                    <v-col cols="12" md="8">
                      <div class="d-flex">
                        <h1 class="h1 white--text">{{ samplePack.name }}</h1>
                        <v-tooltip v-if="isFeatured" right>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon outlined class="ml-4" v-bind="attrs" v-on="on">
                              <v-icon>mdi-star-circle</v-icon>
                            </v-btn>
                          </template>
                          <span>Featured</span>
                        </v-tooltip>
                      </div>
                      <p>{{ samplePack.description }}</p>
                      <p>
                        Sample Pack by
                        <router-link :to="`/features/sound-store/${samplePack.display_name}`">{{ samplePack.display_name }}</router-link>
                        <br />
                        <v-icon color="white" size="20">mdi-clock</v-icon>
                        {{ samplePack.created_at | formatDateWithMonthName }}
                      </p>
                      <p class="mb-0">
                        <span class="font-weight-bold">Moods:</span> {{ samplePack.mood_types.map(v => v.name).conjunction() }}
                      </p>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-chip-group active-class="primary--text" column>
                        <v-chip v-for="hashtag in samplePack.hashtags" v-bind:key="hashtag.id">#{{ hashtag.hashtag }}</v-chip>
                      </v-chip-group>
                    </v-col>
                  </v-row>
                  <div class="text-center mt-4">
                    <v-btn color="primary" class="m-1 ml-md-4" v-if="packAddedToCart || alreadyInCart">Added To Cart</v-btn>
                    <v-btn color="primary" class="m-1 ml-md-4" @click="addPackToCart(samplePack)" v-else>${{ samplePack.amount }}</v-btn>
                    <favorite-button class="ml-4 d-inline-block" type="sample-pack" :uuid="samplePack.uuid" />
                  </div>
                </v-col>
              </v-row>
            </v-container>
            <samples-table :samples="samplePack.samples" :sample-pack="samplePack" class="mt-4" />
            <ShowCheckoutModal ref="checkoutModal" />
          </v-card-text>
        </v-card>
        <listings-row
          class="mt-4"
          :listings="otherSamplePacks"
          title="Other Sample Packs by Producer"
          :loading="otherSamplePacksLoading"
          type="sample-packs"
        />
        <listings-row
          class="mt-4"
          :listings="similarSamplePacks"
          title="Similar Sample Packs"
          :loading="similarSamplePacksLoading"
          type="sample-packs"
        />
      </div>
    </v-container>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Navbar from '@/components/SoundStore/Navbar'
import ListingsRow from '@/components/SoundStore/ListingsRow'
import SamplesTable from '@/components/SoundStore/SamplesTable'
import FavoriteButton from '@/components/SoundStore/FavoriteButton'
import ShowCheckoutModal from '@/components/SoundStore/ShowCheckoutModal'

export default {
  components: {
    Navbar,
    ListingsRow,
    SamplesTable,
    FavoriteButton,
    ShowCheckoutModal
  },
  metaInfo () {
    return {
      title: 'Sound Store',
      meta: [
        { vmid: 'description', name: 'description', content: 'Artist Republik is a 360 degree platform offering artist submitted beats and samples to support your sound!' },
        { vmid: 'og:title', property: 'og:title', content: 'Sound Store | Artist Republik' }
      ]
    }
  },
  data: function () {
    return {
      loading: false,
      samplePack: null,
      wave: null,
      otherSamplePacks: null,
      otherSamplePacksLoading: false,
      similarSamplePacks: [],
      similarSamplePacksLoading: false,
      packAddedToCart: false,
      alreadyInCart: null,
      sampleUuid: this.$route.params.uuid
    }
  },
  computed: {
    ...mapGetters({
      isPlaying: 'SSAudioPlayer/getIsPlaying',
      paused: 'SSAudioPlayer/getPaused',
      cart: 'SSCart/getCart'
    }),
    isFeatured () {
      if (this.$route.params.featured) {
        return true
      }
      return false
    }
  },
  methods: {
    ...mapActions({
      playSample: 'SSAudioPlayer/playSample',
      updateCartRecord: 'SSCart/updateCartRecord'
    }),
    ...mapMutations({
      SET_PAUSED: 'SSAudioPlayer/SET_PAUSED',
      addSamplePackToCart: 'SSCart/ADD_SAMPLE_PACK_TO_CART'
    }),
    getSamplePack: async function () {
      if (this.loading === false) {
        this.loading = true
        try {
          let { data: { data } } = await Vue.$http.get(`v1/sound-store/sample-pack/${this.sampleUuid}`)
          this.samplePack = data

          this.otherSamplePacksLoading = true
          let dataArtist = await Vue.$http.get(`v1/sound-store/sample-pack/search?artist=${this.samplePack.display_name}`)
          this.otherSamplePacks = dataArtist.data.data
          this.otherSamplePacksLoading = false

          this.similarSamplePacksLoading = true
          let similarUuid = await Vue.$http.get(`v1/sound-store/sample-pack/search?similar=${this.sampleUuid}&limit=11`)
          this.similarSamplePacks = similarUuid.data.data
          this.similarSamplePacksLoading = false

          let item = this.cart.samplePacks.filter(v => v.uuid === this.samplePack.uuid)
          this.alreadyInCart = item.length
        } catch (err) {
          this.throwError(err)
        }
      }
      this.loading = false
    },
    addPackToCart (samplePack) {
      this.packAddedToCart = true
      this.addSamplePackToCart(samplePack)
      this.$refs.checkoutModal.openModal()
      this.updateCartRecord()
    }
  },
  mounted: async function () {
    await this.getSamplePack()
  },
  watch: {
    '$route.params': {
      handler (newValue) {
        const { uuid } = newValue
        this.sampleUuid = uuid
        this.getSamplePack()
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.wave-wrapper {
  width: 100%;
  overflow: hidden;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: -1;
  opacity: .25;
}

.soundstore-samplepack-card {
  background: linear-gradient(180deg, rgba(2, 0, 36, 1) 0%, rgba(151, 56, 240, 1) 0%, rgba(0, 0, 0, 1) 100%);
}
</style>
