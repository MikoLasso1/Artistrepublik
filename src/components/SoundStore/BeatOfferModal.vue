<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card v-if="beat">
      <v-card-title class="headline">
        Beat Offer - {{ beat.name }}
        <v-spacer></v-spacer>
        <v-btn icon color="gray" @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div v-if="!done">
          <p>Make an offer for exclusive rights to this beat.</p>
          <v-alert
            outlined
            type="info"
          >There will be a 30% upcharge fee that will be added to your offer.
          </v-alert>
          <v-form v-model="valid" @submit.prevent="onSubmit" ref="form">
            <v-text-field
              v-model="amount"
              label="Price"
              prepend-icon="mdi-currency-usd"
              type="number"
              :rules="amountRules"
            ></v-text-field>
            <div class="text-center">
              <v-btn type="submit" color="primary" :loading="loading">Make Offer</v-btn>
            </div>
          </v-form>
        </div>
        <div v-else>
          <div class="text-h3 text-center">Congrats</div>
          <p class="lead text-muted mt-1 mb-4 text-center">You will recieve email updates about your offer</p>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'

export default {
  data: function () {
    return {
      dialog: false,
      loading: false,
      valid: true,
      amount: null,
      done: false,
      amountRules: [
        v => !!v || 'Enter a valid offer amount'
      ]
    }
  },
  computed: {
    ...mapGetters({
      beat: 'SSBeatOfferModal/getBeat'
    })
  },
  watch: {
    dialog: function (v) {
      if (!v) {
        this.done = false
        this.setVisible(false)
      }
    }
  },
  methods: {
    ...mapMutations({
      setVisible: 'SSBeatOfferModal/SET_VISIBLE'
    }),
    openModal: function () {
      this.amount = null
      this.dialog = true
    },
    onSubmit: async function () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.loading = true
      try {
        Vue.$http.post('v1/sound-store/offer', { beat_uuid: this.beat.uuid, amount: this.amount })
      } catch (err) {
        this.throwError(err)
      }
      this.loading = false
      this.done = true
    }
  }
}
</script>

<style>

</style>
