<template>
  <v-dialog v-model="dialog" width="800">
    <v-card>
      <v-card-title class="headline">
        Pricing
        <v-spacer></v-spacer>
        <v-btn icon color="gray" @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text v-if="beat">
        <v-row>
          <v-col cols="12" md="4">
            <v-img :src="beat.img_url" max-width="200" style="margin: 0px auto;" />
            <h2 class="title secondary--text">
              {{ beat.name }}
              <v-btn color="primary" class="mt-3" v-if="alreadyInCart" text>Added To Cart</v-btn>
            </h2>
            By: {{ beat.display_name }}
            <br />
            BPM: {{ beat.bpm }}
            <br />
            Moods: {{ beat.mood_types.map(v => v.name).join(', ') }}

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" icon @click="play" v-bind="attrs" v-on="on">
                  <v-icon size="40">mdi-play-circle</v-icon>
                </v-btn>
              </template>
              <span>Play</span>
            </v-tooltip>

            <v-chip-group active-class="primary--text" column>
              <v-chip v-for="style in beat.style_types" v-bind:key="style.id">#{{ style.name }}</v-chip>
              <v-chip v-for="hashtag in beat.hashtags" v-bind:key="hashtag.id">#{{ hashtag.hashtag }}</v-chip>
            </v-chip-group>
          </v-col>
          <v-col cols="12" md="8">
            <v-alert
              text
              type="success"
              v-if="itemAdded"
            >Item Added to Cart
            </v-alert>
            <v-expansion-panels accordion>
              <template v-for="pricing in beat.pricing">
                <v-expansion-panel v-bind:key="pricing.id" v-if="showExclusive(pricing)">
                  <v-expansion-panel-header>
                    <v-row no-gutters class="align-center">
                      <v-col cols="6">
                        <h3 class="h3">{{ pricing.name }}{{ pricing.exclusive ? ' - Exclusive' : '' }}</h3>
                        {{ pricing.download_types.conjunction() }}
                      </v-col>
                      <v-col cols="6" class="text-right">
                        <v-btn color="primary" outlined>${{ pricing.sale_amount ? pricing.sale_amount : pricing.amount }}</v-btn>
                      </v-col>
                    </v-row>
                    <span class="mx-2 hidden-sm-and-down" style="max-width: 46px;">Details</span>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row>
                      <v-col md="6" cols="12">
                        <v-icon size="16" color="primary">mdi-microphone</v-icon>
                        {{ pricing.music_recording ? `Can be used in recording` : `Cannot be used in recording` }}
                        <br />
                        <v-icon size="16" color="primary">mdi-access-point</v-icon>
                        {{ pricing.online_streams ? `${pricing.online_streams} online streams` : 'Unlimited online streams' }}
                        <br />
                        <v-icon size="16" color="primary">mdi-microphone-variant</v-icon>
                        {{ pricing.for_profit_performances ? `For profit live performances` : `No live performances` }}
                      </v-col>
                      <v-col md="6" cols="12">
                        <v-icon size="16" color="primary">mdi-album</v-icon>
                        {{ pricing.distribute_amount ? `Distribute up to ${pricing.distribute_amount} copies` : `Distribute unlimited copies` }}
                        <br />
                        <v-icon size="16" color="primary">mdi-video</v-icon>
                        {{ pricing.music_videos ? `${pricing.music_videos} music videos` : `Unlimited music videos` }}
                        <br />
                        <v-icon size="16" color="primary">mdi-radio</v-icon>
                        {{ pricing.radio_rights ? `Radio broadcasting rights` : `No radio broadcasting rights` }}
                        <p class="text-right">
                          <v-btn color="primary" class="mt-3" @click="addBeat(pricing.id)" v-if="alreadyInCart === 0">Add To Cart</v-btn>
                        </p>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </template>
            </v-expansion-panels>
            <div class="text-center mt-4">
              <v-btn color="primary" @click="openOfferModal">Make Offer</v-btn>
            </div>
          </v-col>
        </v-row>
        <ShowCheckoutModal ref="checkoutModal" @closeModal="closeModal" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ShowCheckoutModal from '@/components/SoundStore/ShowCheckoutModal'

export default {
  components: {
    ShowCheckoutModal
  },
  data: function () {
    return {
      dialog: false,
      alreadyInCart: 0,
      itemAdded: false
    }
  },
  computed: {
    ...mapGetters({
      beat: 'SSBeatPricingModal/getBeat',
      cart: 'SSCart/getCart'
    })
  },
  watch: {
    dialog: function (v) {
      if (!v) {
        this.setVisible(false)
      }
    }
  },
  methods: {
    ...mapActions({
      playBeat: 'SSAudioPlayer/playBeat',
      nowPlaying: 'SSAudioPlayer/nowPlaying',
      updateCartRecord: 'SSCart/updateCartRecord'
    }),
    closeModal: function () {
      this.dialog = false
    },
    ...mapMutations({
      setVisible: 'SSBeatPricingModal/SET_VISIBLE',
      addBeatToCart: 'SSCart/ADD_BEAT_TO_CART',
      setBeatOfferModalVisible: 'SSBeatOfferModal/SET_VISIBLE',
      setBeatOfferModalBeat: 'SSBeatOfferModal/SET_BEAT'
    }),
    openModal: function () {
      this.dialog = true
      this.itemAdded = false
      let beat = { ...this.beat }
      let item = this.cart.beats.filter(v => v.uuid === beat.uuid)
      this.alreadyInCart = item.length
    },
    play: function () {
      this.nowPlaying(this.beat)
      this.playBeat(this.beat.uuid)
    },
    addBeat: function (pricingId) {
      let beat = { ...this.beat }
      beat['pricing_id'] = pricingId
      this.addBeatToCart(beat)
      this.alreadyInCart = 1
      this.itemAdded = true
      this.$refs.checkoutModal.openModal()
      this.updateCartRecord()
    },
    openOfferModal: function () {
      this.setBeatOfferModalBeat(this.beat)
      this.setBeatOfferModalVisible(true)
    },
    showExclusive (pricing) {
      if (pricing.exclusive === 1) {
        if (this.beat.beat_orders_count === 0 || this.beat.beat_orders_count === null) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    }
  }
}
</script>

<style>
.v-system-bar {
  z-index: 111111;
}
</style>
