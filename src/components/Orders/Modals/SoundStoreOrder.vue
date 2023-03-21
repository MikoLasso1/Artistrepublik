<template>
  <div>
    <div v-for="beat in beats" :key="beat.uuid">
      <Beat :order="beat" />
    </div>
    <div v-for="samplePack in samplePacks" :key="samplePack.uuid">
      <SamplePack :order="samplePack" />
    </div>
  </div>
</template>

<script>
import Beat from '@/components/Orders/Modals/SoundStore/Beat'
import SamplePack from '@/components/Orders/Modals/SoundStore/SamplePack'

export default {
  components: {
    Beat,
    SamplePack
  },
  props: {
    order: Object
  },
  computed: {
    beats () {
      return this.order.order_data.filter(
        v => v.type === 'beat'
      )
    },
    samplePacks () {
      return this.order.order_data.filter(
        v => v.type === 'sample-pack' || v.type === 'sample'
      )
    }
  }
}
</script>

<style lang="scss" scoped>
hr {
  margin: 0.5rem 0;
}

.primary--text {
  color: #ee44aa !important;
  caret-color: #ee44aa !important;
}
</style>
