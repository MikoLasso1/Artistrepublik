<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-subtitle></v-card-subtitle>
    <v-card-text class="mt-4">
      <div class="mb-4">
        <MiniProfileAddComponent v-if="!isComponentAddedToLayout" :component-name="componentName" />
        <v-row v-else>
          <v-col>
            <h3 class="text-center">{{ title }} has been added to layout.</h3>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
import MiniProfileAddComponent from '@/components/MiniProfile/views/MiniProfileAddComponent'

export default {
  // name: 'MiniProfileTopTracksCreate',
  props: {
    componentName: {
      default: null,
      type: String
    },
    title: {
      default: null,
      type: String
    }
  },
  components: {
    MiniProfileAddComponent
  },
  data () {
    return {}
  },

  methods: {},
  created () {
  },
  computed: {
    ...mapGetters({
      liveLayoutData: 'MiniProfile/getLiveLayoutData'
    }),
    isComponentAddedToLayout () {
      // let componentName = this.$options.name;
      let name = this.componentName
      let result = this.liveLayoutData.filter(
        v => v.component === name
      )
      return result.length ? result[0].componentFE : false
    }
  }
}
</script>
