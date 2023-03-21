<template>
  <div>
    <v-progress-linear indeterminate v-if="loading"></v-progress-linear>
    <v-simple-table v-else>
      <template v-slot:default>
        <thead>
        <tr>
          <th scope="col">Order ID</th>
          <th scope="col">Billed On</th>
          <th scope="col" class="text-center">Invoice</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="order in orders" :key="order.uuid">
          <td>{{ order.uuid }}</td>
          <td>{{ order.created_at | formatDate }}</td>
          <td class="text-center">
            <v-btn color="blue" dark :href="order.invoice_url" target="_blank">Download</v-btn>
          </td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  props: {
    subscription: Object
  },
  data: function () {
    return {
      loading: true,
      orders: null
    }
  },
  created: async function () {
    this.loading = true
    const url = this.subscription.service === 'main' ? `v1/subscription/${this.subscription.id}` : `v1/service/${this.subscription.service}/subscription/${this.subscription.id}`
    let { data: { data } } = await Vue.$http.get(url)
    this.orders = data.orders
    this.loading = false
  }
}
</script>

<style>

</style>
