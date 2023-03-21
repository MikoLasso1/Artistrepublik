<template>
  <v-card class="miniprofiles-createfeaturedmerchandise">
    <v-card-title>
      <h2>Featured Merchandise</h2>
    </v-card-title>
    <v-card-subtitle>
      Add or update your featured merch item.
    </v-card-subtitle>
    <v-form
      v-model="valid"
      ref="featuredMerchandiseForm"
    >
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="title"
              label="Title"
              :rules="titleRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="link"
              :rules="urlRules"
              label="URL"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-file-input
              label="Merch Image"
              v-model="file"
              :rules="showId ? [] : imgRules"
              accept="image/png, image/jpeg"
              required
              class="required"
            ></v-file-input>
          </v-col>
        </v-row>
        <v-btn
          id="previewArt"
          color="purple"
          v-if="savedImage"
          dark @click="previewArtWork"
          class="mr-4 my-2"
        >
          Preview Image
        </v-btn>
        <v-btn
          :disabled="!valid || processing"
          color="success"
          :loading="processing"
          @click="submit"
          class="my-2"
        >
          Submit
        </v-btn>
      </v-container>
    </v-form>
  </v-card>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'CreateFeaturedMerchandise',
  data () {
    return {
      username: this.$store.getters.getSettings.account.general.username,
      loading: false,
      title: null,
      file: null,
      link: null,
      valid: false,
      titleRules: [
        v => !!v || 'Title is required'
      ],
      imgRules: [
        v => !!v || 'Image is required'
      ],
      urlRules: [
        v => !!v || 'A URL is required',
        v => /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?)/gi.test(v) || 'URL must be valid'
      ],
      processing: false,
      savedImage: null,
      showId: null
    }
  },
  methods: {
    previewArtWork () {
      if (this.savedImage) {
        window.open(this.savedImage, '_blank')
      }
    },
    async submit () {
      this.$refs.featuredMerchandiseForm.validate()
      if (!this.valid) {
        return
      }

      this.validationErrors = ''
      this.processing = true
      let formData = new FormData()

      formData.append('image', this.file)
      formData.append('title', this.title)
      formData.append('link', this.link)
      formData.append('is_featured', 1)

      try {
        if (this.showId) {
          formData.append('_method', 'PUT')
          const response = await Vue.$http.post(
            `v1/user/mini-profile/merchandise/${this.showId}`,
            formData
          )
          this.fileDownloadUrl = response.data.data.image
          this.$noty.success('Updated successfully')
        } else {
          await Vue.$http.post(`v1/user/mini-profile/merchandise`, formData)
          this.$noty.success('Saved successfully')
          this.$refs.featuredMerchandiseForm.resetValidation()
        }
        this.getFeatured()
      } catch (error) {
        this.$noty.warning('Error Occurred while processing request.')
        this.throwError(error)
      }
      this.file = null
      this.processing = false
    },
    async getFeatured () {
      this.processingLinks = true
      try {
        let response = await Vue.$http.get(`v1/user/mini-profile/merchandise-feature`, {
          params: {
            username: this.username,
            layout_id: this.layout
          }
        })
        if (response.status === 200) {
          let result = response.data.data
          this.title = result.title
          this.savedImage = result.image
          this.link = result.link
          this.showId = result.id
        }
      } catch (error) {
        this.$sentry.captureException(error)
        this.$noty.warning('Error Occurred while processing request.')
        this.processingLinks = false
      }
    }
  },
  mounted () {
    this.getFeatured()
  },
  watch: {
    layout: function () {
      this.title = ''
      this.savedImage = ''
      this.link = ''
      this.showId = ''
      this.getFeatured()
    }
  }
}
</script>
<style></style>
