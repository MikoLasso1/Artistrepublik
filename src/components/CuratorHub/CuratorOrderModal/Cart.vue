<template>
  <div
    id="cart"
    v-click-outside="onClickOutside"
  >
    <v-icon
      :class="{opened: isOpened}"
      @click="toggleOpen"
    >
      mdi-cart
    </v-icon>
    <div
      id="cart-wrap"
      :class="{opened: isOpened}"
    >
      <div v-if="playlists.length !== 0">
        <div
          v-for="playlist in playlists"
          :key="playlist.id"
          class="playlist"
        >
          <div class="col-4">
            <img
              :src="playlist.image_url"
              :alt="playlist.name"
              class=""
              loading="lazy"
            >
          </div>
          <div class="info text-right col-8">
            <p class="text-break">
              <span>Playlist Name:</span> {{ playlist.name }}
            </p>
            <p><span>Price:</span> {{ playlist.price | centsToDollar }}</p>
            <a
              href="#"
              @click.prevent="removeItem(playlist)"
            >Remove</a>
          </div>
        </div>
        <div class="total">
          <p><span>Total:</span> {{ total | centsToDollar }}</p>
        </div>
        <div class="text-center">
          <v-btn
            dark
            color="success"
            @click="doCheckout"
          >
            Checkout
          </v-btn>
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
      playlists: 'getCuratorOrderCart'
    }),
    total: function () {
      return this.playlists.reduce((accum, val) => {
        accum += val.price
        return accum
      }, 0)
    }
  },
  methods: {
    toggleOpen: function () {
      this.isOpened = !this.isOpened
    },
    removeItem: function (playlist) {
      this.$store.commit('removePlaylistFromCart', playlist)
    },
    doCheckout: function () {
      this.$emit('checkout')
    },
    onClickOutside () {
      if (this.isOpened)
        this.isOpened = !this.isOpened
    },
    formatPrice (value) {
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

.playlist {
  display: flex;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #8898aa;

  img {
    width: 50px;
    margin: 0 15px;
  }

  .info {
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
