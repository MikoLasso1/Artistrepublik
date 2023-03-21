<template>
  <div class="row justify-content-center" />
</template>
<script>
import { mapMutations } from 'vuex'
import config from '@/config'

export default {
  name: 'Logout',
  data() {
    return {
      track: true,
    }
  },
  created() {
    this.logout()
  },
  methods: {
    ...mapMutations({
      removeCartKey: 'SSCart/REMOVE_CART_KEY',
    }),
    logout: function () {
      this.removeCartKey()
      document.location.href = config.MAIN_URL + 'login?logout=true'
      // this.$store.dispatch('logout').then(() => {
      //   this.removeCartKey()
      //   document.location.href = config.MAIN_URL + 'login?logout=true'
      // }).catch(err => {
      //   console.log(err)
      // })
    },
  },
}
</script>
<style></style>
