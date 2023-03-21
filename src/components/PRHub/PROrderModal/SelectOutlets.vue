<template>
  <div>
    <div class="row mb-2 sticky-top top-filter-bar">
      <div class="col-md-6 text-left">
        <outlet-filters v-on:filtered="onFiltered"></outlet-filters>
      </div>
      <div class="col-md-6 text-right">
        <cart></cart>
      </div>
    </div>
    <div class="row my-4">
      <div class="col-md-6">
        <v-btn dark color="primary" @click="doBack">Back</v-btn>
      </div>
      <div class="col-md-6 text-right">
        <v-btn dark color="primary" @click="doNext">Continue</v-btn>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div id="outlet-wrap" ref="outlets">
          <h2 class="text-center p-5" v-if="fetching">
            Fetching Outlets
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </h2>
          <h2 v-else-if="outlets.length === 0" class="text-center mt-4">
            No Outlet found.
          </h2>
          <outlet
            v-else
            v-for="(outlet, i) in outlets"
            v-bind:key="i"
            :outlet="outlet"
            v-on:toggle-selected="toggleSelectedOutlets"
          >
          </outlet>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import OutletFilters from '@/components/PRHub/PROrderModal/OutletFilters'
import Cart from '@/components/PRHub/PROrderModal/Cart'
import Outlet from '@/components/PRHub/PROrderModal/Outlet'

export default {
  components: {
    OutletFilters,
    Cart,
    Outlet
  },
  data: function () {
    return {
      filters: '',
      outlets: [],
      selectedIds: [],
      currentPage: 0,
      lastPage: 1,
      fetching: false
    }
  },
  methods: {
    doBack: function () {
      this.$emit('back-step')
    },
    onFiltered: function (filters) {
      if (this.filters !== filters) {
        this.filters = filters
      }
    },
    fetchOutlets: function (removeOutlets = false) {
      if (this.currentPage === this.lastPage || this.fetching) {
        return
      }
      if (removeOutlets) {
        this.outlets = []
      }
      this.currentPage = this.currentPage + 1
      this.fetching = true
      Vue.$http.get(`v1/press-release/outlet?include=options&page=${this.currentPage}${this.filters ? '&' + this.filters : ''}`)
        .then(response => {
          this.outlets = this.outlets.concat(response.data.data)
          this.lastPage = response.data.meta.last_page
        })
        .catch(err => this.$sentry.captureException(err))
        .then(() => this.fetching = false)
    },
    toggleSelectedOutlets: function (outletOption) {
      let index = this.selectedIds.indexOf(outletOption.id)
      if (index !== -1) {
        this.selectedIds.splice(index, 1)
        this.$store.commit('removeOutletOptionFromCart', outletOption)
      } else {
        this.selectedIds.push(outletOption.id)
        this.$store.commit('addOutletOptionToCart', outletOption)
      }
    },
    onPlaylistScroll: function (event) {
      let node = event.target
      if (node.scrollTop === (node.scrollHeight - node.offsetHeight)) {
        this.fetchOutlets()
      }
    },
    doNext: function () {
      this.$emit('next-step')
    }
  },
  watch: {
    filters: function () {
      this.currentPage = 0
      this.fetchOutlets(true)
    }
  },
  created: function () {
    this.fetchOutlets()
  },
  mounted: function () {
    this.$refs.outlets.addEventListener('scroll', this.onPlaylistScroll)
  }
}
</script>

<style lang="scss" scoped>

.top-filter-bar {
  background: white;
  padding-bottom: 0px;
  padding-top: 0px;
}

.top {
  display: flex;
  justify-content: space-between;
}

#outlet-wrap {
  max-height: 600px;
  overflow-y: scroll;
  overflow-x: hidden;
}

#outlet-wrap::-webkit-scrollbar {
  width: 11px;
  scrollbar-width: thin;
  scrollbar-color: rgb(220, 209, 223) #eae5eb;
}

#outlet-wrap::-webkit-scrollbar-track {
  background: #eae5eb;
}

#outlet-wrap::-webkit-scrollbar-thumb {
  background-color: rgb(220, 209, 223);
  border-radius: 6px;
  border: 3px solid rgb(220, 209, 223);
}
</style>
