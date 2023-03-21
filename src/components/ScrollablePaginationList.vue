<template>
  <div class="wrap" ref="items">
    <div v-for="(item, i) in items" v-bind:key="i">
      <slot name="item" v-bind:item="item"></slot>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  props: {
    url: String
  },
  data: function () {
    return {
      items: [],
      currentPage: 0,
      lastPage: 1,
      loading: false
    }
  },
  watch: {
    url: function () {
      this.items = []
      this.currentPage = 0
      this.lastPage = 1
      this.fetchItems()
    }
  },
  computed: {
    _url: function () {
      let pageUrl = `page=${this.currentPage}`
      if (this.url[this.url.length - 1] !== '?') {
        pageUrl = '?' + pageUrl
      } else {
        pageUrl = '&' + pageUrl
      }
      return this.url + pageUrl
    }
  },
  methods: {
    onItemsScroll: function (event) {
      let node = event.target
      if (node.scrollTop === (node.scrollHeight - node.offsetHeight)) {
        this.fetchItems()
      }
    },
    fetchItems: async function () {
      if (this.currentPage === this.lastPage || this.loading) {
        return
      }
      this.currentPage = this.currentPage + 1
      this.loading = true
      try {
        let { data } = await Vue.$http.get(this._url)
        if (this.items.length === 0) {
          this.$emit('done-loading')
        }
        this.items = this.items.concat(data.data)
        this.lastPage = data.meta.last_page
        this.loading = false
      } catch (err) {
        this.throwError(err)
      }
    }
  },
  mounted: function () {
    this.$refs.items.addEventListener('scroll', this.onItemsScroll)
    this.fetchItems()
  }
}
</script>

<style>

</style>
