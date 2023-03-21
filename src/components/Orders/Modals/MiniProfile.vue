<template>
  <div>
    <h3>Mini Profile</h3>
    <p>
      <strong>Plan Name:</strong> {{ order.subscription_plan.plan_name }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    order: Object
  }
}
</script>

<style lang="scss" scoped>
hr {
  margin: .5rem 0;
}
</style>
