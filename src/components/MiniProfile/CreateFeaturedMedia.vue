<template>
  <v-card class="miniprofile-createfeaturedmedia">
    <v-card-title>
      Featured Media Embed
    </v-card-title>
    <v-card-subtitle>
      Paste a link to your video or song to embed. It will automatically embed YouTube, Spotify and other media.
      <br> <br> NOTE: The name is just for internal purposes and is not posted on the link.
    </v-card-subtitle>
    <v-card-text>
      <MiniProfileAddComponent v-if="!isComponentAddedToLayout" :component-name="$options.name" />
      <v-form
        v-model="valid"
        ref="featuredMediaForm"
        lazy-validation
        v-else
      >
        <v-container>
          <v-row>
            <v-col
              cols="12"
              md="5"
            >
              <v-text-field
                v-model="name"
                :rules="nameRules"
                label="Name"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="12"
            >
              <v-text-field
                v-model="url"
                :rules="urlRules"
                label="URL"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <v-btn
                :disabled="!valid || processing"
                :loading="processing"
                color="success"
                @click="submit"
              >
                Save
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
  </v-card>
</template>
<script>
import MiniProfileAddComponent from '@/components/MiniProfile/views/MiniProfileAddComponent'
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default {
  name: 'CreateFeaturedMedia',
  components: {
    MiniProfileAddComponent
  },
  data () {
    return {
      username: this.$store.getters.getSettings.account.general.username,
      url: null,
      name: null,
      valid: false,
      nameRules: [
        v => !!v || 'Name is required'
      ],
      urlRules: [
        v => !!v || 'A URL is required',
        v => /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?)/gi.test(v) || 'URL must be valid'
      ],
      processing: false
    }
  },
  methods: {
    async submit () {
      this.$refs.featuredMediaForm.validate()
      if (!this.valid) {
        return
      }
      this.processing = true
      try {
        await Vue.$http.post(`v1/user/mini-profile/media-embeds/featured`, {
          link: this.url,
          network: this.name,
          type: 'media',
          layout_id: this.layoutId
        })

        this.$noty.success('Saved successfully')
      } catch (error) {
        this.$noty.warning('Error Occurred while processing request.')
      }
      this.processing = false
      this.$root.$emit('updateLiveFeaturedMedia')
    },
    async getFeaturedMedia () {
      this.processing = true
      if (this.$refs.featuredMediaForm) {
        this.$refs.featuredMediaForm.resetValidation()
      }
      try {
        let response = await Vue.$http.get(`v1/user/mini-profile/media-embeds/featured`, {
          params: {
            layout_id: this.layoutId,
            username: this.username,
            type: 'media'
          }
        })
        if (response.status === 200) {
          if (response.data.hasOwnProperty('data')) {
            let result = response.data.data
            this.url = result.url
            this.name = result.network
          }
        }
      } catch (error) {
        this.$noty.warning('Error Occurred while processing request.')
        this.throwError(error)
        this.$sentry.captureException(error)

      }
      this.processing = false
    }
  },
  mounted () {
    this.getFeaturedMedia()
  },
  watch: {
    layout: function () {
      this.url = ''
      this.name = ''
      if (this.isComponentAddedToLayout) {
        this.getFeaturedMedia()
      }
    }
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
      return result.length ? true : false
    }
  }
}
</script>
<style>
</style>
