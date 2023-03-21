<template>
  <router-link :to="{ name: 'hashtag', params: { hashtag: body.replace('#', '') } }">{{ body }}</router-link>
</template>

<script>
export default {
  name: 'APostHashtagEntity',
  props: {
    body: {
      type: String,
      required: true
    }
  }
}
</script>
