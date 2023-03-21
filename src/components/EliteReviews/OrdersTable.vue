<template>
  <v-card flat class="w-100" style="min-height: 300px;">
    <v-tabs v-model="tab">
      <v-tab>Pending</v-tab>
      <v-tab>In Queue</v-tab>
      <v-tab>Started</v-tab>
      <v-tab>Completed</v-tab>
    </v-tabs>
    <v-card-text>
      <v-data-table :headers="headers" :items="data" :loading="loading" :options.sync="tableOptions" :server-items-length="total">
        <template #item.total="{ item }">
          ${{ item.total }}
        </template>
        <template #item.orderable.status="{ item }">
          <span>{{ uppercase(item.orderable.status) }}</span>
        </template>
        <template #item.seller="{ item }">
          <router-link :to="{path: `/elite-reviews/reviewer/${item.seller.uuid}`}">
            {{ item.seller.brand }}
          </router-link>
        </template>
        <template #item.orderable.created_at="{ item }">
          {{ item.orderable.created_at | formatDateTime }}
        </template>
        <template #item.actions="{ item }">
          <order-status-actions v-if="manageOrders" @error="showError" @status-changed="(status) => statusChanged(item, status)" :order="formatOrder(item)" />
          <v-btn v-else @click="showOrder(item.uuid)">
            <v-icon dark>
              mdi-arrow-right-bold-box
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from 'vue'

const _ = require('lodash')
import config from '@/config'
import OrderStatusActions from '@/components/EliteReviews/OrdersTable/OrderStatusActions'

export default {
  components: {
    OrderStatusActions
  },
  props: {
    manageOrders: {
      type: Boolean,
      default: false
    },
    seller: String,
    buyer: String
  },
  data: function () {
    return {
      alert: null,
      tab: null,
      loading: false,
      data: [],
      headers: [{
        text: 'Order ID',
        value: 'uuid',
        sortable: false
      },
        {
          text: 'Product',
          value: 'product.name',
          sortable: false
        },
        {
          text: 'Status',
          value: 'orderable.status',
          sortable: false
        },
        {
          text: 'Seller',
          value: 'seller.brand',
          sortable: false
        },
        {
          text: 'Total',
          value: 'total'
        },
        {
          text: 'Ordered On',
          value: 'orderable.created_at'
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false
        },
        {
          text: '',
          value: 'data-table-expand'
        }
      ],
      filters: {
        product: 'REV',
        paid: true,
        orderable: {
          status: 'pending'
        }
      },
      total: 0,
      tableOptions: {}
    }
  },
  watch: {
    seller: function () {
      if (this.manageOrders && this.seller) {
        this.fetchData()
      }
    },
    tableOptions: {
      handler: function () {
        if (this.manageOrders && !this.seller) {
          return
        }
        this.fetchData()
      },
      deep: true
    },
    tab: function () {
      if (this.manageOrders && !this.seller) {
        return
      }
      this.data = []
      this.fetchData()
    }
  },
  computed: {
    options: function () {
      return {
        sort: {
          column: this.tableOptions.sortBy[0] ? this.tableOptions.sortBy[0] : 'created_at',
          direction: this.tableOptions.sortDesc[0] ? this.tableOptions.sortDesc[0] : 'desc'
        },
        pagination: {
          page: this.tableOptions.page,
          ipp: this.tableOptions.itemsPerPage
        }
      }
    },
    tabStatus: function () {
      switch (this.tab) {
        case 0:
          return 'pending'
        case 1:
          return 'processing'
        case 2:
          return 'started'
        case 3:
          return ['reviewed', 'finalizing', 'completed']
      }
      return ''
    }
  },
  methods: {
    showError (err) {
      console.log(err)
      this.alert = 'Oops something went wrong'
    },
    statusChanged (item, status) {
      item.orderable.status = status
      this.fetchData()
    },
    formatOrder: function (item) {
      return {
        order: item.uuid,
        ...item.orderable
      }
    },
    showOrder: function (uuid) {
      if (uuid) {
        this.$router.push('/orders/reviews/' + uuid)
      }
    },
    removeEmptyObjects (obj) {
      return _(obj)
        .pickBy(_.isObject) // pick objects only
        .mapValues(this.removeEmptyObjects) // call only for object values
        .omitBy(_.isEmpty) // remove all empty objects
        .assign(_.omitBy(obj, _.isObject)) // assign back primitive values
        .value()
    },
    serializeQuery (params, prefix) {
      const query = Object.keys(params).map((key) => {
        const value = params[key]
        if (params[key] === undefined || params[key] === null) {
          delete params[key]
          return
        }
        if (params.constructor === Array) {
          key = `${prefix}[]`
        } else if (params.constructor === Object) {
          key = (prefix ? `${prefix}[${key}]` : key)
        }

        if (typeof value === 'object') {
          return this.serializeQuery(value, key)
        } else {
          return `${key}=${encodeURIComponent(value)}`
        }
      })

      return [].concat.apply([], query).join('&')
    },
    fetchData: async function () {
      this.loading = true

      if (this.manageOrders) {
        this.filters.seller = this.seller
      }

      if (!this.manageOrders) {
        this.filters.buyer = this.buyer
      }

      this.filters.orderable.status = this.tabStatus

      const params = this.serializeQuery(this.removeEmptyObjects({
        filters: this.filters,
        page: this.options.pagination.page,
        options: this.options
      }, _.identity))

      Vue.$http.get(config.REVIEW_REPUBLIK_API_URL + `/api/v1/orders?${params}`)
        .then(response => {
          this.loading = false
          this.data = response.data.data
          if (response.data.meta) {
            this.total = response.data.meta.total
            this.tableOptions.page = response.data.meta.current_page
            this.tableOptions.itemsPerPage = response.data.meta.per_page
          }
        }).catch(() => this.loading = false)
    }
  }
}
</script>

<style>

</style>
