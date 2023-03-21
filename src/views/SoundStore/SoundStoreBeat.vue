<template>
  <div>
    <v-base-header image="/img/sound-store/banner.png" />
    <navbar />
    <v-container fluid>
      <div v-if="!beat" class="text-center mt-4">
        <v-progress-circular indeterminate color="primary" />
      </div>
      <div v-else>
        <v-card dark class="soundstore-beat-card">
          <v-card-text>
            <v-container fluid>
              <v-row>
                <v-col cols="12" md="3">
                  <v-img :src="beat.img_url" max-width="300" alt="beat image" class="mx-auto mx-md-0" />
                </v-col>
                <v-col cols="12" md="9" class="soundstore-beat-section">
                  <v-row>
                    <v-col cols="12" md="8">
                      <div class="d-flex">
                        <h1 class="text-white">{{ beat.name }}</h1>
                        <v-btn icon color="white" class="ml-4">
                          <v-icon size="30" v-if="!isPlaying || paused" @click="playBeat(beat.uuid)">mdi-play-circle</v-icon>
                          <v-icon v-else @click="SET_PAUSED(true)">mdi-pause</v-icon>
                        </v-btn>
                        <v-tooltip v-if="isFeatured" right>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              icon outlined class="ml-4" v-bind="attrs"
                              v-on="on"
                            >
                              <v-icon>mdi-star-circle</v-icon>
                            </v-btn>
                          </template>
                          <span>Featured</span>
                        </v-tooltip>
                      </div>
                      <p>{{ beat.description }}</p>
                      <p>
                        Beat by
                        <router-link :to="`/features/sound-store/${beat.display_name}`">{{ beat.display_name }}</router-link>
                        <br />
                        <v-icon color="white" size="20">mdi-play</v-icon>
                        {{ beat.plays }} plays
                        &nbsp;
                        <v-icon color="white" size="20">mdi-metronome</v-icon>
                        {{ beat.bpm }} BPM
                        &nbsp;
                        <v-icon color="white" size="20">mdi-clock</v-icon>
                        {{ beat.created_at | formatDateWithMonthName }}
                      </p>
                      <p class="mb-0">
                        <span class="font-weight-bold">Moods:</span> {{ beat.mood_types.map(v => v.name).conjunction() }}
                      </p>
                      <p class="mb-0"><span class="font-weight-bold">Attributes:</span></p>
                      <ul>
                        <li v-for="(attribute, i) in beat.attributes" v-bind:key="i">
                          {{ attribute.name }}: {{ attribute.value }}
                        </li>
                      </ul>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-chip-group active-class="primary--text" column>
                        <v-chip v-for="style in beat.style_types" v-bind:key="style.id">#{{ style.name }}</v-chip>
                        <v-chip v-for="hashtag in beat.hashtags" v-bind:key="hashtag.id">#{{ hashtag.hashtag }}</v-chip>
                      </v-chip-group>
                    </v-col>
                  </v-row>
                  <div class="wave-wrapper">
                    <canvas id="wave" ref="waveCanvas" style="width: 100%; height: 100px; display: none;"></canvas>
                    <img v-if="!wave" src="/img/sound-store/wave.png" alt="wave" height="100px" />
                  </div>
                  <div class="text-center mt-4">
                    <v-badge
                      v-if="lowestBeatPricing.sale"
                      bordered
                      color="green"
                      icon="mdi-tag"
                      overlap
                    >
                      <v-btn v-if="lowestBeatPricing.amount" color="primary" class="m-1 ml-md-4" @click="openPricingModal">${{ lowestBeatPricing.amount }}</v-btn>
                    </v-badge>
                    <v-btn v-if="lowestBeatPricing.sale" class="text-decoration-line-through font-weight-bold">${{ lowestBeatPricing.lowestAmountWithoutSale }}</v-btn>
                    <v-btn v-else-if="lowestBeatPricing.amount" color="primary" class="m-1 ml-md-4" @click="openPricingModal">${{ lowestBeatPricing.amount }}</v-btn>
                    <v-btn class="m-1 ml-md-4" color="primary" @click="openOfferModal">Make Offer</v-btn>
                    <favorite-button class="m-1 d-inline-block ml-md-4" type="beat" :uuid="beat.uuid" />
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
        <listings-row
          class="mt-4"
          :listings="otherBeats"
          title="Other Beats by Producer"
          :loading="otherBeatsLoading"
          :link="`/features/sound-store/${beat.display_name}`"
        />
        <listings-row
          class="mt-4"
          :listings="similarBeats"
          title="Similar Beats"
          :loading="similarBeatsLoading"
        />
      </div>
    </v-container>
  </div>
</template>

<script>
import Vue from 'vue'
import Wave from '@foobar404/wave'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Navbar from '@/components/SoundStore/Navbar'
import ListingsRow from '@/components/SoundStore/ListingsRow'
import FavoriteButton from '@/components/SoundStore/FavoriteButton'

export default {
  components: {
    Navbar,
    ListingsRow,
    FavoriteButton
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
      beat: null,
      wave: null,
      otherBeats: null,
      otherBeatsLoading: false,
      similarBeats: [],
      similarBeatsLoading: false,
      beatUuid: this.$route.params.uuid
    }
  },
  computed: {
    ...mapGetters({
      isPlaying: 'SSAudioPlayer/getIsPlaying',
      paused: 'SSAudioPlayer/getPaused'
    }),
    lowestBeatPricing: function () {
      if (this.beat.pricing.length > 1) {
        let lowestAmount = [...this.beat.pricing].sort((a, b) => a.amount - b.amount)[0].amount
        let lowestSalePrice = [...this.beat.pricing].sort((a, b) => (b.sale_amount !== null) - (a.sale_amount !== null) || a.sale_amount - b.sale_amount)[0].sale_amount

        lowestSalePrice = parseFloat(lowestSalePrice)
        lowestAmount = parseFloat(lowestAmount)

        let amount = lowestSalePrice !== null && lowestSalePrice < lowestAmount ? lowestSalePrice : lowestAmount
        return { sale: lowestSalePrice !== null && lowestSalePrice < lowestAmount ? true : false, amount: amount, lowestAmountWithoutSale: lowestAmount }
      }
      if (this.beat.pricing.length > 0) {
        return { sale: false, amount: this.beat.pricing[0].amount }
      } else {
        return { sale: false, amount: false }
      }
    },
    isFeatured () {
      if (this.$route.params.featured) {
        return true
      }
      return false
    }
  },
  watch: {
    isPlaying: function (isPlaying) {
      if (isPlaying) {
        this.wave = new Wave()
        this.wave.fromElement('player', 'wave', { type: 'bars' })
        this.$refs.waveCanvas.style.display = 'block'
      } else {
        this.wave = null
        this.$refs.waveCanvas.style.display = 'none'
      }
    },
    '$route.params': {
      handler: async function (newValue) {
        const { uuid } = newValue
        this.beatUuid = uuid
        await this.getBeat()
        this.getOtherBeatsByProducer()
        this.getSimilarBeats()
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      playBeat: 'SSAudioPlayer/playBeat'
    }),
    ...mapMutations({
      SET_PAUSED: 'SSAudioPlayer/SET_PAUSED',
      setBeatPricingModalVisible: 'SSBeatPricingModal/SET_VISIBLE',
      setBeatPricingModalBeat: 'SSBeatPricingModal/SET_BEAT',
      setBeatOfferModalVisible: 'SSBeatOfferModal/SET_VISIBLE',
      setBeatOfferModalBeat: 'SSBeatOfferModal/SET_BEAT'
    }),
    openPricingModal: function () {
      this.setBeatPricingModalBeat(this.beat)
      this.setBeatPricingModalVisible(true)
    },
    getBeat: async function () {
      this.loading = true
      try {
        let { data: { data } } = await Vue.$http.get(`v1/sound-store/beat/${this.beatUuid}`)
        this.beat = data

        //if beat already sold as non-exclusive then remove exclusive price
        if (this.beat.beat_orders_count > 0) {
          for (let index = 0; index < this.beat.pricing.length; index++) {
            const pricing = this.beat.pricing[index]
            if (pricing.exclusive === 1) {
              this.beat.pricing.splice(index, 1)
            }
          }
        }
      } catch (err) {
        this.throwError(err)
      }
      this.loading = false
    },
    getOtherBeatsByProducer: async function () {
      this.otherBeatsLoading = true
      try {
        let { data: { data } } = await Vue.$http.get(`v1/sound-store/beat/search?artist=${this.beat.display_name}`)
        this.otherBeats = data
      } catch (err) {
        this.throwError(err)
      }
      this.otherBeatsLoading = false
    },
    getSimilarBeats: async function () {
      this.similarBeatsLoading = true
      try {
        let { data: { data } } = await Vue.$http.get(`v1/sound-store/beat/search?similar=${this.beat.uuid}&limit=11`)
        this.similarBeats = data
      } catch (err) {
        this.throwError(err)
      }
      this.similarBeatsLoading = false
    },
    openOfferModal: function () {
      this.setBeatOfferModalBeat(this.beat)
      this.setBeatOfferModalVisible(true)
    }
  },
  mounted: async function () {
    await this.getBeat()
    this.getOtherBeatsByProducer()
    this.getSimilarBeats()
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

.soundstore-beat-card {
  background: linear-gradient(180deg, rgba(2, 0, 36, 1) 0%, rgba(151, 56, 240, 1) 0%, rgba(0, 0, 0, 1) 100%);
}

.soundstore-beat-section {
  position: relative;
  z-index: 9;
}
</style>
