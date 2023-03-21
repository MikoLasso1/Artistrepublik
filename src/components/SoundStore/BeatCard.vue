<template>
  <v-card class="mx-auto soundstore-beatcard card">
    <v-hover>
      <template v-slot:default="{ hover }">
        <div class="img-wrap">
          <v-img :src="beat.img_url" aspect-ratio="1" height="150" cover />
          <v-fade-transition>
            <v-overlay v-if="hover" absolute color="#036358">
              <v-btn
                color="primary"
                :to="`/features/sound-store/beat/${beat.uuid}`"
              >View Beat
              </v-btn
              >
            </v-overlay>
          </v-fade-transition>
        </div>
      </template>
    </v-hover>
    <v-card-title>
      <h2 class="font-weight-light text-truncate">
        {{ beat.name }}
      </h2>
    </v-card-title>
    <v-card-subtitle>
      <router-link :to="`/features/sound-store/${beat.display_name}`">{{ beat.display_name }}</router-link>
    </v-card-subtitle>
    <v-card-text class="pt-2">
      <v-row class="m-0">
        <div class="subtitle-1">
          <div v-if="lowestBeatPricing.sale">
            <v-badge
              bordered
              color="green"
              icon="mdi-tag"
              overlap
            >
              <v-btn
                outlined color="primary" @click="openPricingModal"
              >${{ lowestBeatPricing.amount }}
              </v-btn
              >
            </v-badge>
            <v-btn class="text-decoration-line-through font-weight-bold" text>${{ lowestBeatPricing.lowestAmountWithoutSale }}</v-btn>
          </div>
          <v-btn
            v-else outlined color="primary" @click="openPricingModal"
          >${{ lowestBeatPricing.amount }}
          </v-btn
          >
        </div>
      </v-row>
      <v-chip-group column class="soundstore-beatcard-genres">
        <v-chip class="mx-1">{{ beat.genre }}</v-chip>
        <v-chip class="mx-1">{{ beat.sub_genre }}</v-chip>
      </v-chip-group>
      <div v-if="showMore">
        <p class="soundstore-beatcard-text"><span>Plays:</span> {{ beat.plays }}</p>
        <p class="soundstore-beatcard-text"><span>BPM:</span> {{ beat.bpm }}</p>
        <h2 class="soundstore-beatcard-heading" v-if="beat && beat.mood_types.length !== 0">Mood</h2>
        <v-chip-group class="soundstore-beatcard-chipgroup" column>
          <v-chip
            v-for="tag in beat.mood_types"
            :key="tag.id"
            color="purple darken-2"
            dark
          >
            {{ tag.name }}
          </v-chip>
        </v-chip-group>
        <h2 class="soundstore-beatcard-heading" v-if="beat && beat.style_types.length !== 0">Style</h2>
        <v-chip-group class="soundstore-beatcard-chipgroup" column>
          <v-chip
            v-for="tag in beat.style_types"
            :key="tag.id"
            color="green darken-2"
            dark
          >
            {{ tag.name }}
          </v-chip>
        </v-chip-group>
        <h2 class="soundstore-beatcard-heading" v-if="beat && beat.style_types.length !== 0 || beat && beat.hashtags.length !== 0">Keywords</h2>
        <v-chip-group class="soundstore-beatcard-chipgroup" active-class="primary--text" column>
          <v-chip
            color="black" dark v-for="style in beat.style_types" v-bind:key="style.id"
          >#{{ style.name }}
          </v-chip
          >
          <v-chip
            color="black" dark v-for="hashtag in beat.hashtags" v-bind:key="hashtag.id"
          >#{{ hashtag.hashtag }}
          </v-chip
          >
        </v-chip-group>
      </div>
    </v-card-text>
    <v-spacer />
    <v-card-actions justify="center">
      <v-btn
        color="primary"
        small
        :to="`/features/sound-store/beat/${beat.uuid}`"
      >View Beat
      </v-btn>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-if="beat.is_free_download"
            color="primary"
            icon
            @click="download"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon size="40">mdi-download-circle</v-icon>
          </v-btn>
        </template>
        <span>Download</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" icon @click="play" v-bind="attrs" v-on="on">
            <v-icon size="40">mdi-play-circle</v-icon>
          </v-btn>
        </template>
        <span>Play</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" icon @click="showDetails" v-bind="attrs" v-on="on">
            <v-icon size="40">{{ detailsIcon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ detailsIconText }}</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'BeatCard',
  props: {
    beat: Object
  },
  data () {
    return {
      showMore: false
    }
  },
  computed: {
    detailsIcon () {
      return this.showMore ? 'mdi-chevron-up' : 'mdi-chevron-down'
    },
    detailsIconText () {
      return this.showMore ? 'Show Less' : 'Show More'
    },
    lowestBeatPricing: function () {
      if (this.beat.pricing.length > 1) {
        let lowestAmount = [...this.beat.pricing].sort(
          (a, b) => a.amount - b.amount
        )[0].amount

        let lowestSalePrice = [...this.beat.pricing].sort(
          (a, b) =>
            (b.sale_amount !== null) - (a.sale_amount !== null) ||
            a.sale_amount - b.sale_amount
        )[0].sale_amount

        lowestSalePrice = parseFloat(lowestSalePrice)
        lowestAmount = parseFloat(lowestAmount)

        let amount =
          lowestSalePrice !== null && lowestSalePrice < lowestAmount
            ? lowestSalePrice
            : lowestAmount
        return {
          sale:
            lowestSalePrice !== null && lowestSalePrice < lowestAmount
              ? true
              : false,
          amount: amount,
          lowestAmountWithoutSale: lowestAmount
        }
      }
      return { sale: false, amount: this.beat.pricing[0].amount }
    }
  },
  methods: {
    ...mapActions({
      nowPlaying: 'SSAudioPlayer/nowPlaying',
      playBeat: 'SSAudioPlayer/playBeat'
    }),
    ...mapMutations({
      setBeatPricingModalVisible: 'SSBeatPricingModal/SET_VISIBLE',
      setBeatPricingModalBeat: 'SSBeatPricingModal/SET_BEAT'
    }),
    play: function () {
      this.playBeat(this.beat.uuid)
      this.nowPlaying(this.beat)
      console.log(this.beat, 'card')
    },
    showDetails () {
      this.showMore = !this.showMore
    },
    download: async function () {
      try {
        let {
          data: { data }
        } = await Vue.$http.get(
          `v1/sound-store/beat/free-download/${this.beat.uuid}`
        )
        var file_path = data.url
        var a = document.createElement('a')
        a.href = file_path
        a.download = file_path.substr(file_path.lastIndexOf('/') + 1)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } catch (err) {
        this.throwError(err)
      }
    },
    openPricingModal: function () {
      this.setBeatPricingModalBeat(this.beat)
      this.setBeatPricingModalVisible(true)
    }
  },
  mounted () {
    if (this.beat) {
      //if beat already sold as non-exclusive then remove exclusive price
      if (this.beat.beat_orders_count > 0) {
        for (let index = 0; index < this.beat.pricing.length; index++) {
          const pricing = this.beat.pricing[index]
          if (pricing.exclusive === 1) {
            this.beat.pricing.splice(index, 1)
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.img-wrap {
  position: relative;
}

.soundstore-beatcard-genres {
  display: flex;
  align-items: flex-end;
  margin: 0 0 10px;
}

.soundstore-beatcard-heading,
.soundstore-beatcard-text {
  font-size: 0.875rem;
  margin: 0;
}

.soundstore-beatcard-text {
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  text-transform: uppercase;
  color: #32325d;
}

.soundstore-beatcard-text:nth-child(2) {
  margin: 0 0 10px;
}

.soundstore-beatcard-chipgroup {
  margin: 0 0 10px;
}

@media screen and (min-width: 576px) {
  .soundstore-beatcard-genres {
    min-height: 88px;
  }
}
</style>
