<template>
  <div>
    <h3>Draft</h3>
    <div class="row">
      <div class="col-sm-8">
        <p>
          <strong>Headline:</strong> {{ order.order_data[0].press_release.headline }}
          <br />
          <strong>Key Words:</strong> {{ order.order_data[0].press_release.key_words }}
          <br />
          <strong>Location:</strong> {{ order.order_data[0].press_release.location }}
          <br />
          <strong>Draft:</strong>
          <read-more more-str="read more" :text="order.order_data[0].press_release.draft" less-str="read less" :max-chars="100"></read-more>
        </p>
      </div>
      <div class="col-sm-4 text-center">
        <img :src="order.order_data[0].press_release.img_url" alt="order image" loading="lazy" />
      </div>
    </div>
    <hr>
    <h3>Outlets</h3>
    <div class="outlet-wrap">
      <Option
        v-for="(order, i) in order.order_data"
        v-bind:key="i"
        :option="order.option"
        :order="order"
      />
    </div>
  </div>
</template>

<script>
import Option from '@/components/Orders/Modals/PressRelease/Option'

export default {
  components: {
    Option
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

img {
  width: 100%;
}
</style>
