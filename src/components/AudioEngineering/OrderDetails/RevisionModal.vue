<template>
  <v-dialog v-model="dialog" :loading="loading" :retain-focus="false" max-width="400">
    <v-card>
      <v-card-title class="headline">
        Ask for a revision
        <v-spacer></v-spacer>
        <v-icon @click="dialog = false">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <p class="body-1">Add any additional notes for this revision.</p>
        <v-form v-model="valid" ref="form">
          <v-row no-gutters align="center">
            <v-col cols="12">
              <div class="text-center">
                <v-textarea value="Hi" placeholder="Request" auto-grow outlined rows="6" row-height="15" hint="Describe anything particulars about your new request below"></v-textarea>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="update">Update</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
      dialog: false,
      valid: true,
      requestsRules: [
        v => !!v || 'Please fill in the more details on your request'
      ]
    }
  },
  methods: {
    openModal: function () {
      this.dialog = true
    },
    update: async function () {
      const data = serialize({
        status: 'pending-revision',
        requests: this.order.requests,
        _method: 'PUT',
        'id': this.order.id
      })
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }

      try {
        this.loading = true
        this.$emit('status-changed', 'pending-revision')
        const response = await Vue.$http.post(`v1/audio-engineering/order/${this.order.id}`, data, config)
        this.order.status = response.data.data.status
        this.loading = false
        this.$noty.success('Status updated successfully')
      } catch (err) {
        this.loading = false
        this.throwError(err)
      }
    }
  }
}
</script>

<style>

</style>
