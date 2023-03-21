<template>
  <div>
    <table
      class="table tablesorter table align-items-center table-flush orders"
    >
      <thead class="thead-light">
      <tr>
        <th scope="col" class="header">Order Id</th>
        <th scope="col" class="header">Ordered At</th>
        <th scope="col" class="header">Seller</th>
        <th scope="col" class="header">Order Type</th>
        <th scope="col" class="header">Quantity</th>
        <th scope="col" class="header">Total</th>
        <th scope="col" class="header">Status</th>
      </tr>
      </thead>
      <tbody class="list">
      <tr
        v-for="order in orders"
        :key="order.uuid"
        class="row-contact"
        @click.prevent="showOrderModal(order.uuid)"
      >
        <td class="content">
          {{ order.id }}
        </td>
        <td class="content">
          {{ dateTimeFormat(order.created_at) }}
        </td>
        <td class="content">
          <router-link
            v-if="order.order_data && order.order_data.seller"
            :to="{ path: `/${order.order_data.seller.username}` }"
          >
            {{ order.order_data.seller.first_name }}
            {{ order.order_data.seller.last_name }}
          </router-link>
          <span v-else>Artist Republik</span>
        </td>
        <td class="content">
          {{ getType(order.type) }}
        </td>
        <td class="content">
          {{ order.quantity ? order.quantity : 1 }}
        </td>
        <td class="content">${{ Number(order.price).toFixed(2) }}</td>
        <td class="content">
          {{ uppercase(order.status) }}
        </td>
      </tr>
      </tbody>
    </table>
    <OrderModal ref="OrderModal" :selected-uuid="selectedUUID" />
  </div>
</template>

<script>
import moment from 'moment'
import OrderModal from '@/components/Orders/OrderModal'

export default {
  components: {
    OrderModal
  },
  props: {
    orders: Array
  },
  data: function () {
    return {
      selectedUUID: null
    }
  },
  methods: {
    dateTimeFormat: function (dateTime) {
      return moment(dateTime).format('MM-DD-YYYY hh:mm A')
    },
    getType: function (type) {
      if (type === 'curator') {
        return 'Curatorship'
      } else if (type === 'gwu') {
        return 'GWU'
      } else if (type === 'press-release') {
        return 'Press Release'
      } else if (type === 'instagram-placement') {
        return 'Instagram Placement'
      }
      return type.charAt(0).toUpperCase() + type.slice(1)
    },
    showOrderModal: function (orderUUID) {
      this.selectedUUID = orderUUID
      this.$refs.OrderModal.openModal()
    }
  },
  mounted: function () {
    if (this.$route.query.order_uuid) {
      this.showOrderModal(this.$route.query.order_uuid)
    }
  }
}
</script>

<style scoped>
.table tr {
  cursor: pointer;
}
</style>
