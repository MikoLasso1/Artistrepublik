<template>
  <v-card>
    <v-card-title>Layouts</v-card-title>
    <v-card-subtitle>Select Layout</v-card-subtitle>
    <v-card-text>
      <h2 class="mb-5">Design New Artist Link</h2>
      <v-row>
        <v-col>
          <carousel :perPage="6">
            <slide v-for="item in getDefaultLayoutItems" :key="item.id">
              <v-card
                :color="isActive(item.id) ? 'primary' : 'grey lighten-1'"
                height="180"
                width="120"
                @click="create(item.layoutName, item.data, item.disabled)"
              >
                <v-img
                  height="180"
                  :src="`/img/mini-profile/layouts/${item.id}.png`"
                  :alt="`Layout ${item.id}`"
                  :title="`Layout ${item.id}`"
                  cover
                  position="top center"
                ></v-img>
                <v-overlay :absolute="true" v-if="item.disabled">
                  <v-icon color="white" size="48" v-text="'mdi-lock'"></v-icon>
                </v-overlay>

              </v-card>
              <v-card width="120" elevation="0">
                <p class="text-center">
                  {{ item.layoutName }}
                </p>
              </v-card>
            </slide>
          </carousel>
        </v-col>
      </v-row>
      <div class="mt-4 mb-5">
        <h2 class="mb-5">My Links</h2>
        <v-row class="justify-center" v-if="userLayouts.length">
          <v-col>
            <carousel :perPage="6">
              <slide v-for="item in userLayouts" :key="item.id">
                <MiniProfileUserLayoutSliderItem :item="item" @layout="layoutSelected" />
              </slide>
            </carousel>
          </v-col>
        </v-row>
        <p class="text-center" v-else>No Layouts Created.</p>
      </div>
    </v-card-text>
    <VuetifyProgressDialog v-if="processing" message="Creating Layout ..." />
  </v-card>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import { Carousel, Slide } from 'vue-carousel'
import VuetifyProgressDialog from '@/shared/components/VuetifyProgressDialog'
import MiniProfileUserLayoutSliderItem from '@/components/MiniProfile/views/MiniProfileUserLayoutSliderItem'

export default {
  components: {
    Carousel,
    Slide,
    VuetifyProgressDialog,
    MiniProfileUserLayoutSliderItem
  },
  data () {
    return {
      model: null,
      // selectedLayoutLocal: 1,
      processing: false
    }
  },
  methods: {
    ...mapActions({
      getUserLayouts: 'MiniProfile/getUserLayouts',
      createLayout: 'MiniProfile/createLayout'
    }),
    ...mapMutations({
      setLayout: 'MiniProfile/SET_SELECTED_LAYOUT',
      setActiveSetting: 'MiniProfile/SET_ACTIVE_SETTING',
      setShowLiveView: 'MiniProfile/SET_SHOW_LIVE_VIEW',
      setLiveLayoutData: 'MiniProfile/SET_LIVE_LAYOUT_DATA',
      setLayoutCompleteData: 'MiniProfile/SET_LIVE_LAYOUT_COMPLETE_DATA',
      setMainSidebarMini: 'SET_SIDEBAR_MINI',
      setSidebarDrawer: 'MiniProfile/SET_SIDEBAR_DRAWER'
    }),
    setSelectedLayout (layout) {
      this.setLayout(layout.id)
      this.setLayoutCompleteData(layout)
      this.setLiveLayoutData(JSON.parse(layout.data))
      this.$emit('layout', 'MiniProfileHeaderType')
    },
    layoutSelected (data) {
      this.$emit('layout', data)
    },
    isActive (layoutId) {
      return this.selectedLayout === layoutId
    },
    async create (layoutName, layoutData, disabled) {
      if (!disabled) {
        this.processing = true
        this.createLayout({ layoutName, layoutData })
          .then(() => {
            this.$noty.success('Layout created successfully')
            this.getUserLayouts()
            if (this.planId === 1) {
              this.$emit('layout', 'MiniProfileUpdateLinksView')
            } else {
              this.$emit('layout', 'MiniProfileHeaderType')
            }
            this.setMainSidebarMini(true)
            this.setSidebarDrawer(true)
            this.$vuetify.goTo(0, {
              duration: 300
            })
          })
          .catch(err => {
            if (err.response.status === 403) {

              this.$emit('layout', 'MiniProfileSubscriptionView')
            } else {
              this.$noty.warning('Error Occurred while processing request.')
              this.throwError(err)
            }
          })
        this.processing = false
      } else {
        this.$emit('layout', 'MiniProfileSubscriptionView')
      }
    }
  },
  computed: {
    ...mapGetters({
      selectedLayout: 'MiniProfile/getSelectedLayout',
      getDefaultLayoutItems: 'MiniProfile/getDefaultLayoutItems',
      userLayouts: 'MiniProfile/getUserLayouts',
      userLayoutData: 'MiniProfile/getUserLayoutData'
    }),
    planId () {
      return this.userLayoutData.planId
    }
  },
  created () {
    this.getUserLayouts()
  }
}
</script>
<style>
.artist-link-settings .VueCarousel-dot-container {
  margin-top: 0 !important;
}
</style>
