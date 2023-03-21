<template>
  <v-card class="mx-auto">
    <v-img class="cursor-pointer" cover position="top center" top :src="layoutImage" @click="setSelectedLayout(item)" aspect-ratio="1" height="350"></v-img>

    <v-card-text class="py-1">
      <div class="d-flex justify-space-between">
        <h2 class="font-weight-light text-truncate mb-0 mt-3">
          {{ item.name }}
        </h2>
        <v-icon
          v-if="selectedLayout === item.id"
          color="green"
          size="24"
          v-text="'mdi-check-circle-outline'"
        ></v-icon>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-row no-gutters>
        <v-col cols="12" lg="auto">
          <v-btn
            class="mb-2"
            color="primary"
            elevation="2"
            small
            :loading="processing"
            :disabled="processing"
            @click="setDefaultLayout"
            v-if="userLayoutData.defaultLayout !== item.id"
          >Set Default
          </v-btn>
          <v-btn color="success" elevation="2" small v-else>Default</v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" class="text-right mt-lg-0" lg="auto">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="primary mr-1"
                fab
                @click="preview(item)"
                v-bind="attrs"
                v-on="on"
                x-small
              >
                <v-icon dark>
                  mdi-link
                </v-icon>
              </v-btn>
            </template>
            <span>Preview</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="primary mr-1"
                fab
                @click="shareUrl(item)"
                v-bind="attrs"
                v-on="on"
                x-small
              >
                <v-icon dark>
                  mdi-share
                </v-icon>
              </v-btn>
            </template>
            <span>Share</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="primary"
                fab
                @click="setSelectedLayout(item)"
                v-bind="attrs"
                v-on="on"
                x-small
              >
                <v-icon dark>
                  mdi-pencil-outline
                </v-icon>
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                x-small
                class="ml-1"
                fab
                color="error"
                @click="deleteLayout"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>
<script>
import Vue from 'vue'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import config from '@/config'

export default {
  props: {
    item: {
      default: function () {
        return {
          name: null,
          id: null,
        }
      },
      type: Object,
    },
  },
  data () {
    return {
      username: this.$store.getters.getSettings.account.general.username,
      processing: false,
      dialog: false,
    }
  },
  methods: {
    ...mapActions({
      getUserLayouts: 'MiniProfile/getUserLayouts',
    }),
    ...mapMutations({
      setLayout: 'MiniProfile/SET_SELECTED_LAYOUT',
      setLiveLayoutData: 'MiniProfile/SET_LIVE_LAYOUT_DATA',
      setLayoutCompleteData: 'MiniProfile/SET_LIVE_LAYOUT_COMPLETE_DATA',
      setSidebarDrawer: 'MiniProfile/SET_SIDEBAR_DRAWER',
      setUserDefaultLayout: 'MiniProfile/SET_USER_DEFAULT_LAYOUT',
      setMainSidebarMini: 'SET_SIDEBAR_MINI',
    }),
    isActive () {
      return this.selectedLayout === this.item.id
    },
    setSelectedLayout (layout) {
      this.setLayout(layout.id)
      this.setLayoutCompleteData(layout)
      this.setLiveLayoutData(JSON.parse(layout.data))
      this.$emit('layout', 'MiniProfileHeaderType')
      this.setSidebarDrawer(true)
      this.setMainSidebarMini(true)
      this.$vuetify.goTo(0, {
        duration: 300,
      })
    },
    deleteLayout () {
      this.$emit('delete-layout', {
        name: this.item.name,
        id: this.item.id,
      })
    },
    async setDefaultLayout () {
      this.processing = true
      try {
        await Vue.$http.put(
          `v1/user/mini-profile/layout/${this.userLayoutData.modelId}`,
          {
            default_layout: this.item.id,
          },
        )
        this.setUserDefaultLayout(this.item.id)
        this.$noty.success('Default layout updated successfully.')
      } catch (error) {
        this.$noty.warning('Error Occurred while processing request.')
      }
      this.processing = false
    },
    shareUrl (item) {
      this.$emit('share-layout', item.id)
    },
    preview (item) {
      let url = `${config.MINI_PROFILE_SHORTLINK}${this.userLayoutData.customDomainName}/${item.id}`
      window.open(url, '_blank')
    },
    customDomainName () {
      if (this.userLayoutData && this.userLayoutData.customDomainName) {
        return this.userLayoutData.customDomainName
      } else {
        return this.username
      }
    },
  },
  computed: {
    ...mapGetters({
      selectedLayout: 'MiniProfile/getSelectedLayout',
      userLayoutData: 'MiniProfile/getUserLayoutData',
    }),
    layoutImage () {
      if (this.item.screenshot_url) {
        return this.item.screenshot_url
      } else if (this.item.parent_layout_id === 9999) {
        return null
      } else {
        return `/img/mini-profile/layouts/${this.item.parent_layout_id}.png`
      }
    },
  },
}
</script>

<style scoped>
.v-image__image {
  background-position: top center !important;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
