<template>
  <div>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="samples"
      show-select
      item-key="uuid"
      class="transparent"
    >
      <template #item.pack="{ item }">
        <div class="d-flex align-center">
          <v-img :src="samplePack.img_url" max-width="50" />
          <v-btn icon color="white" class="mx-4" style="margin-top: 2px;">
            <v-icon size="30" v-if="!isPlaying || paused || playingUuid !== item.uuid" @click="playSample(item.uuid)">mdi-play-circle</v-icon>
            <v-icon v-else @click="SET_PAUSED(true)">mdi-pause</v-icon>
          </v-btn>
          <canvas :id="`wave${item.uuid}`" :ref="`waveCanvas${item.uuid}`" style="width: 200px; height: 50px;"></canvas>
        </div>
      </template>
      <template #item.name="{ item }">
        {{ item.name }}
        <ul>
          <li v-for="(attribute, i) in item.attributes" v-bind:key="i">
            <span class="caption">{{ attribute.name }}: {{ attribute.value }}</span>
          </li>
        </ul>
      </template>
      <template #item.amount="{ item }">
        ${{ item.amount }}
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex align-center">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-if="samplePack.is_free_download"
                color="primary"
                icon
                @click="download(item.uuid)"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon size="30">mdi-download-circle</v-icon>
              </v-btn>
            </template>
            <span>Download</span>
          </v-tooltip>
        </div>
      </template>
      <template #top>
        <div class="d-flex">
          <v-spacer></v-spacer>
          <v-tooltip v-if="selected.length > 0" top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mr-4 mt-4"
                color="primary"
                v-bind="attrs"
                v-on="on"
                @click="addSelectedToCart"
              >
                ${{ selectedPrice }}
              </v-btn>
            </template>
            <span>{{ addToCartText }}</span>
          </v-tooltip>
          <v-btn
            class="mt-4"
            color="primary"
            text
            v-if="addToCartText === 'Added to Cart'"
          >
            Added to Cart
          </v-btn>
        </div>
      </template>
    </v-data-table>
    <ShowCheckoutModal ref="checkoutModal" />
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Wave from '@foobar404/wave'
import ShowCheckoutModal from '@/components/SoundStore/ShowCheckoutModal'

export default {
  components: {
    ShowCheckoutModal
  },
  props: {
    samples: Array,
    samplePack: Object
  },
  data: function () {
    return {
      selected: [],
      headers: [
        { text: 'Pack', value: 'pack', width: '25%', sortable: false },
        { text: 'Name', value: 'name' },
        { text: 'BPM', value: 'bpm' },
        { text: 'Price', value: 'amount' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      addToCartText: 'Add to Cart'
    }
  },
  computed: {
    ...mapGetters({
      isPlaying: 'SSAudioPlayer/getIsPlaying',
      paused: 'SSAudioPlayer/getPaused',
      playingUuid: 'SSAudioPlayer/getUuid',
      cart: 'SSCart/getCart'
    }),
    selectedPrice: function () {
      return Math.round(this.selected.reduce((n, { amount }) => n + parseFloat(amount), 0) * 100) / 100
    }
  },
  watch: {
    isPlaying: function (isPlaying) {
      if (isPlaying) {
        this.wave = new Wave()
        this.wave.fromElement('player', `wave${this.playingUuid}`, { type: 'bars' })
        this.$refs[`waveCanvas${this.playingUuid}`].style.display = 'block'
      } else {
        this.wave = null
        this.$refs[`waveCanvas${this.playingUuid}`].style.display = 'none'
      }
    },
    selected: function (newVal, oldVal) {
      if (oldVal.length > newVal.length) {
        oldVal.filter(v => !newVal.includes(v)).forEach(v => this.removeSampleFromCart(v))
      }
      this.addToCartText = 'Add to Cart'
    }
  },
  methods: {
    ...mapActions({
      playSample: 'SSAudioPlayer/playSample',
      updateCartRecord: 'SSCart/updateCartRecord'
    }),
    ...mapMutations({
      SET_PAUSED: 'SSAudioPlayer/SET_PAUSED',
      addSampleToCart: 'SSCart/ADD_SAMPLE_TO_CART',
      removeSampleFromCart: 'SSCart/REMOVE_SAMPLE_FROM_CART',
      addSamplePackToCart: 'SSCart/ADD_SAMPLE_PACK_TO_CART'

    }),
    download: async function (uuid) {
      try {
        let { data: { data } } = await Vue.$http.get(`v1/sound-store/sample-pack/sample/free-download/${uuid}`)
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
    addSelectedToCart: function () {
      if (this.selected.length === this.samples.length) {
        this.addSamplePackToCart(this.samplePack)
      } else {
        this.selected.forEach(v => {
          v['img_url'] = this.samplePack.img_url
          this.addSampleToCart(v)
        })
      }
      this.addToCartText = 'Added to Cart'
      this.$refs.checkoutModal.openModal()
      this.updateCartRecord()
    }
  },
  mounted: function () {
    if (this.cart.samples.length > 0) {
      let selected = []
      this.cart.samples.forEach(v => {
        this.samples.forEach(v2 => {
          if (v.uuid === v2.uuid) {
            selected.push(v)
          }
        })
      })
      this.selected = selected
    }
  }
}
</script>

<style lang="scss">
.v-data-table.transparent {
  background: transparent;
}
</style>
