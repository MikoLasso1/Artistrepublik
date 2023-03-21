<template>
  <div>
    <v-row align="center">
      <v-col md="6" cols="12">
        <img :src="samplePack.img_url" aspect-ratio="1" alt="samplepack image" width="110" cover />
        <div class="text ml-2">
          <span class="d-block">{{ samplePack.name }}</span>
          <span class="primary--text" v-if="samplePack.samples.length !== 1">({{ samplePack.samples.length }} Samples)</span><span v-else class="primary--text">(1 Sample)</span>
        </div>
      </v-col>
      <v-col md="6" cols="12">
        <div class="text-center text-md-right">
          <span class="text">${{ samplePack.amount }}</span>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                color="primary"
                v-bind="attrs"
                v-on="on"
                @click="removeSamplePack(samplePack)"
              >
                <v-icon>mdi-cart-remove</v-icon>
              </v-btn>
            </template>
            <span>Remove from Cart</span>
          </v-tooltip>
        </div>
      </v-col>
    </v-row>
    <v-divider></v-divider>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: {
    samplePack: Object
  },
  methods: {
    ...mapMutations({
      removeSamplePack: 'SSCart/REMOVE_SAMPLE_PACK_FROM_CART'
    })
  }
}
</script>

<style lang="scss" scoped>
.text {
  display: inline-block;
  font-size: 15px;
}
</style>
