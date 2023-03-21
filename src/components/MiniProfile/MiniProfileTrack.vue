<template>
  <v-card>
    <v-card-title>Featured Track</v-card-title>
    <v-card-subtitle>Select Featured Track</v-card-subtitle>
    <v-card-text class="mt-4">
      <div class="mb-4">
        <MiniProfileAddComponent v-if="!isComponentAddedToLayout" :component-name="$options.name" />
        <v-row v-else>
          <v-col>
            <v-form ref="form" v-model="valid">
              <v-text-field v-model="name" :rules="nameRules" label="Song Name" required></v-text-field>
              <v-text-field v-model="link" :rules="linkRules" label="Song Url" required></v-text-field>
              <v-file-input :rules="fileRule" label="Song Image" accept="image/png, image/jpeg" v-model="file"></v-file-input>
              <div class="mt-2" v-if="fileDownloadUrl">
                Download:
                <a :href="fileDownloadUrl" target="_blank">{{ fileDownloadUrl }}</a>
              </div>

              <v-btn
                :loading="processing"
                :disabled="processing"
                @click="updateTrack"
                color="primary"
              >Save
              </v-btn>
            </v-form>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import MiniProfileAddComponent from '@/components/MiniProfile/views/MiniProfileAddComponent'

export default {
  name: 'MiniProfileTrack',
  components: {
    MiniProfileAddComponent
  },
  data () {
    return {
      valid: false,
      username: this.$store.getters.getSettings.account.general.username,
      processing: false,
      layoutId: this.layout,
      name: '',
      nameRules: [
        v => !!v || 'Name is required'
      ],
      link: '',
      linkRules: [
        v => !!v || 'Song url is required',
        v => /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?)/gi.test(v) || 'Song url must be valid'
      ],
      file: null,
      fileRule: [
        () => {
          if (!this.file && this.fileDownloadUrl === null) {
            return 'Please Upload file'
          } else {
            return true
          }
        }
      ],
      fileDownloadUrl: null
    }
  },

  methods: {
    getTrack () {
      this.processing = true
      Vue.$http
        .get(`v1/user/mini-profile/track`, {
          params: {
            username: this.username
          }
        })
        .then(response => {
          if (response.status === 200) {
            let res = response.data.data
            this.name = res.song_name
            this.link = res.song_link
            this.fileDownloadUrl = res.song_image
          }
        })
        .catch(error => {
          this.$sentry.captureException(error)
        })
        .then(() => (this.processing = false))
    },
    async updateTrack () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }

      this.validationErrors = ''
      this.processing = true
      this.$noty.info('Processing Request...')
      let formData = new FormData()

      formData.append('song_image', this.file)
      formData.append('song_name', this.name)
      formData.append('song_link', this.link)

      try {
        const response = await Vue.$http.post(
          `v1/user/mini-profile/track`,
          formData
        )
        let res = response.data.data
        this.fileDownloadUrl = res.song_image
        this.$noty.success('Track Updated successfully')
        this.$root.$emit('updateLiveFeaturedTrack')
        this.processing = false
      } catch (error) {
        this.$noty.warning('Error Occurred while processing request.')
        this.processing = false
      }
    },
    onSubmit () {
    }
  },
  created () {
    this.getTrack()
  },
  computed: {
    ...mapGetters({
      liveLayoutData: 'MiniProfile/getLiveLayoutData'
    }),
    isComponentAddedToLayout () {
      let componentName = this.$options.name
      let result = this.liveLayoutData.filter(
        v => v.component === componentName
      )
      return result.length ? result[0].componentFE : false
    }
  }
}
</script>
