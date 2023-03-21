<template>
  <div>
    <h3>Grow With Us</h3>
    <p>
      <strong>Name:</strong> {{ orderData.name }}
      <br>
      <strong>Budget:</strong> ${{ orderData.budget }}
      <br>
      <strong>Bid:</strong> ${{ orderData.bid }}
      <br>
      <strong>Promoting:</strong> {{ orderData.url }}
      <v-icon color="primary" class="edit" @click="$refs.editModal.openModal(orderData)">
        mdi-pencil
      </v-icon>
    </p>
    <edit-promotion-link ref="editModal" @after-edit="updateOrder" />
  </div>
</template>

<script>
import Vue from 'vue'
import EditPromotionLink from '@/components/Orders/Modals/GWU/EditPromotionLink'


export default {
  components: {
    EditPromotionLink
  },
  props: {
    order: Object
  },
  data () {
    return {
      orderData: this.order.order_data
    }
  },
  methods: {
    updateOrder: async function () {
      let { data: { data } } = await Vue.$http.get(`v1/order/${this.order.uuid}`)
      this.orderData = data.order_data
    }
  },
  mounted: function () {
    console.log(this.order)
  }
}
</script>

<style lang="scss" scoped>
hr {
  margin: .5rem 0;
}
</style>
