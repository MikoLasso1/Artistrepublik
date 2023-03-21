<template>
  <v-card class="mx-auto w-100" tile flat>
    <v-card-title class="pl-0">
      <h3 class="h3">Audio Engineer Order</h3>
    </v-card-title>

    <p class="body-1">
      <strong>Catalog:</strong> {{ productOrder.service.catalog.name }}<br />
      <strong>Service:</strong> {{ productOrder.service.title }}<br />
      <strong>Catagory:</strong> {{ productOrder.task.name }}<br />
      <strong>Type:</strong> {{ productOrder.subtask.name }}<br />
      <strong>Genre:</strong> {{ productOrder.engineer.genre.name }}<br />
      <strong>Revision:</strong> {{ productOrder.revision }}<br />
      <strong>Estimated Turnaround:</strong> {{ turnaround }}<br />
      <strong>Status:</strong> {{ productOrder.status }}<br />
      <strong>Price:</strong> {{ (productOrder.amount + productOrder.fee) | centsToDollar }}<br />
      <strong>Created:</strong> {{ productOrder.created_at | formatDateTime }}<br />
      <strong>Request:</strong> {{ productOrder.requests }}<br />
      <strong>Notes:</strong> {{ productOrder.notes }}<br />
    </p>
    <v-card v-if="canRevise" class="w-100" flat outline>
      <v-card-title class="headline">
        Ask for a revision
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <p class="body-1">Add any additional notes for this revision.</p>
        <v-form v-model="valid" ref="form">
          <v-row no-gutters align="center">
            <v-col cols="12">
              <div class="text-center">
                <v-textarea
                  v-model="order.order_data.requests" placeholder="Request" auto-grow outlined rows="6" row-height="15"
                  hint="Describe anything particulars about your new request below"
                ></v-textarea>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card-actions class="pl-0 btn-row">
      <v-btn class="download-btn" v-if="downloadURL" @click="download">Download Mastered File</v-btn>
      <v-btn class="normal-btn" v-if="canRevise" @click="revise">Send for revision</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Vue from 'vue'
import {
  serialize
} from 'object-to-formdata'

export default {
  props: {
    order: Object
  },
  data: function () {
    return {
      loading: false,
      valid: true,
      requestsRules: [
        v => !!v || 'Please fill in the more details on your request'
      ]
    }
  },
  computed: {
    turnaround: function () {
      return this.secondsToTime(this.productOrder.estimated_turnaround)
    },
    canRevise: function () {
      return this.productOrder.status === 'completed' && this.productOrder.revision < 2
    },
    downloadURL: function () {
      if (this.productOrder && this.productOrder.file) {
        return 'v1/audio-engineering/file/' + this.productOrder.file.id + '/download'
      }
      return false
    },
    productOrder: function () {
      return this.order.order_data ? this.order.order_data : {}
    }
  },
  methods: {
    secondsToTime: function (totalSeconds) {
      let days = Math.floor(totalSeconds / 86400)
      totalSeconds %= 86400
      let hours = Math.floor(totalSeconds / 3600)
      totalSeconds %= 3600
      let minutes = Math.floor(totalSeconds / 60)
      let seconds = totalSeconds % 60
      days = String(days)
      minutes = String(minutes).padStart(2, '0')
      hours = String(hours).padStart(2, '0')
      seconds = String(seconds).padStart(2, '0')
      return days + 'd ' + hours + ':' + minutes + ':' + seconds
    },
    download: async function () {
      Vue.$http.get(this.downloadURL, {
        responseType: 'blob'
      }).then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', this.productOrder.file.name)
        document.body.appendChild(fileLink)
        fileLink.click()
      }).catch(err => {
        this.throwError(err)
      })
    },
    revise: async function () {
      const data = serialize({
        status: 'pending-revision',
        requests: this.productOrder.requests,
        _method: 'PUT',
        'id': this.productOrder.id
      })
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }

      try {
        this.$emit('loading', true)
        this.$emit('status-changed', 'pending-revision')
        const response = await Vue.$http.post(`v1/audio-engineering/order/${this.productOrder.id}`, data, config)
        this.order.status = response.data.data.status
        this.$emit('loading', false)
        this.$emit('updated')
        this.$noty.success('Status updated successfully')
      } catch (err) {
        this.$emit('loading', false)
        this.throwError(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
hr {
  margin: .5rem 0;
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

.download-btn {
  color: #fff !important;
  background-color: #6a7383 !important;
  border-color: #6a7383 !important;
  font-family: 'Open Sans';
  text-transform: none;
  letter-spacing: normal;
  font-weight: 600;
}
</style>
