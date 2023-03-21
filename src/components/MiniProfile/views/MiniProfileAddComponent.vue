<template>
  <div>
    <v-row justify="center">
      <v-col class="text-center" lg="5" md="5" sm="5">
        <v-card
          class="mx-auto"
          max-width="344"
        >
          <v-img
            :src="`/img/mini-profile/component-previews/${componentName}.png`"
            height="200px"
            contain
          ></v-img>
          <v-card-title>
            <h2 class="mb-0 text-center w-100 font-weight-regular">{{ componentTitle }}</h2>
          </v-card-title>

          <v-card-text @click="add" class="cursor-pointer">
            <v-icon x-large class="primary--text">mdi-plus-circle</v-icon>
            <br />
            <div class="primary--text mt-1">ADD TO LAYOUT</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
  props: {
    componentName: {
      default: null,
      type: String
    }
  },
  methods: {
    ...mapMutations({
      addComponent: 'MiniProfile/ADD_COMPONENT'
    }),
    add () {
      if (this.componentName) {
        let componentName = this.componentName
        this.addComponent({ componentName })
      }
    }
  },
  computed: {
    ...mapGetters({
      layoutId: 'MiniProfile/getSelectedLayout',
      activeSetting: 'MiniProfile/getActiveSetting',
      liveLayoutData: 'MiniProfile/getLiveLayoutData',
      getSidebarSettingsMenu: 'MiniProfile/getSidebarSettingsMenu'
    }),
    componentTitle () {
      let component = this.getSidebarSettingsMenu.filter(
        v => v.componentName === this.componentName
      )[0]
      return component.title
    }
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
