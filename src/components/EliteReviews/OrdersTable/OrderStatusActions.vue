<template>
  <v-flex v-if="pending" class="actions">
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon color="green" v-on="on" v-bind="attrs" small @click="approve" class="mr-2">
          <v-icon v-on="on" v-bind="attrs" small dark>
            mdi-thumb-up
          </v-icon>
        </v-btn>
      </template>
      <span>Approve</span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon color="red" v-on="on" v-bind="attrs" small @click="reject" class="mr-2">
          <v-icon v-on="on" v-bind="attrs" small dark>
            mdi-thumb-down
          </v-icon>
        </v-btn>
      </template>
      <span>Reject</span>
    </v-tooltip>
    <v-tooltip top v-if="hasFile">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon color="grey" v-on="on" v-bind="attrs" small v-if="assetURL" @click="download">
          <v-icon small dark>
            mdi-download
          </v-icon>
        </v-btn>
      </template>
      <span>Download</span>
    </v-tooltip>
    <v-tooltip top v-if="hasLink">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon color="grey" v-on="on" v-bind="attrs" small v-if="assetURL" :href="assetURL" target="_blank">
          <v-icon small dark>
            mdi-link
          </v-icon>
        </v-btn>
      </template>
      <span>Listen</span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-on="on" v-bind="attrs" @click="showOrder(order.order)">
          <v-icon small dark>
            mdi-arrow-right-bold-box
          </v-icon>
        </v-btn>
      </template>
      <span>View</span>
    </v-tooltip>
    <reject-modal ref="rejectModal" :loading="loading" @status-changed="onStatusChange" :order="order" />
  </v-flex>

  <v-flex v-else-if="processing" class="actions">
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-on="on" v-bind="attrs" small @click="start">
          <v-icon small dark>
            mdi-play-circle-outline
          </v-icon>
        </v-btn>
      </template>
      <span>Start</span>
    </v-tooltip>
    <v-tooltip top v-if="hasFile">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon color="grey" v-on="on" v-bind="attrs" small v-if="assetURL" @click="download">
          <v-icon small dark>
            mdi-download
          </v-icon>
        </v-btn>
      </template>
      <span>Download</span>
    </v-tooltip>
    <v-tooltip top v-if="hasLink">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon color="grey" v-on="on" v-bind="attrs" small v-if="assetURL" :href="assetURL" target="_blank">
          <v-icon small dark>
            mdi-link
          </v-icon>
        </v-btn>
      </template>
      <span>Listen</span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-on="on" v-bind="attrs" @click="showOrder(order.order)">
          <v-icon small dark>
            mdi-arrow-right-bold-box
          </v-icon>
        </v-btn>
      </template>
      <span>View</span>
    </v-tooltip>
  </v-flex>

  <v-flex v-else-if="started" class="actions">
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon color="green" v-on="on" v-bind="attrs" small @click="review">
          <v-icon small dark>
            mdi-check-circle-outline
          </v-icon>
        </v-btn>
      </template>
      <span>Review</span>
    </v-tooltip>
    <v-tooltip top v-if="hasFile">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon color="grey" v-on="on" v-bind="attrs" small v-if="assetURL" @click="download">
          <v-icon small dark>
            mdi-download
          </v-icon>
        </v-btn>
      </template>
      <span>Download</span>
    </v-tooltip>
    <v-tooltip top v-if="hasLink">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon color="grey" v-on="on" v-bind="attrs" small v-if="assetURL" :href="assetURL" target="_blank">
          <v-icon small dark>
            mdi-link
          </v-icon>
        </v-btn>
      </template>
      <span>Listen</span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-on="on" v-bind="attrs" @click="showOrder(order.order)">
          <v-icon small dark>
            mdi-arrow-right-bold-box
          </v-icon>
        </v-btn>
      </template>
      <span>View</span>
    </v-tooltip>
    <review-modal ref="reviewModal" :loading="loading" :questions="questions" :questionnaire="questionnaire" @status-changed="reviewed" :order="order" />
  </v-flex>

  <v-flex v-else-if="completed" class="actions">
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="grey" icon v-on="on" v-bind="attrs" small disabled>
          <v-icon small dark>
            mdi-check-circle
          </v-icon>
        </v-btn>
      </template>
      <span>Completed</span>
    </v-tooltip>
    <v-tooltip top v-if="hasFile">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon color="grey" v-on="on" v-bind="attrs" small v-if="assetURL" @click="download">
          <v-icon small dark>
            mdi-download
          </v-icon>
        </v-btn>
      </template>
      <span>Download</span>
    </v-tooltip>
    <v-tooltip top v-if="hasLink">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon color="grey" v-on="on" v-bind="attrs" small v-if="assetURL" :href="assetURL" target="_blank">
          <v-icon small dark>
            mdi-link
          </v-icon>
        </v-btn>
      </template>
      <span>Listen</span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-on="on" v-bind="attrs" @click="showOrder(order.order)">
          <v-icon small dark>
            mdi-arrow-right-bold-box
          </v-icon>
        </v-btn>
      </template>
      <span>View</span>
    </v-tooltip>
  </v-flex>
</template>

<script>
import Vue from 'vue'
import config from '@/config'
import {
  serialize
} from 'object-to-formdata'
import ReviewModal from '@/components/EliteReviews/OrdersTable/ReviewModal'
import RejectModal from '@/components/EliteReviews/OrdersTable/RejectModal'

export default {
  components: {
    ReviewModal,
    RejectModal
  },
  props: {
    order: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      loading: false,
      alert: null,
      public: false
    }
  },
  created: function () {
    if (this.order.public) {
      this.public = this.order.public
    }
  },
  computed: {
    questions: function () {
      return this.order.genre.questions
    },
    questionnaire: function () {
      return this.order.questionnaire
    },
    hasLink: function () {
      return this.order.asset === 'URL' && this.order.assetable.url
    },
    hasFile: function () {
      return this.order.asset === 'AUD' && this.order.assetable.uploaded
    },
    assetURL: function () {
      if (this.hasFile) {
        return config.REVIEW_REPUBLIK_API_URL + '/api/v1/files/review/' + this.order.process_uuid
      }

      if (this.hasLink) {
        return this.order.assetable.url
      }

      return false
    },
    pending: function () {
      return this.order.status === 'pending'
    },
    processing: function () {
      return this.order.status === 'processing'
    },
    started: function () {
      return this.order.status === 'started'
    },
    completed: function () {
      return this.order.status === 'reviewed' || this.order.status === 'completed'
    }
  },

  methods: {
    showOrder: function (uuid) {
      if (uuid) {
        this.$router.push('/orders/reviews/' + uuid)
      }
    },

    download: async function () {
      Vue.$http.get(this.assetURL, {
        responseType: 'blob'
      }).then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', this.order.assetable.title)
        document.body.appendChild(fileLink)
        fileLink.click()
      }).catch(err => {
        this.$noty.error('Whoops something went wrong downloading the file.')
        this.throwError(err)
      })
    },
    onStatusChange: async function (status, additional = {}) {
      this.loading = true
      const data = serialize({
        status,
        ...additional,
        ...{
          'uuid': this.order.uuid,
          'public': this.public
        }
      })
      const conf = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }

      try {
        const response = await Vue.$http.post(config.REVIEW_REPUBLIK_API_URL + `/api/v1/reviews/${this.order.uuid}`, data, conf)
        this.order.status = response.data.data.status
        this.$emit('status-changed', status)
        this.$noty.success('Status updated successfully')
      } catch (err) {
        console.log(err)
        this.$noty.error('Whoops something went wrong updating the status.')
        this.throwError(err)
      }
    },
    reject () {
      this.$refs.rejectModal.openModal()
    },
    review () {
      this.$refs.reviewModal.openModal()
    },
    approve () {
      this.onStatusChange('approved')
    },
    start () {
      this.onStatusChange('started')
    },
    rejected (status, data) {
      this.loading = true
      this.onStatusChange(status, data).then(() => {
        if (this.$refs.rejectModal) {
          this.$refs.rejectModal.closeModal()
        }
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.$noty.error('Whoops an error occured. Could not reject the order')
        this.loading = false
      })
    },
    reviewed (status, data) {
      this.loading = true
      this.onStatusChange(status, data).then(() => {
        if (this.$refs.reviewModal) {
          this.$refs.reviewModal.closeModal()
        }
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.$noty.error('Whoops an error occured. Could not finish the review')
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.actions {
  width: 100px;
  display: inline-flex;
  justify-content: center;
  align-items: baseline;
}
</style>
