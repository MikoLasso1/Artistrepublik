<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="{...attrs, ...computedSize}" v-on="on" dark icon tile :target="target" :href="url" :id="name">
        <v-icon v-bind="{...computedSize }" :color="color">
          {{ name }}
        </v-icon>
      </v-btn>
    </template>
    <span>{{ label }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    name: String,
    label: String,
    url: String,
    size: String,
    target: String,
    responsive: Boolean,
    color: {
      type: String,
      default: 'blue'
    }
  },
  data: function () {
    return {
      sizes: {
        xs: 'x-small', sm: 'small', md: 'medium', lg: 'large', xl: 'x-large'
      }
    }
  },
  computed: {
    computedSize: function () {
      let size = null
      if (this.responsive) {
        size = this.sizes[this.$vuetify.breakpoint.name]
      } else {
        size = this.sizes[this.size]
      }

      return size ? { [size]: true } : { ['small']: true }
    }
  }
}
</script>

<style>

</style>
