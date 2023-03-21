<template>
  <div class="text-center">
    <v-progress-circular v-if="loading" indeterminate color="primary" class="mb-4" />
    <div v-else>
      <div class="subscription-features-details" v-html="plans[0].planable.details"></div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  data: function () {
    return {
      loading: true,
      plans: []
    }
  },
  mounted: async function () {
    this.loading = true
    try {
      let { data: { data } } = await Vue.$http.get('v1/subscription/plan?type=distribution')
      this.plans = data
      this.$emit('loaded')
      this.$emit('set-plan', this.plans[0])
    } catch (err) {
      this.throwError(err)
    }
    this.loading = false
  }
}
</script>
<style>
.subscription-features-details ul {
  padding-left: 0
}

.subscription-features-details dd,
.subscription-features-details li {
  color: #121D3B;
}

.subscription-features-details li {
  list-style: none;
}

.subscription-features-details h1 {
  color: #ee3b8d;
  font-size: 2rem;
}
</style>
