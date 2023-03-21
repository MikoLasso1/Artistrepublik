<template>
  <v-dialog v-model="dialog" persistent max-width="400">
    <v-card>
      <v-card-title class="headline">
        Ready To Checkout?
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" @click="redirectCart">
          Checkout
        </v-btn>
        <v-btn color="green darken-1" text @click="continueShopping">
          Continue Shopping
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialog: false
    }
  },
  methods: {
    openModal: function () {
      this.dialog = true
    },
    redirectCart: function () {
      this.dialog = false
      this.$emit('closeModal')
      this.$router.push({ path: '/features/sound-store/cart' })
    },
    continueShopping: function () {
      this.$emit('closeModal')
      this.dialog = false
    }

  }
}
</script>
