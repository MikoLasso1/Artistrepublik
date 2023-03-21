<template>
  <div>
    <div class="option">
      <div class="col-3">
        <img :src="option.outlet.img_url" class="" alt="user image" loading="lazy" />
      </div>
      <div class="info col-9">
        <p class="text-break"><span>Outlet Name:</span> {{ option.outlet.name }}</p>
        <p><span>Option:</span> {{ option.type }}</p>
        <p><span>Price:</span> ${{ formatPrice(option.price_fee) }}</p>
        <p><span>Status:</span> {{ uppercase(order.status) }}</p>
        <p v-if="order.link"><span>Link:</span>&nbsp;<a :href="order.link">{{ order.link }}</a></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    option: Object,
    order: Object
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
.option {
  display: flex;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #8898aa;

  img {
    width: 100%;
    margin: 0 15px;
  }

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
