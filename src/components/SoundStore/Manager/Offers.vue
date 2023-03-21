<template>
  <div>
    <div class="d-flex">
      <v-spacer></v-spacer>
      <v-select
        v-model="status"
        :items="statusOptions"
        label="Status"
      ></v-select>
    </div>
    <v-data-table
      :headers="headers"
      :items="offers"
      :loading="loading"
    >
      <template #item.uuid="{ item }">
        {{ item.uuid.substr(0, 10) }}...&nbsp;
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
              mdi-dots-horizontal
            </v-icon>
          </template>
          <span>{{ item.uuid }}</span>
        </v-tooltip>
      </template>
      <template #item.amount="{ item }">
        ${{ item.amount }}
      </template>
      <template #item.status="{ item }">
        <v-select
          v-model="item.status"
          :items="offerStatusOptions"
          @change="statusChanged(item.uuid, item.status)"
        ></v-select>
      </template>
      <template #item.created_at="{ item }">
        {{ item.created_at | formatDateTime }}
      </template>
    </v-data-table>
    <confirmation-modal ref="confirmStatusChangeModal" :on-continue="statusModalContinue">
      <p v-if="selectedStatus === `accepted`">
        Are you sure you want to accept this offer?
        <br />
        The buyer will have 48 hours to pay and the other offers for this beat will be hidden for 48 hours. If the buyer does not pay, you will have access to those other offers.
        <br />
        Keep in mind this an exclusive offer for the beat.
      </p>
      <p v-else>
        Are you sure you wish to decline this offer?
      </p>
    </confirmation-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import ConfirmationModal from '@/components/ConfirmationModal'

export default {
  components: {
    ConfirmationModal
  },
  data: function () {
    return {
      loading: false,
      offers: [],
      headers: [
        { text: 'ID', value: 'uuid' },
        { text: 'Beat', value: 'beat.name' },
        { text: 'Price', value: 'amount' },
        { text: 'Status', value: 'status' },
        { text: 'Offered At', value: 'created_at' }
      ],
      status: 'pending',
      statusOptions: [
        { text: 'Pending', value: 'pending' },
        { text: 'Accepted', value: 'accepted' },
        { text: 'Declined', value: 'declined' }
      ],
      offerStatusOptions: [
        { text: 'Pending', value: 'pending', disabled: true },
        { text: 'Accepted', value: 'accepted' },
        { text: 'Declined', value: 'declined' }
      ],
      selectedStatus: null,
      selectedUuid: null
    }
  },
  watch: {
    status: function () {
      this.loadData()
    }
  },
  methods: {
    loadData: async function () {
      this.loading = true
      try {
        let { data: { data } } = await Vue.$http.get(`v1/sound-store/offer?status=${this.status}`)
        this.offers = data
      } catch (err) {
        this.throwError(err)
      }
      this.loading = false
    },
    statusChanged: function (uuid, status) {
      this.selectedStatus = status
      this.selectedUuid = uuid
      this.$refs.confirmStatusChangeModal.openModal()
    },
    statusModalContinue: async function () {
      this.loading = true
      try {
        await Vue.$http.put(`v1/sound-store/offer/${this.selectedUuid}`, { status: this.selectedStatus })
      } catch (err) {
        this.throwError(err)
      }
      await this.loadData()
    }
  },
  created: function () {
    this.loadData()
  }
}
</script>

<style>

</style>
