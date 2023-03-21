<template>
  <div>
    <input
      v-show="false"
      type="file"
      :id="id"
      multiple
      @change="$emit('selected', $event.target.files)"
      :ref="refName"
    />
    <v-btn @click="clickInput" class="v-btn primary" block>Add Media</v-btn>
  </div>
</template>

<script>
export default {
  name: 'APostComposeMediaButton',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    refName () {
      return `"uploader"${this.id}`
    }
  },
  methods: {
    clickInput () {
      let element = this.$refs[this.refName]
      element.click()
    }
  }
}
</script>

<style scoped>

</style>
