<template>
  <v-row>
    <v-col>
      <v-form ref="form" v-model="valid">
        <div>
          <validation-errors :errors="validationErrors"></validation-errors>
        </div>
        <v-text-field
          v-model="title"
          :rules="titleRules"
          label="Title"
          required
        ></v-text-field>
        <v-text-field
          v-model="link"
          :rules="linkRules"
          label="Link"
          required
        ></v-text-field>
        <v-file-input
          label="Image"
          accept="image/png, image/jpeg"
          :rules="fileRules"
          v-model="file"
        ></v-file-input>
        <div class="mt-2" v-if="fileDownloadUrl">
          Download:
          <a :href="fileDownloadUrl" target="_blank">{{ fileDownloadUrl }}</a>
        </div>
        <v-btn
          :loading="processing"
          :disabled="processing"
          @click="addMerchandise"
          color="primary"
        >
          <span v-if="showId">Edit</span>
          <span v-else>Add</span>
        </v-btn>
      </v-form>
    </v-col>
    <VuetifyProgressDialog
      message="Processing Request"
      v-if="processing"
    ></VuetifyProgressDialog>
  </v-row>
</template>
<script>
import Vue from 'vue'
import validationErrorsMixin from '../../shared/mixins/ValidationErrorsMixin'
import VuetifyProgressDialog from '../../shared/components/VuetifyProgressDialog'

export default {
  name: 'MiniProfileAddMerchandise',
  mixins: [validationErrorsMixin],
  props: {
    showId: {
      type: [Number, String],
      default: null
    },
    showDetails: {
      default: null
    }
  },
  components: {
    VuetifyProgressDialog
  },
  data () {
    return {
      valid: false,
      processing: false,
      title: this.showDetails ? this.showDetails.title : null,
      titleRules: [v => !!v || 'Title is required'],
      link: this.showDetails ? this.showDetails.link : null,
      linkRules: [
        v => !!v || 'Link is required',
        v =>
          /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?)/gi.test(
            v
          ) || 'Link must be valid'
      ],
      fileRules: [
        v => {
          if (this.showId === null) {
            return !!v || 'Image is required'
          } else {
            return true
          }
        }
      ],
      file: null,
      fileDownloadUrl: this.showDetails ? this.showDetails.image : null
    }
  },
  methods: {
    async addMerchandise () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }

      this.validationErrors = ''
      this.processing = true
      this.$noty.info('Processing Request...')
      let formData = new FormData()

      formData.append('image', this.file)
      formData.append('title', this.title)
      formData.append('link', this.link)
      formData.append('layout_id', 3)

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
          this.$noty.success('Added successfully')

          this.title = null
          this.link = null
          this.file = null
        }
        this.file = null
        this.processing = false
        this.$emit('get-all-merchandise')
        this.$emit('close')
        this.$root.$emit('updateLiveMerch')
      } catch (error) {
        this.file = null
        this.$noty.warning('Error Occurred while processing request.')
        this.processing = false
      }
    }
  },
  watch: {
    showDetails: function (newVal) {
      this.title = newVal.title
      this.link = newVal.link
      this.fileDownloadUrl = newVal.image
    }
  }
}
</script>
