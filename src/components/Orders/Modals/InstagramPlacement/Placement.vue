<template>
  <v-row class="placement">
    <v-col md="3">
      <div class="text-center">
        <a :href="`instagram.com/${account.handle}`"><img :src="account.picture_url" width="100" style="border-radius: 50%" alt="account image" loading="lazy" /></a>
        <br />
        <a :href="`https://instagram.com/${account.handle}`">@{{ account.handle }}</a>
      </div>
    </v-col>
    <v-col md="9" class="info">
      <p><span>Type:</span> {{ order.type }}</p>
      <p><span>Price:</span> {{ (order.amount + order.fee) | centsToDollar }}</p>
      <p><span>Status:</span> {{ uppercase(order.status) }}</p>
      <p v-if="order.reject_reason"><span>Reject Reason:</span> {{ order.reject_reason }}</p>
      <p v-if="order.link"><span>Link:</span>&nbsp;<a :href="order.link">{{ order.link }}</a></p>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    order: Object,
    account: Object
  },
  methods: {
    formatPrice: function (value) {
      let val = (value / 1).toFixed(2).replace('.', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }
  }
}
</script>

<style lang="scss" scoped>
.placement {
  display: flex;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #8898aa;

  .info {
    p, a {
      > span {
        color: #8898aa;
      }

      margin-bottom: 0;
    }
  }
}
</style>
