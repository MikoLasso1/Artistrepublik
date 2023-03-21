<template>
  <div class="flex-fill">
    <div class="text-h1 bg-secondary" :style="`width: ${progress}%;`"></div>
  </div>
</template>

<script>
export default {
  name: 'APostMediaProgress',
  props: {
    progress: {
      type: Number,
      required: true
    }
  }
}
</script>
