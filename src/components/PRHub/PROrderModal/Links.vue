<template>
  <div>
    <div class="row my-4">
      <div class="col-md-6">
        <v-btn dark color="primary" @click="doBack">Back</v-btn>
      </div>
      <div class="col-md-6 text-right">
        <v-btn dark color="primary" @click="doNext">Continue</v-btn>
      </div>
    </div>
    <Link
      v-for="link in links"
      v-bind:key="link.id"
      :link="link"
      :press-release="pressRelease"
      v-on:link-updated="onLinkUpdated"
      v-on:link-deleted="onLinkDeleted"
    />
    <Link
      :press-release="pressRelease"
      v-on:link-created="onLinkCreated"
    />
  </div>
</template>

<script>
import Link from '@/components/PRHub/PROrderModal/Link'

export default {
  components: {
    Link
  },
  props: {
    pressRelease: Object
  },
  data: function () {
    return {
      links: (this.pressRelease && this.pressRelease.links) ? this.pressRelease.links : []
    }
  },
  methods: {
    doBack: function () {
      this.$emit('set-links', this.links)
      this.$emit('back-step')
    },
    doNext: function () {
      this.$emit('set-links', this.links)
      this.$emit('next-step')
    },
    onLinkCreated: function (link) {
      this.links.push(link)
    },
    onLinkUpdated: function (link) {
      let newLinkData = []
      this.links.forEach(v => {
        if (v.id === link.id) {
          newLinkData.push(link)
        } else {
          newLinkData.push(v)
        }
      })
      this.links = newLinkData
    },
    onLinkDeleted: function (link) {
      this.links = this.links.filter(v => v.id !== link.id)
    }
  }
}
</script>

<style>

</style>
