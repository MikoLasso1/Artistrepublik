<template>
  <div>
    <v-row align="center">
      <v-col md="6" cols="12">
        <img :src="sample.img_url" aspect-ratio="1" alt="sample image" width="110" cover />
        <span class="text ml-2">{{ sample.name }}</span>
      </v-col>
      <v-col md="6" cols="12">
        <div class="text-center text-md-right">
          <span class="text">${{ sample.amount }}</span>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                color="primary"
                v-bind="attrs"
                v-on="on"
                @click="removeSample(sample)"
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
    sample: Object
  },
  methods: {
    ...mapMutations({
      removeSample: 'SSCart/REMOVE_SAMPLE_FROM_CART'
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
