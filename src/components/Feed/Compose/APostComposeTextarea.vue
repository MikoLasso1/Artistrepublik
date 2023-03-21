<template>
  <v-textarea
    :placeholder="placeholder"
    autofocus
    @input="$emit('input', value)"
    :value="value"
  ></v-textarea>
</template>

<script>
export default {
  name: 'APostComposeTextarea',
  props: {
    value: {
      required: false,
      default: ''
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>
