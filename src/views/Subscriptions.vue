<template>
  <div>
    <base-header type="gradient-primary" class="bg-subscriptions"></base-header>
    <v-container>
      <v-row>
        <v-col lg="9" cols="12">
          <v-card>
            <v-card-title class="primary white--text">
              <span class="headline">Active Subscriptions</span>
            </v-card-title>
            <v-data-table
              :loading="subscriptionsLoading"
              loading-text="Loading... Please wait"
              :headers="headers"
              :items="subscriptions"
              :expanded.sync="expanded"
              item-key="name"
              show-expand
              class="elevation-1"
            >
              <template v-slot:item.status="{ item }">
                {{ uppercase(item.status) }}
              </template>
              <template v-slot:item.price="{ item }">
                ${{ item.price }}
              </template>
              <template v-slot:item.created_at="{ item }">
                {{ item.created_at | formatDate }}
              </template>
              <template v-slot:item.ends_at="{ item }">
                {{ item.ends_at | formatDate }}
              </template>
              <template v-slot:item.cancel="{ item }">
                <v-btn color="red" :dark="item.ends_at === null" @click="openCancelModal(item)" :disabled="isCancelled(item)">Cancel</v-btn>
              </template>
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" class="py-3">
                  <billing-history :subscription="item" />
                </td>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
        <v-col lg="3" md="6" class="mt-lg-0 mt-3">
          <v-card>
            <v-card-title class="primary white--text">
              <span class="headline">Card</span>
            </v-card-title>
            <v-card-text>
              <card />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <cancel-subscription-modal ref="cancelModal" :subscription="selectedCancel" @canceled="loadData" />
  </div>
</template>

<script>
import Vue from 'vue'
import BillingHistory from '@/components/Subscriptions/BillingHistory'
import Card from '@/components/Subscriptions/Card'
import CancelSubscriptionModal from '@/components/Subscriptions/CancelSubscriptionModal'

export default {
  components: {
    BillingHistory,
    Card,
    CancelSubscriptionModal
  },
  metaInfo () {
    return {
      title: 'Subscriptions',
      meta: [
        {
          vmid: 'og:url',
          property: 'og:url',
          content: 'https://app.artistrepublik.com' + this.$route.fullPath
        }
      ]
    }
  },
  data: function () {
    return {
      subscriptionsLoading: true,
      selectedCancel: null,
      expanded: [],
      headers: [
        { text: 'Subscription Name', value: 'name' },
        { text: 'Status', value: 'status' },
        { text: 'Price', value: 'price' },
        { text: 'Start Date', value: 'created_at' },
        { text: 'End Date', value: 'ends_at' },
        { text: 'Cancel', value: 'cancel', sortable: false, align: 'center' },
        { text: 'History', value: 'data-table-expand', align: 'center' }
      ],
      subscriptions: []
    }
  },
  methods: {
    openCancelModal: function (item) {
      this.selectedCancel = item
      this.$refs.cancelModal.openDialog()
    },
    loadData: async function () {
      this.subscriptionsLoading = true
      let { data: { data } } = await Vue.$http.get('v1/subscription')
      this.subscriptions = data
      this.subscriptionsLoading = false
    },
    isCancelled (item) {
      if (item.ends_at !== null) return true
    }
  },
  mounted: function () {
    this.loadData()
  }
}
</script>

<style lang="scss" scoped>
.bg-subscriptions {
  padding-top: 25% !important;
}

@media screen and (min-width: 992px) {
  .bg-subscriptions {
    padding-top: 7.5% !important;
  }
}
</style>
