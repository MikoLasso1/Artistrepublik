<template>
  <v-dialog v-model="dialog" max-width="800">
    <loading-overlay :loading="updating" />
    <v-card>
      <v-card-title v-if="isReviewer" class="headline">Update your Elite Review Profile!</v-card-title>
      <v-card-title v-else class="headline">Create your Elite Review Profile!</v-card-title>
      <validation-errors :errors="validationErrors" />
      <v-row class="px-6 pb-4">
        <reviewer-terms v-if="step === 1" @updated-terms="setTerms" @proceed="proceed" />
        <reviewer-account v-else-if="step === 2" @updated-form="setAccountDetails" :reviewer="reviewer" @proceed="proceed" @prevent="prevent" />
        <reviewer-services v-else-if="step === 3" @updated-form="setServiceDetails" :reviewer="reviewer" @proceed="proceed" @prevent="prevent" />
      </v-row>
      <v-card-actions class="btn-row">
        <v-btn v-show="step === 1" class="cancel-btn" @click="close">Cancel</v-btn>
        <v-btn v-show="step > 1" class="back-btn" @click="back">Back</v-btn>
        <v-btn v-show="step !== 3" :disabled="!canGoForward" class="normal-btn" @click="next">Next</v-btn>
        <v-btn v-show="step === 3" :disabled="!canGoForward" class="normal-btn" @click="finish">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'
import config from '@/config'
import {
  serialize
} from 'object-to-formdata'
import ReviewerTerms from '@/components/EliteReviews/ReviewerModal/ReviewerTerms'
import ReviewerAccount from '@/components/EliteReviews/ReviewerModal/ReviewerAccount'
import ReviewerServices from '@/components/EliteReviews/ReviewerModal/ReviewerServices'
import LoadingOverlay from '@/components/LoadingOverlay'
import validationErrorsMixin from '@/shared/mixins/ValidationErrorsMixin'

const _ = require('lodash')
const dataDefault = {
  loading: false,
  dialog: false,
  agreed: false,
  canGoForward: false,
  step: 1,
  form: {},
  reviewer: {
    uuid: null,
    agreed: false,
    name: null,
    email: null,
    links: [],
    brand: null,
    description: null,
    img_url: null,
    orders_per_week: null,
    paypal_email: null,
    genres: [],
    services: [],
    suspended: null
  }
}

export default {
  mixins: [validationErrorsMixin],
  components: {
    ReviewerTerms,
    ReviewerAccount,
    ReviewerServices,
    LoadingOverlay
  },
  props: {
    settings: [Object],
    isReviewer: [Boolean]
  },
  data: function () {
    return {
      loading: false,
      dialog: false,
      agreed: false,
      canGoForward: false,
      step: 1,
      form: {},
      reviewer: {
        agreed: false,
        uuid: null,
        platform: null,
        name: null,
        email: null,
        links: [],
        brand: null,
        description: null,
        img: null,
        img_url: null,
        orders_per_week: null,
        paypal_email: null,
        genres: [],
        services: [],
        suspended: null
      }
    }
  },
  computed: {
    updating: function () {
      return this.loading || (this.isReviewer && !this.settings.uuid) || (this.isReviewer === undefined)
    },
    saveURL: function () {
      return this.isReviewer ? config.REVIEW_REPUBLIK_API_URL + '/api/v1/reviewers/' + this.reviewer.uuid : config.REVIEW_REPUBLIK_API_URL + `/api/v1/reviewers`
    }
  },
  watch: {
    settings: {
      handler: function (value) {
        if (this.isReviewer && value.uuid) {
          this.setReviewer()
          this.step = 2
        }
      },
      deep: true
    }
  },
  mounted () {
    if (this.isReviewer && this.settings.uuid) {
      this.setReviewer()
      this.step = 2
    }
  },
  methods: {
    next: function () {
      this.canGoForward = false
      this.step++
    },
    back: function () {
      this.canGoForward = false
      this.step--
    },
    cancel: function () {
      this.step = 0
      this.$emit('close')
    },
    proceed: function () {
      this.canGoForward = true
    },
    prevent: function () {
      this.canGoForward = false
    },
    open: function () {
      this.dialog = true
    },
    finish: async function () {
      await this.save()
    },

    save: async function () {
      this.loading = true
      this.form.platform = 'AR'
      this.form.uuid = this.$store.state.settings.account.uuid

      const formData = serialize({
        ...this.form
      })
      try {
        const response = await Vue.$http({
          method: 'POST',
          url: this.saveURL,
          data: formData,
          headers: {
            'content-type': 'multipart/form-data'
          }
        })

        if (response.status === 200 && response.data.data.reviewer) {
          this.$emit('success', response.data.data.reviewer)
          this.isReviewer ? this.$noty.success('Profile Updated Successfully') : this.$noty.success('Profile Created Successfully')
          this.reset()
        }
        this.close()
      } catch (error) {
        let items
        if (error.response.status === 422) {
          items = Object.values(error.response.data.errors)
          this.validationErrors = this.formatErrors(items)
        }

        this.$noty.error('Whoops something went wrong creating your profile.')
        this.throwError(error)
      }
      this.loading = false
    },
    reset () {
      Object.keys(dataDefault).forEach(k => {
        if (Object.prototype.hasOwnProperty.call(this.$data, k)) {
          this.$data[k] = dataDefault[k]
        }
      })
    },
    close: function () {
      this.step = 1
      this.dialog = false
      this.$emit('close')
    },
    setReviewer: function () {
      this.reviewer = _.cloneDeep(this.settings)
    },
    setTerms: function () {
      this.form.agreed = true
    },
    setAccountDetails: function (details) {
      this.form.name = details.name
      this.form.email = details.email
      this.form.links = _.cloneDeep(details.links)
    },
    setServiceDetails: function (services) {
      this.form.brand = services.brand
      this.form.description = services.description
      this.form.img_url = services.img_url
      this.form.img = services.img
      this.form.orders_per_week = services.orders_per_week
      this.form.paypal_email = services.paypal_email
      this.form.genres = _.cloneDeep(services.genres)
      this.form.services = _.cloneDeep(services.services)
    }
  }
}
</script>

<style>
.headline {
  justify-content: center;
}

.btn-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.normal-btn {
  color: white !important;
  background-color: #5e72e4 !important;
  font-family: 'Open Sans';
  text-transform: none;
  letter-spacing: normal;
  font-weight: 600;
}

.back-btn {
  color: #fff !important;
  background-color: #172b4d !important;
  border-color: #172b4d !important;
  font-family: 'Open Sans';
  text-transform: none;
  letter-spacing: normal;
  font-weight: 600;
}

.cancel-btn {
  color: #fff !important;
  background-color: #172b4d !important;
  border-color: #172b4d !important;
  font-family: 'Open Sans';
  text-transform: none;
  letter-spacing: normal;
  font-weight: 600;
}
</style>
