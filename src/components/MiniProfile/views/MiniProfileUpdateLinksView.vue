<template>
  <v-card elevation="2">
    <v-card-title>Update Links</v-card-title>
    <v-card-subtitle
    >You can link to social links, profile pages, or songs. Add your links
      below.
    </v-card-subtitle
    >
    <v-card-text>
      <MiniProfileAddComponent v-if="!isComponentAddedToLayout" :component-name="$options.name" />
      <div class="mt-2" v-else>
        <v-row justify="center">
          <v-col md="5">
            <v-card class="mx-auto">
              <v-img
                src="/img/mini-profile/MiniProfileUpdateLinksView.png"
                height="100px"
              ></v-img>

              <v-card-text>
                <h3 class="text-center mb-2">Stacked Links</h3>
                <p class="text-center mb-0">
                  <v-btn
                    color="primary"
                    small
                    @click="selectComponent($options.name, null, 'DefaultAppLogos')"
                  >
                    Add To Layout
                  </v-btn>
                </p>
                <v-overlay :opacity="0.2" :absolute="true" v-if="activeComponentType === 'DefaultAppLogos'">
                  <v-icon color="green" size="48" v-text="'mdi-check-circle-outline'"></v-icon>
                </v-overlay>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col md="5">
            <v-card class="mx-auto">
              <v-img
                src="/img/mini-profile/MiniProfileAppLogos.png"
                height="100px"
                contain
              ></v-img>

              <v-card-text>
                <h3 class="text-center  mb-2">Circle Logos</h3>
                <p class="text-center mb-0">
                  <v-btn
                    color="primary"

                    small
                    @click="selectComponent($options.name, null, 'PremiumAppLogos')"
                  >
                    Add To Layout
                  </v-btn>
                </p>
                <v-overlay :opacity="0.2" :absolute="true" v-if="activeComponentType === 'PremiumAppLogos'">
                  <v-icon color="green" size="48" v-text="'mdi-check-circle-outline'"></v-icon>
                </v-overlay>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <UpdateMiniProfileLinks
          :layout="layoutId"
          class="mt-4 mb-4"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import UpdateMiniProfileLinks from '@/components/MiniProfile/UpdateMiniProfileLinks'
import MiniProfileAddComponent from '@/components/MiniProfile/views/MiniProfileAddComponent'

export default {
  name: 'MiniProfileUpdateLinksView',
  components: {
    UpdateMiniProfileLinks,
    MiniProfileAddComponent
  },
  computed: {
    ...mapGetters({
      layoutId: 'MiniProfile/getSelectedLayout',
      liveLayoutData: 'MiniProfile/getLiveLayoutData'
    }),
    isComponentAddedToLayout () {
      let componentName = this.$options.name
      let result = this.liveLayoutData.filter(
        v => v.component === componentName
      )
      return !!result.length
    },
    activeComponentType () {
      let componentName = this.$options.name
      let result = this.liveLayoutData.filter(
        v => v.component === componentName
      )
      return result.length ? result[0].componentFEalias : false
    }
  },
  methods: {
    ...mapMutations({
      addComponent: 'MiniProfile/ADD_COMPONENT'
    }),
    selectComponent (componentName, componentFE, componentFEalias) {
      this.addComponent({ componentName, componentFE, componentFEalias })
    }
  }
}
</script>
