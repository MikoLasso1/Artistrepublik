<template>
  <v-card>
    <v-card-title>Header Type</v-card-title>
    <v-card-subtitle>Select Header Type</v-card-subtitle>
    <v-card-text class="mt-4">
      <div class="mb-4">
        <MiniProfileAddComponent v-if="!isComponentAddedToLayout" :component-name="$options.name" />
        <v-row justify="center" v-else>
          <v-col md="12" lg="5">
            <v-card class="mx-auto">
              <v-img
                src="/img/mini-profile/header1.png"
                height="150px"
              ></v-img>

              <v-card-text>
                <h3 class="text-center mb-0">Default Header</h3>
                <p class="text-center mb-0">
                  <v-btn
                    color="primary"
                    text
                    small
                    @click="selectComponent($options.name, 'DefaultHeader')"
                  >
                    Add To Layout
                  </v-btn>
                </p>
                <v-overlay :opacity="0.2" :absolute="true" v-if="isComponentAddedToLayout === 'DefaultHeader'">
                  <v-icon color="green" size="48" v-text="'mdi-check-circle-outline'"></v-icon>
                </v-overlay>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col lg="5" md="12">
            <v-card class="mx-auto">
              <v-img
                src="/img/mini-profile/header2.png"
                height="150px"
              ></v-img>

              <v-card-text>
                <h3 class="text-center mb-0">Premium Header</h3>
                <p class="text-center mb-0" v-if="planId > 1">
                  <v-btn
                    color="primary"
                    text
                    small
                    @click="selectComponent($options.name, 'PremiumHeader')"
                  >
                    Add To Layout
                  </v-btn>
                </p>
                <p class="text-center pa-2 mb-3" v-else></p>
                <v-overlay :opacity="0.5" :absolute="true" v-if="planId === 1">
                  <v-icon color="grey" size="48" v-text="'mdi-lock'"></v-icon>
                </v-overlay>
                <v-overlay :opacity="0.2" :absolute="true" v-else-if="isComponentAddedToLayout === 'PremiumHeader'">
                  <v-icon color="green" size="48" v-text="'mdi-check-circle-outline'"></v-icon>
                </v-overlay>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import MiniProfileAddComponent from '@/components/MiniProfile/views/MiniProfileAddComponent'

export default {
  components: {
    MiniProfileAddComponent
  },
  name: 'MiniProfileHeaderType',
  data () {
    return {
      processing: false
    }
  },
  methods: {
    ...mapMutations({
      setLayout: 'MiniProfile/SET_SELECTED_LAYOUT',
      addComponent: 'MiniProfile/ADD_COMPONENT'
    }),
    selectComponent (componentName, componentFE) {
      this.addComponent({ componentName, componentFE })
    }
  },
  computed: {
    ...mapGetters({
      layoutId: 'MiniProfile/getSelectedLayout',
      liveLayoutData: 'MiniProfile/getLiveLayoutData',
      userLayoutData: 'MiniProfile/getUserLayoutData'
    }),
    planId () {
      return this.userLayoutData.planId
    },
    isComponentAddedToLayout () {
      let componentName = this.$options.name
      let result = this.liveLayoutData.filter(
        v => v.component === componentName
      )
      return result.length ? result[0].componentFE : false
    }
    /*selectedType() {
      let result = this.liveLayoutData.filter(
        v => v.component === componentName
      );
      if(result.length) {
        return result[0].componentFE;
      } else
      return result.length ?
    }*/
  }
}
</script>
<style>
.artist-link-settings .VueCarousel-dot-container {
  margin-top: 0px !important;
}
</style>
