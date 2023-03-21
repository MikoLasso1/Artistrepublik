<template>
  <div>
    <v-select
      v-if="selectedValue === 'pending' || selectedValue === 'denied'"
      v-model="selected"
      :items="options"
      :label="selectedValue"
      item-text="text"
      item-value="value"
      class="required"
      @change="updateSelectedItem(selected)"
    ></v-select>

    <v-btn
      v-if="this.selectedValue === 'approved' || this.selectedValue === 'published'"
      small
      outlined
      color="primary"
      @click="updatePublicationLink()"
    >
      <span v-if="publication_link">Update Link</span>
      <span v-else>Add Link</span>
    </v-btn>

    <v-dialog
      v-model="show"
      id="modal-denied"
      max-width="300"
    >
      <v-card>
        <v-card-title>
          <h2 class="m-0">Are You Sure?</h2>
        </v-card-title>
        <v-card-subtitle>
          Confirmation
        </v-card-subtitle>
        <v-card-text>
          <p>The buyer will receive a refund and the money refunded will be removed from your payout.</p>
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="processDeniedStatus"
            color="error"
            class="m-1"
          >Deny Order
          </v-btn>
          <v-btn
            @click="closeModal"
            color="success"
            class="m-1"
          >Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import 'vuejs-noty/dist/vuejs-noty.css'
import Vue from 'vue'

export default {
  props: {
    selectedValue: [String, null],
    orderId: [Number, String],
    orderLink: [String, null]
  },
  data () {
    return {
      show: false,
      selected: this.selectedValue,
      publication_link: this.orderLink,
      options: [
        { value: 'pending', text: 'Pending' },
        { value: 'approved', text: 'Approve' },
        { value: 'denied', text: 'Deny' }
      ],
      processing: false
    }
  },
  methods: {
    updateSelectedItem (option) {
      if (option === 'denied') {
        this.openModal()
      } else {
        this.httpRequest({
          status: option
        })
      }
    },
    openModal () {
      this.show = true
    },
    closeModal () {
      this.show = false
    },
    processDeniedStatus () {
      this.httpRequest({
        status: 'denied'
      })
      this.closeModal()
    },
    updatePublicationLink () {
      this.$emit('update:link', this.orderId, this.publication_link)
    },
    httpRequest (data) {
      this.processing = true
      this.$noty.info('Processing Request...')
      Vue.$http.patch(`v1/press-release/order/${this.orderId}`, data)
        .then(() => {
          this.$noty.success('Link added successfully.')
        })
        .catch(() => {
          this.$noty.warning('Error Occurred while processing request.')
        })
        .then(() => {
          this.processing = false
          this.closeModal()
        })
    }
  }
}
</script>
<style>
</style>
