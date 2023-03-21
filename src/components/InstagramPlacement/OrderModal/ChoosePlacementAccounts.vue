<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="6">
        <v-icon @click="$refs.filtersModal.openModal()">mdi-filter</v-icon>
        <filters-modal @filtered="onFiltered" ref="filtersModal" />
      </v-col>
      <v-col cols="6" class="text-right">
        <v-icon @click="$refs.cartModal.openModal()">mdi-cart</v-icon>
        <cart-modal @checkout="$emit('next-step')" ref="cartModal" />
      </v-col>
    </v-row>
    <scrollable-pagination-list :url="url" @done-loading="$emit('toggle-loading', false)">
      <template v-slot:item="{ item }">
        <placement-account :account="item" class="mb-4" />
      </template>
    </scrollable-pagination-list>
    <div class="text-right">
      <v-btn v-if="Object.keys(accounts).length !== 0" text color="primary" @click="$emit('next-step')">Next</v-btn>
    </div>
  </div>
</template>

<script>
import ScrollablePaginationList from '@/components/ScrollablePaginationList'
import PlacementAccount from '@/components/InstagramPlacement/OrderModal/PlacementAccount'
import CartModal from '@/components/InstagramPlacement/OrderModal/CartModal'
import FiltersModal from '@/components/InstagramPlacement/OrderModal/FiltersModal'
import { mapGetters } from 'vuex'

export default {
  components: {
    ScrollablePaginationList,
    PlacementAccount,
    CartModal,
    FiltersModal
  },
  data: function () {
    return {
      filters: ''
    }
  },
  computed: {
    ...mapGetters({
      accounts: 'getIPOrderCart'
    }),
    url: function () {
      let url = `v1/instagram-placement/account`
      if (this.filters !== '') {
        url += '?' + this.filters
      }
      return url
    }
  },
  methods: {
    onFiltered: function (filters) {
      this.filters = filters
    }
  },
  mounted: function () {
    this.$emit('toggle-loading', true)
  }
}
</script>

<style>
.profile_img {
  width: 100px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
