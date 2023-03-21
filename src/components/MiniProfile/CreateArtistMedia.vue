<template>
  <v-card class="miniprofile-createartistmedia">
    <v-card-title>
      Artist Media Embed
    </v-card-title>
    <v-card-subtitle>
      Paste a link to your video or song to embed. It will automatically embed YouTube, Spotify and other media.
      <br> <br> NOTE: The name is just for internal purposes and is not posted on the link.
    </v-card-subtitle>
    <v-card-text>
      <MiniProfileAddComponent v-if="!isComponentAddedToLayout" :component-name="$options.name" />
      <div v-else>
        <v-alert
          outlined type="error" v-if="networkRequired"
        >At least One Network is required
        </v-alert
        >
        <v-alert
          outlined type="error" v-if="urlRequired"
        >At least One Url is required
        </v-alert
        >
        <validation-errors :errors="validationErrors" />
        <v-form v-model="valid" ref="featuredMediaForm">
          <v-container>
            <v-row v-for="item in items" :key="item">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="artist.networks[item]"
                  label="Name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="artist.urls[item]"
                  label="Embed URL"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-btn
                  :disabled="!valid || processing"
                  :loading="processing"
                  color="success"
                  @click="submit"
                  style="float:right;"
                >
                  Save
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
import Vue from 'vue'
import validationErrorsMixin from '@/shared/mixins/ValidationErrorsMixin'
import MiniProfileAddComponent from '@/components/MiniProfile/views/MiniProfileAddComponent'
import { mapGetters } from 'vuex'

export default {
  mixins: [validationErrorsMixin],
  name: 'CreateArtistMedia',
  components: {
    MiniProfileAddComponent
  },
  data () {
    return {
      username: this.$store.getters.getSettings.account.general.username,
      items: [0, 1, 2, 3],
      artist: {
        networks: [],
        urls: []
      },
      valid: false,
      urlRules: [
        v => !!v || 'A URL is required',
        v =>
          /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?)/gi.test(
            v
          ) || 'URL must be valid'
      ],
      processing: false,
      networkRequired: false,
      urlRequired: false
    }
  },
  methods: {
    async submit () {
      this.networkRequired = false
      this.urlRequired = false
      this.validationErrors = []

      let networks = this.artist.networks
      let urls = this.artist.urls

      if (networks.filter(Boolean).length === 0) {
        this.networkRequired = true
        return
      }

      if (urls.filter(Boolean).length === 0) {
        this.urlRequired = true
        return
      }

      this.processing = true
      try {
        let postData = []

        this.items.forEach(function (index) {
          if ((networks[index] !== undefined && networks[index] !== '') && (urls[index] !== undefined && urls[index] !== ''))
            postData.push({ url: urls[index], network: networks[index] })
        })

        await Vue.$http.post(`v1/user/mini-profile/media-embeds`, {
          items: postData,
          layout_id: this.layoutId,
          type: 'media'
        })

        this.$noty.success('Saved successfully')
        this.$root.$emit('updateLiveArtistMedia')
      } catch (error) {
        if (error.response.status === 422) {
          let errors = this.formatErrors(Object.values(error.response.data.errors))
          this.validationErrors = errors
        }
        this.throwError(error)
        this.$noty.warning('Error Occurred while processing request.')
      }
      this.processing = false
    },
    async getData () {
      if (this.isComponentAddedToLayout) {
        this.processing = true
        try {
          let response = await Vue.$http.get(`v1/user/mini-profile/media-embeds`, {
            params: {
              layout_id: this.layoutId,
              username: this.username,
              type: 'media'
            }
          })

          if (response.status === 200) {
            let result = response.data.data

            Object.entries(result).forEach(function (val) {
              this.artist.networks.push(val.network)
              this.artist.urls.push(val.url)
            }.bind(this))
          }
        } catch (error) {
          this.$noty.warning('Error Occurred while processing request.')
          this.throwError(error)
          this.$sentry.captureException(error)
        }
        this.processing = false
      }
    }
  },
  mounted () {
    this.getData()
  },
  watch: {
    isComponentAddedToLayout: function () {
      this.getData()
    }
  },
  computed: {
    ...mapGetters({
      layoutId: 'MiniProfile/getSelectedLayout',
      activeSetting: 'MiniProfile/getActiveSetting',
      liveLayoutData: 'MiniProfile/getLiveLayoutData'
    }),
    isComponentAddedToLayout () {
      let componentName = this.$options.name
      let result = this.liveLayoutData.filter(
        v => v.component === componentName
      )
      return result.length ? true : false
    }
  }
}
</script>
<style></style>
