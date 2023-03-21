<template>
  <div>
    <div id="outlet-wrap">
      <outlet
        v-for="outlet in outlets"
        v-bind:key="outlet.id"
        :outlet="outlet"
      />
      <outlet />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Outlet from '@/components/PRHub/BecomeManagerModal/Outlet'

export default {
  components: {
    Outlet
  },
  computed: {
    ...mapGetters({
      outlets: 'getPROutlets'
    })
  },
  mounted: async function () {
    this.$store.dispatch('getMyPROutlets')
  }
}
</script>

<style>

</style>
