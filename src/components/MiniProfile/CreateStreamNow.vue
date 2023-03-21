<template>
  <v-card class="miniprofile-createstreamnow">
    <v-card-title>
      Stream Now Button
    </v-card-title>
    <v-card-subtitle>
      Add or update your stream now button.
    </v-card-subtitle>
    <v-card-text>
      <MiniProfileAddComponent v-if="!isComponentAddedToLayout" :component-name="$options.name" />
      <v-form
        v-model="valid"
        ref="streamNowForm"
        lazy-validation
        v-else
      >
        <v-container>
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="name"
                :rules="nameRules"
                label="Name"
                required
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="url"
                :rules="urlRules"
                label="URL"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <v-btn
                :disabled="!valid || processing"
                color="success"
                style="float:right"
                :loading="processing"
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
import Vue from 'vue'
import { mapGetters } from 'vuex'
import MiniProfileAddComponent from '@/components/MiniProfile/views/MiniProfileAddComponent'

export default {
  name: 'CreateStreamNow',
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
      this.$refs.streamNowForm.validate()
      if (!this.valid) {
        return
      }
      this.processing = true
      try {
        await Vue.$http.post(`v1/user/mini-profile/media-embeds/featured`, {
          link: this.url,
          network: this.name,
          type: 'stream',
          layout_id: this.layoutId
        })
        this.$root.$emit('updateLiveStreamNow')
        this.$noty.success('Saved successfully')
      } catch (error) {
        this.$noty.warning('Error Occurred while processing request.')
      }
      this.processing = false
    },
    async getFeaturedMedia () {
      if (this.isComponentAddedToLayout) {
        this.processing = true
        if (this.$refs.streamNowForm) {
          this.$refs.streamNowForm.resetValidation()
        }
        try {
          let response = await Vue.$http.get(`v1/user/mini-profile/media-embeds/featured`, {
            params: {
              layout_id: this.layoutId,
              username: this.username,
              type: 'stream'
            }
          })

          if (response.status === 200) {
            let result = response.data.data
            this.url = result.url
            this.name = result.network
          }
        } catch (error) {
          this.$noty.warning('Error Occurred while processing request.')
          this.throwError(error)
        }
        this.processing = false
      }
    }
  },
  mounted () {
    this.getFeaturedMedia()
  },
  watch: {
    layout: function () {
      this.url = ''
      this.name = ''
      this.getFeaturedMedia()
    },
    isComponentAddedToLayout: function () {
      this.getFeaturedMedia()
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
<style>
</style>
