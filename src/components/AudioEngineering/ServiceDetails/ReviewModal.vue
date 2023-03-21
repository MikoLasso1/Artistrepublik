<template>
  <v-dialog v-model="dialog" :loading="loading" max-width="500">
    <v-card>
      <v-alert v-if="error" dismissible dark color="red">{{ error }}</v-alert>
      <v-form class="mt-4" v-model="valid" ref="form">
        <v-card-title class="headline h3 grey lighten-2">
          Leave Your Feedback
          <v-spacer></v-spacer>
          <v-icon @click="dialog = false">mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
          <div class="d-flex align-center my-5">
            <div class="body-1 font-weight-bold mr-2">Rating:</div>
            <v-rating v-model="rating" color="yellow accent-4" dense hover size="20" empty-icon="$ratingEmpty" full-icon="$ratingFull" half-icon="$ratingHalf"></v-rating>
          </div>
          <v-textarea outlined name="input-7-4" label="Your review" v-model="review"></v-textarea>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="primary" @click="rate">
            Rate
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'
import {
  serialize
} from 'object-to-formdata'

export default {
  props: {
    order: Object
  },
  data () {
    return {
      rating: 0,
      valid: false,
      error: null,
      review: null,
      loading: false,
      dialog: false,
      rules: {
        rating: [
          v => !!v || 'You must enter a rating'
        ]
      }
    }
  },
  computed: {
    hasReview: function () {
      return this.order.review && this.order.review.id ? true : false
    }
  },
  mounted () {
    if (this.hasReview) {
      if (this.order.review.rating) {
        this.rating = this.order.review.rating
      }

      if (this.order.review.review) {
        this.review = this.order.review.review
      }
    }
  },
  methods: {
    openModal () {
      this.dialog = true
    },

    rate: async function () {
      try {
        if (!this.rating || this.rating === 0) {
          this.error = 'You add a rating'
          this.$emit('prevent')
        }
        this.loading = true
        const formData = serialize({
          rating: this.rating,
          review: this.review,
          _method: 'PUT'
        })
        let {
          data: {
            data
          }
        } = await Vue.$http({
          method: 'POST',
          url: 'v1/audio-engineering/order/' + this.order.id + '/review',
          data: formData,
          headers: {
            'content-type': 'multipart/form-data'
          }
        })

        this.$emit('success')
        this.$noty.success('Order has been reviewed!')
        this.loading = false
        this.order.review = data
      } catch (err) {
        this.loading = false
        this.$sentry.captureException(err)
        console.log(err)
      }
    }
  }
}
</script>
