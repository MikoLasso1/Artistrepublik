<template>
  <div>
    <v-switch
      v-model="switchValue"
      inset
      class="m-0"
      @change="updateStatus"
    ></v-switch>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: [Number, String],
      default: 0
    },
    id: {
      type: [Number, String],
      default: null
    }
  },
  data () {
    return {
      switchValue: this.status ? true : false
    }
  },
  methods: {
    updateStatus () {
      let data = {
        id: this.id,
        status: this.switchValue
      }
      this.$emit('update-item', data)
    }
  },
  watch: {
    status (newVal) {
      this.switchValue = newVal
    }
  }
}
</script>
