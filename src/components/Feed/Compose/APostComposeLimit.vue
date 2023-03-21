<template>
  <div>
    <div v-if="(200 - form.body.length)" class="text-center ma-1">
      <v-progress-circular
        :value="percentage"
        size="45"
        width="4"
      >
        {{ displayResult }}
      </v-progress-circular>
    </div>
    <v-icon v-else>mdi-alert-circle</v-icon>
  </div>
</template>

<script>
export default {
  name: 'APostComposeLimit',
  props: {
    body: {
      type: String,
      required: true
    }
  },

  computed: {

    underCharCount () {
      return (this.percentage <= 200)
    },

    percentage () {
      return Math.round((this.form.body.length * 100) / 200)
    },

    displayResult () {
      return (200 - this.body.length)
    }
  }
}
</script>
