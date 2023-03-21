<template>
  <div>
    <v-row align="center">
      <v-col md="7" cols="12">
        <img :src="beat.img_url" aspect-ratio="1" width="110" alt="beat image" cover />
        <div class="text ml-2">
          <span class="d-block">{{ beat.name }}</span>
          <span class="primary--text text">({{ pricing.name ? `${pricing.name}` : `Offer` }})</span>
        </div>

      </v-col>
      <v-col md="5" cols="12">
        <div class="text-center text-md-right">
          <span class="text">${{ price }}</span>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                color="primary"
                v-bind="attrs"
                v-on="on"
                @click="removeBeat(beat)"
              >
                <v-icon>mdi-cart-remove</v-icon>
              </v-btn>
            </template>
            <span>Remove from Cart</span>
          </v-tooltip>
          <v-btn color="primary" @click="$refs.contractModal.openModel()" small>View Contract</v-btn>
        </div>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <contract-modal :beat="beat" :pricing="pricing" ref="contractModal" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import ContractModal from '@/components/SoundStore/ContractModal'

export default {
  components: {
    ContractModal
  },
  props: {
    beat: Object
  },
  computed: {
    price: function () {
      if ('offer' in this.beat) {
        return this.beat.offer.amount
      }
      let pricing = this.beat.pricing.filter(v => v.id === this.beat.pricing_id)[0]
      return pricing.sale_amount ? pricing.sale_amount : pricing.amount
    },
    pricing: function () {
      if ('offer' in this.beat) {
        return this.beat.offer
      }
      return this.beat.pricing.filter(v => v.id === this.beat.pricing_id)[0]
    }
  },
  methods: {
    ...mapMutations({
      removeBeat: 'SSCart/REMOVE_BEAT_FROM_CART',
      setBeatPricingModalVisible: 'SSBeatPricingModal/SET_VISIBLE',
      setBeatPricingModalBeat: 'SSBeatPricingModal/SET_BEAT'
    }),
    openPricingModal: function () {
      this.setBeatPricingModalBeat(this.beat)
      this.setBeatPricingModalVisible(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.text {
  display: inline-block;
  font-size: 15px;
}
</style>
