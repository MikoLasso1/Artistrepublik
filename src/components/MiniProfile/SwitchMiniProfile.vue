<template>
  <v-switch
    v-model="alreadyActive"
    :label="`Layout ${layoutId}`"
    :disabled="isDisabled()"
    @change="updateMiniProfile()"
  ></v-switch>
</template>
<script>
import Vue from 'vue'

export default {
  props: {
    layoutId: [String, Number],
    selectedLayout: [String, Number],
    plan: [Number, String],
    isActive: [Boolean, String],
    profileId: {
      type: [Number, String],
      default: null
    }
  },
  data () {
    return {
      selected: this.selectedLayout,
      planId: this.plan,
      processing: false,
      alreadyActive: this.isActive
    }
  },
  computed: {},
  methods: {
    isDisabled () {
      if (this.planId === null || this.planId === 1) {
        return true
      } else {
        return false
      }
    },
    async updateMiniProfile () {
      this.processing = true
      this.$noty.info('Processing Request.')
      try {
        await Vue.$http.put(`v1/user/mini-profile/layout/${this.profileId}`, {
          selected_layout: this.layoutId
        })

        this.$emit('updateLayoutStatus', this.layoutId)

        this.$noty.success('Layout enabled successfully.')
        this.processing = false
      } catch (error) {
        this.processing = false
        this.$noty.warning('Error Occurred while processing request.')
      }
    }
  },
  watch: {
    isActive: function (newValue) {
      this.alreadyActive = newValue
    }
  }
}
</script>
