<template>
  <div>
    <p>Choose your budget</p>
    <div class="d-flex justify-space-between px-4 gwubudget">
      <v-btn color="primary" @click="setBudget(20)">$20</v-btn>
      <v-btn color="primary" @click="setBudget(50)">$50</v-btn>
      <v-btn color="primary" @click="setBudget(100)">$100</v-btn>
      <v-btn color="green" dark @click="setBudget(null)">Custom</v-btn>
    </div>
    <div class="mt-6">
      <v-btn color="primary" @click="$emit('back-step')">Back</v-btn>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    setBudget: function (amount) {
      this.$emit('budget-selected', amount)
      this.$emit('next-step')
    }
  }
}
</script>
<style lang="scss" scoped>
.gwubudget {
  flex-direction: column;
  @media screen and (min-width: 412px) {
    flex-direction: row;
  }
}
