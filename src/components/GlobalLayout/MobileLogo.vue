<template>
  <router-link class="mobilelogo" to="/">
    <v-avatar width="38" height="38" class="pr-1">
      <img src="/img/brand/navlogo.png" alt="artist republik logo" />
    </v-avatar>
    <img
      src="/img/brand/logo_text.svg"
      width="110"
      height="6"
      class="mobilelogo-text"
      alt="artist republik logo"
    />
  </router-link>
</template>
<script>
export default {
  name: 'MobileLogo',
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.mobilelogo {
  display: block;
  display: flex;
  align-items: center;
  padding: 0 0 0 10px;
}
</style>
