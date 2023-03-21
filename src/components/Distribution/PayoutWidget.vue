<template>
  <div>
    <div class="text-center">
      <h2>${{ payout_amount }}</h2>
      <p>Minimum $20 payout</p>
      <v-btn color="primary" @click="openPayoutModal">
        Payout
      </v-btn>
    </div>
    <payout-modal :payout-amount="payout_amount" :last-payout="last_payout" type="distribution" ref="payoutModal"></payout-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PayoutModal from '@/components/PayoutModal'

export default {
  components: {
    PayoutModal
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      payout_amount: 'getPayoutAmount',
      last_payout: 'getLastPayout'
    })
  },
  methods: {
    openPayoutModal: function () {
      this.$refs.payoutModal.openModal()
    }
  },
  mounted: function () {
    this.$store.dispatch('getPayoutAmount')
    this.$store.dispatch('getLastPayout')

    //console.log(this.last_payout);
  }
}
</script>

<style>

</style>
