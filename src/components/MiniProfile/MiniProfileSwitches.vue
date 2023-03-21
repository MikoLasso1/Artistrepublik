<template>
  <div>
    <v-row justify="center" v-if="planId === 2">
      <v-col md="10">
        <div style="border: 1px dashed gray; padding: 10px;" class="mb-5">
          <h3 class="mb-0">This plan includes option to switch layout between 2 or 3</h3>
          <v-row>
            <v-col class="text-right" md="3">
              <switch-mini-profile
                layout-id="2"
                :selected-layout="selectedLayout"
                :plan="planId"
                :is-active="alreadyActiveLayout2"
                :profile-id="profileId"
                @updateLayoutStatus="updateLayoutStatus"
                v-if="planId === 2"
              ></switch-mini-profile>
            </v-col>
            <v-col>
              <switch-mini-profile
                layout-id="3"
                :selected-layout="selectedLayout"
                :plan="planId"
                :is-active="alreadyActiveLayout3"
                :profile-id="profileId"
                @updateLayoutStatus="updateLayoutStatus"
                v-if="planId === 2"
              ></switch-mini-profile>
            </v-col>

          </v-row>
          <p class="text-center mb-2 mt-3">
            <v-btn
              color="primary"
              @click="showLayoutPreviewModal"
            >Layout Previews
            </v-btn
            >
          </p>
        </div>
        <LayoutPreviewsModal ref="layoutPreview" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import SwitchMiniProfile from '@/components/MiniProfile/SwitchMiniProfile'
import LayoutPreviewsModal from '@/components/MiniProfile/Modals/LayoutPreviewsModal'

export default {
  props: {
    planId: {
      type: [Number, String],
      default: 0
    },
    profileId: {
      type: [Number, String],
      default: null
    },
    prevSelectedLayout: {
      type: [Number, String],
      default: null
    }
  },
  data () {
    return {
      selectedLayout: this.prevSelectedLayout
    }
  },
  components: {
    SwitchMiniProfile,
    LayoutPreviewsModal
  },
  methods: {
    upgradePlanButton () {
      this.$emit('upgrade-plan')
    },
    updateLayoutStatus (selected_layout) {
      this.selectedLayout = selected_layout
      this.$emit('layout-switched', selected_layout)
    },
    showLayoutPreviewModal () {
      this.$refs.layoutPreview.openModal()
    }
  },
  computed: {
    alreadyActiveLayout2 () {
      return this.planId === 2 && this.selectedLayout === 2
    },
    alreadyActiveLayout3 () {
      return this.planId === 2 && this.selectedLayout === 3
    }
  }
}
</script>
