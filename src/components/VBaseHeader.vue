<template>
  <div class="v-header d-flex justify-center align-center" :style="`background-image: url(${image});`">
    <h1 class="h1 text-white mt-8" v-if="name">
      <v-icon v-if="icon" color="white">{{ icon }}</v-icon>
      {{ name }}
    </h1>
  </div>
</template>
<script>
export default {
  name: 'VBaseHeader',
  props: {
    image: String,
    name: String,
    icon: String
  }
}
</script>
<style lang="scss" scoped>
.v-header {
  min-height: 200px;
  background-size: cover;
  background-position: center top;
}
</style>
