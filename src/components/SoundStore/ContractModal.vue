<template>
  <v-dialog v-model="dialog" max-width="800">
    <v-card>
      <v-card-title class="headline">{{ beat.name }} - Contract Example</v-card-title>
      <v-card-text>
        <non-exclusive-contract v-if="!pricing.exclusive && !beat.cents_beat" :beat="beat" :pricing="pricing" />
        <cents-contract v-else-if="beat.cents_beat" :beat="beat" :pricing="pricing" />
        <exclusive-contract v-else :beat="beat" :pricing="pricing" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import NonExclusiveContract from '@/components/SoundStore/Contracts/NonExclusiveContract'
import ExclusiveContract from '@/components/SoundStore/Contracts/ExclusiveContract'
import CentsContract from '@/components/SoundStore/Contracts/CentsContract'

export default {
  components: {
    NonExclusiveContract,
    ExclusiveContract,
    CentsContract
  },
  props: {
    beat: Object,
    pricing: Object
  },
  data: function () {
    return {
      dialog: false
    }
  },
  methods: {
    openModel: function () {
      this.dialog = true
    }
  }
}
</script>

<style>

</style>
