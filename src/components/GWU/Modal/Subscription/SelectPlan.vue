<template>
  <div>
    <p>Select a plan</p>
    <v-row>
      <v-col v-for="plan in plans" v-bind:key="plan.id" :cols="12 / plans.length">
        <v-card :ripple="true" @click="selectPlan(plan)">
          <v-card-text>
            <h2 class="text-center h2 mb-0">
              ${{ plan.price }}
            </h2>
            <div class="text-center">
              <span class="subtitle-1">per month</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <div class="mt-6">
      <v-btn color="primary" @click="$emit('back-step')">Back</v-btn>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  data: function () {
    return {
      plans: []
    }
  },
  methods: {
    selectPlan: function (plan) {
      this.$emit('plan-selected', plan)
      this.$emit('next-step')
    }
  },
  mounted: async function () {
    this.$emit('toggle-loading', true)
    try {
      let { data: { data } } = await Vue.$http.get('v1/gwu/plans')
      this.plans = data
    } catch (err) {
      this.throwError(err)
    }
    this.$emit('toggle-loading', false)
  }
}
</script>

<style>

</style>
