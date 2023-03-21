<template>
  <router-link :to="{ name: 'profile', params: { username: body.replace('@', '') }}">{{ body }}</router-link>
</template>

<script>
export default {
  name: 'APostMentionEntity',
  props: {
    body: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
