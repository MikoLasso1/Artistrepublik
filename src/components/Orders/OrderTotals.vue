<template>
  <div>
    <div class="row">
      <div class="col-md-4 column-divs">
        <div class="orders_box total-orders">
          <div class="content-header">
            Total Orders
          </div>
          <div class="orders-number">
            {{ total_orders }}
          </div>
        </div>
      </div>
      <div class="col-md-4 column-divs">
        <div class="orders_box orders-pending ">
          <div class="content-header">
            Orders Incomplete
          </div>
          <div class="orders-number">
            {{ total_orders_incomplete }}
          </div>
        </div>
      </div>
      <div class="col-md-4 column-divs">
        <div class="orders_box order-complete">
          <div class="content-header">
            Orders Completed
          </div>
          <div class="orders-number">
            {{ total_orders_completed }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  data: function () {
    return {
      total_orders: 0,
      total_orders_incomplete: 0,
      total_orders_completed: 0
    }
  },
  mounted: async function () {
    try {
      let { data: { data } } = await Vue.$http.get('v1/order/stats')
      this.total_orders = data.total_orders
      this.total_orders_incomplete = data.total_orders_incomplete
      this.total_orders_completed = data.total_orders_completed
    } catch (err) {
      this.$sentry.captureException(err)
    }
  }
}
</script>

<style scoped>
.order-complete {
  background-image: linear-gradient(to right, #12C8EF, #1076EF);
  /*background: #12C8EF;*/
}

.orders-pending {
  background-color: rgb(96, 112, 228);
  background-image: linear-gradient(to right, rgb(96, 112, 228), rgb(128, 94, 228));
}

.total-orders {
  background-color: rgb(245, 56, 90);
  background-image: linear-gradient(to right, rgb(245, 56, 90), rgb(244, 88, 28));

}

.orders-pending {
  background-color: rgb(96, 112, 228);
  background-image: linear-gradient(to right, rgb(96, 112, 228), rgb(128, 94, 228));
}

.payout-amount {
  background-image: linear-gradient(to right, #12C8EF, #1076EF);
}

.orders-number {
  text-align: center;
  font-weight: bold;
  color: white;
}

.orders_box {

  height: 100px;
  border-radius: 10px;
}

.content-header {
  color: white;
  padding-top: 30px;
  text-align: center;
}
</style>
