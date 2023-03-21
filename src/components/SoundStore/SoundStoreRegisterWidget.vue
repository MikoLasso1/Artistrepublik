<template>
  <div>
    <v-card>
      <v-card-title class="headline">
        <v-row>
          <v-col class="text-center">
            Sell on the Sound Store!
          </v-col>
        </v-row>

      </v-card-title>
      <v-card-text>
        <div class="text-center">
          <v-icon color="primary" size="100">mdi-music-circle</v-icon>
        </div>
        <div class="justify-center">
          <h2 class="text-center">Welcome to Sound Store</h2>
          <ul class="my-4">
            <li>List beats, sample packs, and samples to our growing network of over 100k+ artists</li>
            <li>Grow your revenue and reach as a producer</li>
            <li>Protect your rights through automated license auditing and pre-made license agreements</li>
            <li>List licensed and exclusive beats, accept offers and more</li>
          </ul>
        </div>
        <div class="text-center">
          <v-btn color="primary" @click="doRegister">Register</v-btn>
        </div>
      </v-card-text>
    </v-card>
    <register-modal ref="registerModal" />
  </div>
</template>

<script>
import RegisterModal from '@/components/SoundStore/RegisterModal'

export default {
  components: {
    RegisterModal
  },
  methods: {
    doRegister: function () {
      this.$refs.registerModal.openModal()
    }
  }
}
</script>

<style>

</style>
