<template>
  <v-row class="flex flex-wrap mb-4">
    <v-col
      v-for="(image, index) in images"
      :key="index"
      cols="auto"
    >
      <v-img width="40%" :src="generateImagePreview(image)" alt="preview" />
      <a
        href="#"
        @click.prevent="$emit('removed', image)"
        class="flex align-content-center justify-center"
      >
        <v-icon>mdi-trash-can</v-icon>
      </a>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'APostImagePreview',
  props: {
    images: {
      type: Array,
      required: false
    }
  },
  methods: {
    generateImagePreview (image) {
      return URL.createObjectURL(image)
    }
  }
}
</script>

<style scoped>

</style>
