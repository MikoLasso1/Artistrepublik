<template>
  <v-flex v-if="pending" style="width: 100px">
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
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon color="grey" v-on="on" v-bind="attrs" small v-if="downloadURL" @click="download">
          <v-icon small dark>
            mdi-download
          </v-icon>
        </v-btn>
      </template>
      <span>Download</span>
    </v-tooltip>
    <reject-order-modal ref="rejectModal" @status-changed="onStatusChange" :order="order" />
  </v-flex>

  <v-flex v-else-if="processing" style="width: 100px">
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
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-on="on" v-bind="attrs" small v-if="downloadURL" @click="download">
          <v-icon small dark>
            mdi-download
          </v-icon>
        </v-btn>
      </template>
      <span>Download</span>
    </v-tooltip>
  </v-flex>

  <v-flex v-else-if="started" style="width: 100px">
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon color="green" v-on="on" v-bind="attrs" small @click="complete">
          <v-icon small dark>
            mdi-check-circle-outline
          </v-icon>
        </v-btn>
      </template>
      <span>Complete</span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon color="grey" v-on="on" v-bind="attrs" small v-if="downloadURL" @click="download">
          <v-icon small dark>
            mdi-download
          </v-icon>
        </v-btn>
      </template>
      <span>Download</span>
    </v-tooltip>
    <complete-order-modal ref="completeModal" @status-changed="onStatusChange" :order="order" />
  </v-flex>

  <v-flex v-else-if="completed" style="width: 100px">
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
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-on="on" v-bind="attrs" small v-if="downloadURL" @click="download">
          <v-icon small dark>
            mdi-download
          </v-icon>
        </v-btn>
      </template>
      <span>Download</span>
    </v-tooltip>
  </v-flex>
</template>

<script>
import Vue from 'vue'
import {
  serialize
} from 'object-to-formdata'
import CompleteOrderModal from '@/components/AudioEngineering/OrdersTable/CompleteOrderModal'
import RejectOrderModal from '@/components/AudioEngineering/OrdersTable/RejectOrderModal'

export default {
  components: {
    CompleteOrderModal,
    RejectOrderModal
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
      file: null
    }
  },
  computed: {
    downloadURL: function () {
      if (this.order.original_file) {
        return 'v1/audio-engineering/order/file/' + this.order.original_file.id + '/download'
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
      return this.order.status === 'completed'
    }
  },
  methods: {

    download: async function () {
      Vue.$http.get(this.downloadURL, {
        responseType: 'blob'
      }).then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', this.order.original_file.name)
        document.body.appendChild(fileLink)
        fileLink.click()
      }).catch(err => {
        this.throwError(err)
      })
    },
    onStatusChange: async function (status, additional = {}) {
      const data = serialize({
        status,
        ...additional,
        ...{
          _method: 'PUT',
          'id': this.order.id
        }
      })
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }

      try {
        this.$emit('status-changed', this.order.status)
        const response = await Vue.$http.post(`v1/audio-engineering/order/${this.order.id}`, data, config)
        this.order.status = response.data.data.status
        this.$noty.success('Status updated successfully')
      } catch (err) {
        this.throwError(err)
      }
    },
    approve () {
      this.onStatusChange('approved')
    },
    reject () {
      this.$refs.rejectModal.openModal()
    },
    start () {
      if (this.order.revision > 0) {
        this.onStatusChange('started-revision')
      } else {
        this.onStatusChange('started')
      }
    },
    complete () {
      this.$refs.completeModal.openModal()
    }
  }
}
</script>

<style scoped>

</style>
