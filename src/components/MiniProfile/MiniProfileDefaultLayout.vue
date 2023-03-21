<template>
  <div>
    <v-select
      v-model="selectedLayout"
      :items="layouts"
      item-text="layoutName"
      item-value="id"
      label=""
      single-line
      hide-details
    ></v-select>
    <VuetifyProgressDialog message="Processing Request" v-if="processing"></VuetifyProgressDialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'
import VuetifyProgressDialog from '@/shared/components/VuetifyProgressDialog'

export default {
  components: {
    VuetifyProgressDialog
  },
  data () {
    return {
      processing: false
    }
  },
  methods: {
    async setDefaultLayout (layoutId) {
      this.processing = true
      this.$noty.info('Processing Request.')
      try {
        await Vue.$http.put(`v1/user/mini-profile/layout/${this.modelId}`, {
          default_layout: layoutId
        })

        this.processing = false
        this.$noty.success('Default layout updated successfully.')
      } catch (error) {
        this.processing = false
        this.$noty.warning('Error Occurred while processing request.')
      }
    }
  },
  watch: {
    selectedLayout: function (newVal) {
      this.setDefaultLayout(newVal)
    }
  },
  computed: {
    ...mapGetters({
      layoutData: 'MiniProfile/getUserLayoutData',
      defaultLayoutItems: 'MiniProfile/getDefaultLayoutItems'
    }),
    socialUnlockId () {
      return this.layoutData.socialUnlockId
    },
    selectedLayout: {
      get: function () {
        return this.layoutData.defaultLayout
      },
      // setter
      set: function (newValue) {
        this.setDefaultLayout(newValue)
      }
    },
    layouts () {
      return this.defaultLayoutItems
    },
    modelId () {
      return this.layoutData.modelId
    }
  }
}
</script>

<style>
.mini-profile-default .v-input--radio-group__input {
  width: auto;
  margin: 0 auto;
}

.mini-profile-default .v-input--radio-group__input label {
  margin-bottom: 0;
}
</style>
