<template>
  <div class="review">
    <v-img contain max-height="100" :lazy-src="src" :src="src" alt="review image"></v-img>

    <div v-if="hasReview" class="d-flex align-center mt-3">
      <div class="label font-weight-bold mr-2">Rating:</div>
      <v-rating :value="rating" color="yellow accent-4" dense half-increments hover size="16" readonly empty-icon="$ratingEmpty" full-icon="$ratingFull" half-icon="$ratingHalf"></v-rating>
    </div>
    <div v-if="hasReview" class="label font-weight-bold mt-3">Review:</div>
    <div v-if="hasReview" class="pa-4 pt-0 caption">
      <em>
        {{ review }}
      </em>
    </div>

    <div v-if="!hasReview" class="d-flex align-center mt-3">
      <div class="label font-weight-bold mr-2">Rating:</div>
      Not yet rated
    </div>
    <div v-if="!hasReview" class="d-flex align-center mt-3">
      <div class="label font-weight-bold mr-2">Review:</div>
      <em> {{ review }} </em>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    src: {
      type: String,
      default: '/img/brand/logo_dark.png'
    },
    order: Object
  },
  computed: {
    hasReview: function () {
      return this.order.review && this.order.review.id ? true : false
    },
    rating: function () {
      return this.order.review && this.order.review.rating ? this.order.review.rating : 0
    },
    review: function () {
      return this.order.review && this.order.review.review ? this.order.review.review : 'No review'
    }
  }
}
</script>

<style lang="scss" scoped>
.review {
  width: 250px;
}
</style>
