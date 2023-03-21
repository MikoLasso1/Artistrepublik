<template>
  <div class="mb-4">
    <video width="100%" controls preload :src="generateVideoPreview(video)"></video>
    <a
      href="#"
      @click.prevent="$emit('removed', video)"
      class="flex align-content-center justify-center"
    >
      <v-icon>mdi-trash-can</v-icon>
    </a>
  </div>
</template>

<script>
export default {
  name: 'APostVideoPreview',
  props: {
    video: {
      type: File,
      required: true
    }
  },
  methods: {
    generateVideoPreview (video) {
      return URL.createObjectURL(video)
    }
  }
}
</script>
