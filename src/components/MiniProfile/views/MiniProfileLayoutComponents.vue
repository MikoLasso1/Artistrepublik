<template>
  <v-card>
    <v-card-title>Layout Components</v-card-title>
    <v-card-subtitle>Select Layout Component</v-card-subtitle>
    <v-card-text class="mt-4">
      <div class="mb-4">
        <v-row>
          <v-col md="3">
            <v-card
              class="mx-auto"
            >
              <v-img
                src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                height="150px"
              ></v-img>

              <v-card-text>
                <h3 class="text-center mb-0">Basic Links</h3>
                <p class="text-center mb-0">
                  <v-btn
                    color="primary"
                    text
                    small
                    @click="selectComponent('BasicListenLinksLive')"
                  >
                    Add To Layout
                  </v-btn>
                </p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col md="3">
            <v-card
              class="mx-auto"
            >
              <v-img
                src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                height="150px"
              ></v-img>

              <v-card-text>
                <h3 class="text-center mb-0">Custom Links</h3>
                <p class="text-center mb-0">
                  <v-btn
                    color="primary"
                    text
                    small
                    @click="selectComponent('BasicCustomLinksLive')"
                  >
                    Add To Layout
                  </v-btn>
                </p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col md="3">
            <v-card
              class="mx-auto"
            >
              <v-img
                src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                height="150px"
              ></v-img>

              <v-card-text>
                <h3 class="text-center mb-0">Featured Media</h3>
                <p class="text-center mb-0">
                  <v-btn
                    color="primary"
                    text
                    small
                    @click="selectComponent('FeaturedMedia')"
                  >
                    Add To Layout
                  </v-btn>
                </p>
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

export default {
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
    selectComponent (componentName) {
      this.addComponent({ componentName })
    }
  },
  computed: {
    ...mapGetters({
      layoutData: 'MiniProfile/getLiveLayoutData'
    })
  }
}
</script>
<style>
.artist-link-settings .VueCarousel-dot-container {
  margin-top: 0px !important;
}
</style>
