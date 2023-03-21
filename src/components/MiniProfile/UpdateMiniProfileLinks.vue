<template>
  <div>
    <v-progress-circular
      indeterminate
      color="primary"
      v-if="processingLinks"
    ></v-progress-circular>
    <v-row>
      <v-col md="12">
        <v-expansion-panels class="mt-5">
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h2 class="mb-0">Update Your Social Links</h2>
              <template v-slot:actions>
                <v-icon color="#121D3B">
                  mdi-plus
                </v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-alert
                text
                type="info"
                v-if="defaultLinksAdded"
              >You have unsaved changes hit save to save links.
              </v-alert>
              <v-form ref="form" @submit.prevent v-model="valid" id="form-parent">
                <v-alert
                  type="error"
                  :value="atleastOneFieldRequired"
                  class="text-left"
                >Please enter URL for atleast one social app
                </v-alert>
                <v-row>
                  <v-col md="6" class="col-12 " v-for="element in formFields" :key="element.id">
                    <v-text-field :rules="linkRules" v-model="formData[element.slug]" :label="element.title"></v-text-field>
                  </v-col>
                </v-row>
                <v-btn
                  :loading="processingLinks"
                  :disabled="processingLinks"
                  @click="UpdateMiniProfileLinks"
                  color="primary"
                  class="mt-5"
                >Save Links
                </v-btn>
              </v-form>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>
              <h2 class="mb-0">
                Order Social Links
                <p class="layout-sub-title mb-0">
                  Drag and Drop items to change the order
                </p>
              </h2>
              <template v-slot:actions>
                <v-icon color="#121D3B">
                  mdi-plus
                </v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <draggable
                :list="formFieldsOrdered"
                class="list-group"
                ghost-class="ghost"
                @end="updateSocialLinksOrder"
              >
                <div
                  class="list-group-item"
                  v-for="element in formFieldsOrdered"
                  :key="element.id"
                >
                  {{ element.title }}
                </div>
              </draggable>

            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>
              <h2 class="mb-0">Add Custom Links</h2>
              <template v-slot:actions>
                <v-icon color="#121D3B">
                  mdi-plus
                </v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-form
                ref="form-custom-links"
              >
                <dl v-for="(item, index) in [1,2]" :key="index">
                  <dt class="font-weight-bold mb-0">
                    Custom Link {{ item }}
                  </dt>
                  <dd class="px-5">
                    <v-text-field
                      v-model="customLinks['link'+item].title"
                      label="Title"
                    ></v-text-field>
                    <v-text-field
                      v-model="customLinks['link'+item].link"
                      label="Link"
                    ></v-text-field>
                  </dd>
                </dl>
                <v-btn
                  :loading="processingCustomLinks"
                  :disabled="processingCustomLinks"
                  @click="updateCustomLinks"
                  color="primary"
                >Save Links
                </v-btn>
              </v-form>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <VuetifyProgressDialog message="Processing Link Order..." v-if="processingLinkOrder" />
  </div>
</template>
<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import draggable from 'vuedraggable'
import VuetifyProgressDialog from '@/shared/components/VuetifyProgressDialog'

export default {
  props: {
    layout: {
      default: null,
      type: [String, Number]
    }
  },
  components: {
    draggable,
    VuetifyProgressDialog
  },
  data () {
    return {
      valid: false,
      username: this.$store.getters.getSettings.account.general.username,
      processingLinks: false,
      layoutId: this.layout,
      formFields: [],
      formData: {},
      linkRules: [
        function (v) {
          if (v) {
            return (
              /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?)/gi.test(
                v
              ) || 'Link must be valid'
            )
          } else {
            return true
          }
        }
      ],
      processingLinkOrder: false,
      formFieldsOrdered: [],
      atleastOneFieldRequired: false,
      customLinks: {
        link1: {},
        link2: {}
      },
      processingCustomLinks: false,
      defaultLinksAdded: false
    }
  },
  methods: {
    ...mapActions({
      getUserLayouts: 'MiniProfile/getUserLayouts'
    }),
    resetItems () {
      this.customLinks = {
        link1: {},
        link2: {}
      }
    },
    async updateSocialLinksOrder () {
      this.processingLinkOrder = true
      try {
        await Vue.$http.post(`v1/user/mini-profile/links/order`, {
          links_order: this.formFieldsOrdered,
          layout_id: this.layoutId
        })

        this.$noty.success('Order Updated successfully')
        this.processingLinks = false
        this.$root.$emit('updateLiveMiniProfileLinks')
      } catch (error) {
        this.$noty.warning('Error Occurred while processing request.')
        this.processingLinks = false
      }
      this.processingLinkOrder = false
    },
    async getMiniProfileLinks () {
      this.processingLinks = true
      try {
        let response = await Vue.$http.get(`v1/user/mini-profile/links`, {
          params: {
            layout_id: this.layoutId,
            username: this.username
          }
        })

        let links = response.data.data

        if (links.length === 0) {
          //check if user has saved any other layouts and fetch links from that layout
          if (this.userLayouts.length > 0) {
            let linksLayoutId = this.userLayouts[0].id

            let layoutLinksResponse = await Vue.$http.get(`v1/user/mini-profile/links`, {
              params: {
                layout_id: linksLayoutId,
                username: this.username
              }
            })
            let layoutLinksData = layoutLinksResponse.data.data

            if (layoutLinksData.length === 0) {
              //if no other layouts then fetch social links from user settings
              let settingLinks = this.settings.account.links

              for (const [key, value] of Object.entries(settingLinks)) {
                console.log(`${key}: ${value}`)
                let valueWithPrefix = this.addPrefixForSettingLinks(key, value)
                this.formData[key] = valueWithPrefix
              }
            } else {
              Object.entries(layoutLinksData).forEach((val) => {
                this.formData[val.app_name] = val.url
              })
            }

            if (Object.keys(this.formData).length) {
              this.defaultLinksAdded = true
            }
          }
        } else {
          Object.entries(links).forEach((val) => {
            this.formData[val.app_name] = val.url
          })
        }

        let responseApps = await Vue.$http.get(`v1/social-apps`)
        this.formFields = responseApps.data.data

        let linkOrderResponse = await Vue.$http.get(`v1/user/mini-profile/links/order`, {
          params: {
            layout_id: this.layoutId,
            username: this.username
          }
        })
        let linkOrderData = linkOrderResponse.data.data

        if (linkOrderData.length)
          this.formFieldsOrdered = linkOrderData
        else
          this.formFieldsOrdered = this.formFields

        this.processingLinks = false
      } catch (error) {
        this.$sentry.captureException(error)
        this.$noty.warning('Error Occurred while processing request.')
        this.processingLinks = false
      }
    },
    async UpdateMiniProfileLinks () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }

      if (Object.keys(this.formData).length === 0) {
        this.atleastOneFieldRequired = true
        let element = document.getElementById('form-parent')
        element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
        return
      } else {
        this.atleastOneFieldRequired = false
      }

      this.processingLinks = true
      this.$noty.info('Processing Request...')
      let postData = []

      for (let [key, value] of Object.entries(this.formData)) {

        let newArray = this.formFields.filter(function (el) {
          return el.slug === key
        })
        if (newArray.length)
          postData.push({ app_id: newArray[0].id, link: value })

      }

      try {
        await Vue.$http.post(`v1/user/mini-profile/links`, {
          links: postData,
          layout_id: this.layoutId
        })

        this.$noty.success('Links Updated successfully')
        this.processingLinks = false
      } catch (error) {
        this.$noty.warning('Error Occurred while processing request.')
        this.processingLinks = false
      }
      this.$root.$emit('updateLiveMiniProfileLinks')
    },
    async getCustomLinks () {
      this.processingCustomLinks = true
      try {
        let response = await Vue.$http.get(`v1/user/mini-profile/links/custom`, {
          params: {
            layout_id: this.layoutId,
            username: this.username
          }
        })

        let links = response.data.data

        Object.entries(links).forEach(([key, val]) => {
          var linkKey = parseInt(key) + 1
          this.customLinks[`link${linkKey}`] = {
            title: val.title,
            link: val.link
          }
        })
      } catch (error) {
        this.$noty.warning('Error Occurred while processing request.')
      }
      this.processingCustomLinks = false
    },
    async updateCustomLinks () {
      this.processingCustomLinks = true
      try {
        await Vue.$http.post(`v1/user/mini-profile/links/custom`, {
          layout_id: this.layoutId,
          links: this.customLinks
        })
        this.$noty.success('Custom Links Updated successfully')
      } catch (error) {
        this.$noty.warning('Error Occurred while processing request.')
      }
      this.processingCustomLinks = false
      this.$root.$emit('updateLiveMiniProfileCustomLinks')
    },
    addPrefixForSettingLinks (key, value) {
      let prefix = ''

      switch (key) {
        case 'facebook':
          prefix = `www.facebook.com/`
          break
        case 'instagram':
          prefix = `www.instagram.com/`
          break
        case 'snapchat':
          prefix = ``
          break
        case 'soundcloud':
          prefix = `www.soundcloud.com/`
          break
        case 'spotify':
          prefix = `www.open.spotify.com/`
          break
        case 'twitter':
          prefix = `www.twitter.com/`
          break
        default:
        // code block
      }

      return prefix + value
    }
  },
  created () {
    this.resetItems()
    this.getUserLayouts()
      .then(() => {
        this.getMiniProfileLinks()
        this.getCustomLinks()
      })


  },
  watch: {
    layout: function (newValue) {
      this.layoutId = newValue
      this.formData = []
      this.formFields = []
      this.resetItems()
      this.getMiniProfileLinks()
      this.getCustomLinks()
    }
  },
  computed: {
    ...mapGetters({
      settings: 'getSettings',
      userLayouts: 'MiniProfile/getUserLayouts'
    })
  }
}
</script>
