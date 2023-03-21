<template>
  <v-navigation-drawer
    id="mini-profile-drawer-mobile"
    v-model="drawer"
    :dark="true"
    width="250"
    mini-variant-width="80"
    class="black"
    :mini-variant.sync="mini"
    :height="navHeight"
    :right="isMobile"
    :app="isMobile"
    :temporary="isMobile"
    :hide-overlay="isMobile"
    mobile-breakpoint="767"
  >
    <div>
      <v-list-item class="mb-0 mt-2 justify-space-between pl-3">
        <v-list-item-avatar class="mr-1" v-if="mini">
          <v-btn fab dark x-small color="primary">
            <v-icon dark>
              mdi-chevron-right
            </v-icon>
          </v-btn>
        </v-list-item-avatar>

        <v-list-item-title>
          <strong class="mr-1 font-weight-black nav-title">MANAGE <span class="primary--text nav-title">YOUR</span></strong>
          <br />
          <strong class="mr-1 font-weight-black nav-title">ARTST</strong>
          <span class="primary--text nav-title">LNK</span>
        </v-list-item-title>
        <v-btn fab dark x-small color="primary" @click.stop="mini = !mini">
          <v-icon dark>
            mdi-chevron-left
          </v-icon>
        </v-btn>
      </v-list-item>

      <v-divider class="mx-3 mt-1 mb-2" />
      <v-list expand nav class="main-sidear-list p-0">
        <v-list-item
          v-for="(setting, i) in sidebarSettingsMenu"
          :key="i"
          @click="showComponent(setting)"
          dense
          class="mb-1"
          :class="{
            'v-list-item--active': addActiveClass(setting.componentName)
          }"
        >
          <v-list-item-icon class="my-2 mr-3 ml-2 align-self-center">
            <v-icon
              class="icon-styles"
              :style="iconStyle(setting)"
              v-text="iconText(setting)"
            ></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="setting.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  data () {
    return {
      isMobile: false,
      showComponentsWihoutPlan: [
        'MiniProfileUpdateLinksView',
        'MiniProfileHeaderType',
        'MiniProfileSubscriptionView'
      ]
    }
  },
  methods: {
    ...mapActions({
      getPlan: 'MiniProfile/getPlan'
    }),
    ...mapMutations({
      setActiveSetting: 'MiniProfile/SET_ACTIVE_SETTING',
      setSocialUnlockId: 'MiniProfile/SET_SOCIAL_UNLOCK_ID',
      setSidebarMini: 'MiniProfile/SET_SIDEBAR_MINI',
      setLayout: 'MiniProfile/SET_SELECTED_LAYOUT',
      setSidebarDrawer: 'MiniProfile/SET_SIDEBAR_DRAWER'
    }),
    addActiveClass (setting) {
      return this.activeSetting === setting
    },
    showComponent (setting) {
      if (this.isListItemActive(setting.componentName)) {
        this.setActiveSetting(setting.componentName)
      } else {
        this.$router.push({ name: 'artist.links.subscription' })
      }
    },
    isListItemActive (componentName) {
      if (this.planId > 1) {
        return true
      } else if (
        this.planId === 1 &&
        this.showComponentsWihoutPlan.includes(componentName)
      ) {
        return true
      } else {
        return false
      }
    },
    iconStyle (item) {
      let style = ''
      if (item.color) {
        style += `color:${item.color}`
      }

      return style
    },
    iconText (setting) {
      let icon = setting.icon
      if (this.showComponentsWihoutPlan.includes(setting.componentName)) {
        return icon
      }
      if (this.planId === 1) {
        return 'mdi-lock'
      }
      return icon
    }
  },
  computed: {
    ...mapGetters({
      userLayoutData: 'MiniProfile/getUserLayoutData',
      validPlan: 'MiniProfile/getValidPlan',
      layoutId: 'MiniProfile/getSelectedLayout',
      activeSetting: 'MiniProfile/getActiveSetting',
      sidebarSettingsMenu: 'MiniProfile/getSidebarSettingsMenu',
      getSideBarDrawer: 'MiniProfile/getSideBarDrawer',
      getMini: 'MiniProfile/getSideBarMini'
    }),
    planId () {
      return this.userLayoutData.planId
    },
    mini: {
      get: function () {
        return this.getMini
      },
      set: function (newValue) {
        this.setSidebarMini(newValue)
      }
    },
    drawer: {
      get () {
        return this.getSideBarDrawer
        // return true;
      },
      set (value) {
        this.setSidebarDrawer(value)
      }
    },
    selectedSidebarItem: {
      get () {
        let currentSetting = this.activeSetting
        if (
          this.activeSetting &&
          this.activeSetting !== 'MiniProfileLayoutSlider'
        ) {
          let selectedSettingIndex = this.sidebarSettingsMenu.findIndex(i => {
            return i.componentName === currentSetting
          })
          return selectedSettingIndex
        } else {
          return null
        }
      },
      set (value) {
        console.log(value)
        // this.$emit("input", value);
      }
    },
    navHeight () {
      return this.isMobile ? '100%' : 'auto'
    }
  },
  mounted () {
    this.isMobile = this.isMobileDevice()
  }
}
</script>
<style scoped>
strong.mr-1.font-weight-black.nav-title {
  font-size: 25px !important;
}

.v-list-item--active {
  background-color: unset !important;
  border-color: unset !important;
}

.v-list-item--active:before {
  border-left: 2px solid #bcb0d7;
  opacity: 1 !important;
}

span.primary--text.nav-title {
  font-size: 25px !important;
}
</style>
