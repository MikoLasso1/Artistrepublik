<template>
  <div>
    <h3 class="h3">Instagram Placement</h3>
    <p class="body-1">
      <strong>Instagram Handle:</strong>&nbsp;<a
      :href="`https://instagram.com/${order.order_data[0].instagram_placement.instagram_handle}`"
    >@{{ order.order_data[0].instagram_placement.instagram_handle }}</a>
      <br />
      <strong>Genre:</strong> {{ order.order_data[0].instagram_placement.genre }}
      <br />
      <strong>Location:</strong> {{ order.order_data[0].instagram_placement.location }}
      <br />
      <strong>Post Type:</strong> {{ uppercase(order.order_data[0].instagram_placement.post_type) }}
      <br />
      <strong>Swipe Up?</strong> {{ order.order_data[0].instagram_placement.swipe_up ? 'Yes' : 'No' }}
      <br />
      <strong>Media:</strong>&nbsp;<a :href="order.order_data[0].instagram_placement.media_url" target="_blank">Download</a>
      <br />
      <strong>Caption:</strong> {{ order.order_data[0].instagram_placement.caption }}
    </p>
    <hr>
    <h3 class="h3">Placements</h3>
    <div class="placement-wrap">
      <placement
        v-for="(order, i) in order.order_data"
        v-bind:key="i"
        :account="order.instagram_placement_account"
        :order="order"
      />
    </div>
  </div>
</template>

<script>
import Placement from '@/components/Orders/Modals/InstagramPlacement/Placement'

export default {
  components: {
    Placement
  },
  props: {
    order: Object
  }
}
</script>

<style lang="scss" scoped>
hr {
  margin: .5rem 0;
}
</style>
