<template>
  <div id="cart" v-click-outside="onClickOutside">
    <v-icon
      :class="{opened: isOpened}"
      @click="toggleOpen"
    >
      mdi-cart
    </v-icon>
    <div v-bind:class="{opened: isOpened}" id="cart-wrap">
      <div v-if="options.length !== 0">
        <div class="option" v-for="option in options" v-bind:key="option.id">
          <div class="col-4">
            <img :src="option.outlet.img_url" class="" alt="outlet image" loading="lazy" />
          </div>
          <div class="pr-info text-right col-8">
            <p class="text-break"><span>Outlet Name:</span> {{ option.outlet.name }}</p>
            <p><span>Option:</span> {{ option.type }}</p>
            <p><span>Price:</span> ${{ formatPrice(option.price_fee) }}</p>
            <a href="#" @click.prevent="removeItem(option)">Remove</a>
          </div>
        </div>
        <div class="total">
          <p><span>Total:</span> ${{ formatPrice(total) }}</p>
        </div>
      </div>
      <div v-else>
        <div class="text-center">
          <span>No Items in your cart</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: function () {
    return {
      isOpened: false
    }
  },
  computed: {
    ...mapGetters({
      options: 'getPROrderCart'
    }),
    total: function () {
      return this.options.reduce((accum, val) => {
        accum += parseFloat(val.price_fee)
        return accum
      }, 0)
    }
  },
  methods: {
    toggleOpen: function () {
      this.isOpened = !this.isOpened
    },
    removeItem: function (option) {
      this.$store.commit('removeOutletOptionFromCart', option)
    },
    doCheckout: function () {
      this.$emit('checkout')
    },
    onClickOutside: function () {
      if (this.isOpened)
        this.isOpened = !this.isOpened
    },
    formatPrice: function (value) {
      let val = (value / 1).toFixed(2).replace('.', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }
  }
}
</script>

<style lang="scss" scoped>
#cart {
  position: relative;
  z-index: 2;

  .icon {
    font-size: 16px;
    width: 16px;
    height: 16px;
    cursor: pointer;

    &:hover, &.opened {
      color: #5e72e4;
    }
  }

  #cart-wrap {
    position: absolute;
    right: 0;
    display: none;
    padding: 10px;
    background: #fff;

    &.opened {
      display: block;
      box-shadow: 0 15px 35px rgba(50, 50, 93, 0.2), 0 5px 15px rgba(0, 0, 0, 0.17);
      width: 300px;
    }
  }
}

.option {
  display: flex;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #8898aa;

  img {
    width: 50px;
    margin: 0 15px;
  }

  .pr-info {
    p, a {
      > span {
        color: #8898aa;
      }

      margin-bottom: 0;
      font-size: 12px;
    }
  }
}

.total {
  text-align: right;
  margin: 10px;

  > p {
    font-size: 14px;
    margin-bottom: 0;

    > span {
      color: #8898aa;
    }
  }
}
</style>
