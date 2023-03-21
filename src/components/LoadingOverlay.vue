<template>
  <div v-if="loading" class="overlay">
    <v-progress-linear indeterminate></v-progress-linear>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .30);
  display: flex;
  align-items: center;
  z-index: 999;
}
</style>