<template>
  <div>
    <MiniProfileHeader class="mb-10" />
    <VuetifyProgressDialog message="Processing ..." v-if="processing"></VuetifyProgressDialog>
    <v-row justify="center">
      <v-col md="10">
        <v-card class="mb-10">
          <v-card-text>
            <h1 class="text-center mt-5 mb-2">Choose Layout To Get Started!</h1>
            <h3 class="text-center mt-0 mb-10">Select from a pre-defined starting layout or create your own.</h3>
            <v-row>
              <v-col md="3" v-for="item in getDefaultLayoutItems" :key="item.id">
                <v-hover>
                  <template v-slot:default="{ hover }">
                    <v-card
                      class="mx-auto"
                      max-width="250"
                    >
                      <v-img height="350" class="image-preview" cover position="top center" :src="`/img/mini-profile/layouts/${item.id}.png`"></v-img>

                      <v-card-text>
                        <h2 class="title primary--text">
                          {{ item.layoutName }}
                        </h2>
                      </v-card-text>

                      <v-fade-transition>
                        <v-overlay
                          v-if="hover && !item.disabled"
                          absolute
                          color="#036358"
                        >
                          <v-btn
                            class="primary"
                            fab
                            @click="create(item.id, item.layoutName, item.data, item.disabled)"
                          >
                            <v-icon dark>
                              mdi-pencil-outline
                            </v-icon>
                          </v-btn>
                        </v-overlay>

                        <v-overlay
                          v-if="item.disabled"
                          absolute
                          color="#036358"
                        >
                          <v-btn
                            class="primary"
                            fab
                            @click="layoutLocked()"
                          >
                            <v-icon dark>
                              mdi-lock
                            </v-icon>
                          </v-btn>
                        </v-overlay>
                      </v-fade-transition>
                    </v-card>
                  </template>
                </v-hover>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="dialog"
      max-width="600"
    >
      <v-card>
        <v-card-title class="text-h6 break-word">
          Do you want to edit the current layout or upgrade for more layout options?
        </v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            @click="editCurrentLayout"
          >
            Edit current Layout
          </v-btn>

          <v-btn
            color="success"
            @click="upgrade"
          >
            Upgrade
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import MiniProfileHeader from '@/components/MiniProfile/MiniProfileHeader'
import VuetifyProgressDialog from '@/shared/components/VuetifyProgressDialog'

export default {
  components: {
    MiniProfileHeader,
    VuetifyProgressDialog
  },
  data () {
    return {
      username: this.$store.getters.getSettings.account.general.username,
      processing: true,
      dialog: false
    }
  },
  metaInfo () {
    return {
      title: 'Artist Links',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content:
            'Artist Republik is a 360 degree platform offering Artist Links to help grow your career! We offer reviews, mastering, distribution, playlisting, and more!'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content:
            'Artist Links | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content:
            'Artist Republik is a 360 degree platform offering Artist Links to help grow your career! We offer reviews, mastering, distribution, playlisting, and more!'
        },
        {
          vmid: 'og:url',
          property: 'og:url',
          content: 'https://app.artistrepublik.com' + this.$route.fullPath
        },
        {
          vmid: 'twitter:title',
          property: 'twitter:title',
          content:
            'Artist Links | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Artist Republik is a 360 degree platform offering Artist Links to help grow your career! We offer reviews, mastering, distribution, playlisting, and more!'
        }
      ]
    }
  },
  methods: {
    ...mapActions({
      getLayouts: 'MiniProfile/getLayouts',
      createLayout: 'MiniProfile/createLayout',
      getPlan: 'MiniProfile/getPlan'
    }),
    ...mapMutations({
      setMainSidebarMini: 'SET_SIDEBAR_MINI',
      setSidebarDrawer: 'MiniProfile/SET_SIDEBAR_DRAWER',
      setActiveSetting: 'MiniProfile/SET_ACTIVE_SETTING',
      setLayout: 'MiniProfile/SET_SELECTED_LAYOUT_DATA'
    }),
    layoutLocked () {
      this.dialog = true
    },
    editCurrentLayout () {
      let layoutData = this.getUserLayouts[0]
      if (layoutData) {
        this.setLayout(layoutData)
        this.setSidebarDrawer(true)
        this.setMainSidebarMini(true)
        this.$vuetify.goTo(0, {
          duration: 300
        })
        this.$router.push({ name: 'artist.links.settings' })
      }
    },
    upgrade () {
      this.$router.push({ name: 'artist.links.subscription', params: { restricted: 'no_more_layouts' } })
    },
    async create (layoutId, layoutName, layoutData, disabled) {
      if (this.userMiniProfileData.planId <= 1) {
        this.editCurrentLayout()
      } else if (!disabled) {
        this.processing = true
        this.createLayout({ layoutId, layoutName, layoutData })
          .then(() => {
            this.$noty.success('Layout created successfully')
            this.setMainSidebarMini(true)
            this.setSidebarDrawer(true)
            this.$vuetify.goTo(0, {
              duration: 300
            })
            this.setActiveSetting('MiniProfileHeaderType')
            this.$router.push({ name: 'artist.links.settings' })
          })
          .catch(err => {
            if (err.response.status === 403) {
              this.$router.push({ name: 'artist.links.subscription', params: { restricted: 'no_more_layouts' } })
            } else {
              this.$noty.warning('Error Occurred while processing request.')
              this.throwError(err)
            }
          })
          .finally(() => this.processing = false)
      } else {
        this.$router.push({ name: 'artist.links.subscription' })
      }
    }
  },

  computed: {
    ...mapGetters({
      getDefaultLayoutItems: 'MiniProfile/getDefaultLayoutItems',
      getUserLayouts: 'MiniProfile/getUserLayouts',
      userMiniProfileData: 'MiniProfile/getUserLayoutData',
      settings: 'getSettings'
    })
  },
  created () {
    if (this.settings.mini_profile.is_account) {
      this.getPlan(this.username)
        .then(() => {
          this.processing = false
        })
        .catch(err => {
          this.processing = false
          this.$sentry.captureException(err)
        })
        .finally(() => this.processing = false)
    } else {
      this.$router.push({ name: 'artist.links.settings' })
    }
  }
}
</script>

<style scoped>
.montserrat-font {
  font-family: "Montserrat", sans-serif;
}

.v-image__image {
  background-position: top center !important;
}

.break-word {
  word-break: break-word;
}
</style>
