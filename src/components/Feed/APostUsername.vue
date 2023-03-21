<template>
  <span class="grey--text font-weight-300 font-weight-bold">{{ user.name }} <span class="blue-grey--text font-weight-regular">@{{ user.username }}</span></span>
</template>

<script>
export default {
  name: 'APostUsername',
  props: {
    user: {
      required: true,
      type: Object
    }
  }
}
</script>

<style scoped>

</style>
