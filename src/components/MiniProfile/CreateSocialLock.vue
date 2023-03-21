<template>
  <v-row>
    <v-col sm="8" class="text-left">
      <v-form ref="form" v-model="valid">
        <div>
          <validation-errors :errors="validationErrors"></validation-errors>
        </div>
        <h3>Step 1</h3>
        <v-select
          :items="offerItems"
          label="Select what you want to offer for your lock gate"
          item-text="name"
          item-value="id"
          v-model="selectOffer"
          :rules="OfferItemsRules"
        ></v-select>

        <div v-if="selectOffer">
          <h3>Step 2</h3>
          <v-select
            :items="step2Items"
            label="Use your own file URL or an Uploaded file ?"
            item-text="name"
            item-value="id"
            v-model="selectMediaOption"
            :rules="step2Rules"
          ></v-select>

          <v-file-input
            v-if="selectMediaOption === 1"
            label="Upload Digital Download"
            v-model="file"
            :rules="fileRule"
          ></v-file-input>
          <div class="mt-2" v-if="selectMediaOption === 1">
            Download:
            <a :href="digitalDownloadUrl" target="_blank">{{ digitalDownloadUrl }}</a>
          </div>
          <v-text-field
            v-model="digitalDownloadUrl"
            v-if="selectMediaOption === 2"
            label="Digital Download URL"
            :rules="urlRule"
          ></v-text-field>

          <v-textarea
            label="Offer Description"
            v-model="offerDescription"
            outlined
          ></v-textarea>
        </div>

        <v-divider class="mb-3" :inset="false"></v-divider>

        <h3
          class="mb-3"
        >In order to get your digital download, the user must do the following:</h3>
        <div class="fans-must">
          <v-row>
            <v-col md="6" v-for="(item, index) in fansMustItems" :key="index">
              <v-checkbox class="mt-0" v-model="item.enabled" :label="item.name"></v-checkbox>

              <v-text-field
                v-if="item.showLink && item.enabled"
                v-model="item.link"
                label="URL"
                :value="item.link"
                :messages="`Example: ${item.sampleUrl || '' }`"
                class="mb-4"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>

        <v-btn
          :loading="processing"
          :disabled="processing"
          @click="saveLock()"
          color="primary"
        >Save
        </v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import Vue from 'vue'
import validationErrorsMixin from '@/shared/mixins/ValidationErrorsMixin'

export default {
  mixins: [validationErrorsMixin],
  data () {
    return {
      valid: false,
      processing: false,
      selectOffer: null,
      offerItems: [],
      OfferItemsRules: [
        v => !!v || 'Please select one option'
      ],
      selectMediaOption: null,
      step2Items: [
        { name: 'Upload File', id: 1 },
        { name: 'Paste Url', id: 2 }
      ],
      step2Rules: [
        v => !!v || 'Please select one option'
      ],
      file: null,
      fileRule: [
        () => {
          if (this.selectMediaOption === 1 && !this.file && this.digitalDownloadUrl === null) {
            return 'Please Upload file'
          } else {
            return true
          }
        }
      ],
      digitalDownloadUrl: null,
      urlRule: [
        v => !!v || 'Download Url is required',
        v => /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?)/gi.test(v) || 'Download Url must be valid'
      ],
      offerDescription: null,
      fansMustItems: [],
      item: null
    }
  },
  methods: {
    alreadySelected (savedOptions, id) {
      return savedOptions.filter(function (optionSaved) {
        return optionSaved.follow_option_id === id
      })
    },
    async getFansMustDoItems () {
      this.processing = true
      try {
        let followOptionsResponse = await Vue.$http.get(`v1/mini-profile/social-unlock-follow-options`)

        let OfferOptionsResponse = await Vue.$http.get(`v1/mini-profile/social-unlock-offer-options`)

        let savedLockResponse = await Vue.$http.get(`v1/user/mini-profile/social-unlock`)
        let savedLockData = savedLockResponse.data.data

        let options = followOptionsResponse.data.data
        this.offerItems = OfferOptionsResponse.data.data

        let allFollowOptions = []
        let $i = 0
        if (savedLockresponse.status === 200) {
          //update items
          this.selectOffer = savedLockData.offer_id
          this.offerDescription = savedLockData.offer_description
          this.selectMediaOption = savedLockData.url_or_upload
          this.digitalDownloadUrl = savedLockData.file_url
          var savedOptions = savedLockData.selected_options

          options.forEach(item => {
            let enabled = ''
            let option = ''

            enabled = this.alreadySelected(savedOptions, item.id)

            option = {
              id: item.id,
              name: item.name,
              enabled: false,
              link: '',
              showLink: item.url_field,
              sampleUrl: item.sample_url
            }

            if (enabled.length) {
              option.enabled = true
              option.link = enabled[0].url
            }

            allFollowOptions[$i] = option
            $i++
          })
        } else {
          options.forEach(item => {
            let option = ''

            option = {
              id: item.id,
              name: item.name,
              enabled: false,
              link: '',
              showLink: item.url_field,
              sampleUrl: item.sample_url
            }

            allFollowOptions[$i] = option
            $i++
          })
        }
        this.fansMustItems = allFollowOptions

        this.processing = false
      } catch (error) {
        this.processing = false
      }
    },
    async saveLock () {
      this.$refs.form.validate()
      let notValid = false
      if (!this.valid) {
        return
      }

      let selectedFansMust = this.fansMustItems.filter(function (item) {
        return item.enabled === true
      })


      this.validationErrors = []
      if (selectedFansMust.length === 0) {
        this.validationErrors.push('Please select atleast one \'The user must do\' item')
        return
      } else {
        selectedFansMust.forEach(item => {
          if (item.showLink === 1 && !item.link) {
            let errorMessage = `Url is missing for '${item.name}'`
            this.validationErrors.push(errorMessage)
            this.$noty.warning(errorMessage)
            notValid = true
          }
        })
      }

      if (notValid)
        return

      try {
        this.processing = true
        let formData = new FormData()

        formData.append('offer_id', this.selectOffer)
        formData.append('media_id', this.selectMediaOption)
        if (this.selectMediaOption === 2)
          formData.append('url', this.digitalDownloadUrl)
        else
          formData.append('digital_downlod_file', this.file)

        let selectedFansMust = this.fansMustItems.filter(function (item) {
          return item.enabled === true
        })

        formData.append('offer_description', this.offerDescription)
        formData.append('selected_follow_options', JSON.stringify(selectedFansMust))
        formData.append('_method', 'POST')

        const response = await Vue.$http.post(
          `v1/user/mini-profile/social-unlock`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        this.digitalDownloadUrl = response.data.data.file_url
        this.$emit('unlock-id', response.data.data.id)
        this.$noty.success('Updated successfully')
        this.$root.$emit('updateLiveSocialUnlock')
        this.processing = false
      } catch (error) {
        let items
        this.$sentry.captureException(error)
        if (error.response.status === 400) {
          items = Object.values(error.response.data.data.message)
        }
        this.validationErrors = this.formatErrors(items)
        this.$noty.warning('Error Occurred while processing request.')
        this.processing = false

      }
    },
    getLock () {

    }
  },
  mounted () {
    this.getFansMustDoItems()
    this.getLock()
  }
}
</script>

<style>
.fans-must .v-label {
  margin-bottom: 0;
}
</style>
