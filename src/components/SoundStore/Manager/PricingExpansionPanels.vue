<template>
  <div>
    <v-expansion-panels accordion>
      <pricing-panel
        v-for="(price, i) in pricing"
        v-bind:key="price.id || price.name"
        :price="price"
        :index="i"
        :id="price.id"
        @delete="removePricing"
        @saved="savePricing"
      />
    </v-expansion-panels>
    <div class="text-center mt-4">
      <v-btn color="primary" @click="addPrice">Add Price</v-btn>
    </div>
  </div>
</template>

<script>
import PricingPanel from '@/components/SoundStore/Manager/PricingPanel'

export default {
  components: {
    PricingPanel
  },
  props: {
    value: null
  },
  data: function () {
    return {
      pricing: this.value,
      emptyPricing: {
        name: 'Price Name',
        amount: 19.99,
        download_types: ['WAV'],
        music_recording: 1,
        distribute_amount: 100,
        online_streams: 10000,
        music_videos: 1,
        for_profit_performances: 1,
        radio_rights: 1,
        exclusive: 0
      }
    }
  },
  watch: {
    value: function (pricing) {
      this.pricing = pricing
    }
  },
  methods: {
    removePricing: function (index) {
      this.pricing.splice(index, 1)
    },
    savePricing: function (index, form) {
      if (this.pricing.indexOf(index)) {
        this.pricing[index] = form
      } else {
        this.pricing.push(form)
      }
      this.$emit('input', this.pricing)
    },
    addPrice: function () {
      this.pricing.push({ ...this.emptyPricing })
    }
  }
}
</script>

<style>

</style>
