<template>
  <div>
    <p>Choose your budget</p>
    <div class="d-flex justify-space-between px-4 gwubudget">
      <div class="gwubudget-button">
        <v-btn color="primary" @click="setBudget(20)">$20</v-btn>
        <p>150+ Followers</p>
      </div>
      <div class="gwubudget-button gwubudget-button-value">
        <v-btn color="primary" @click="setBudget(50)">$50</v-btn>
        <p>BEST VALUE</p>
        <p>350+ Followers</p>
      </div>
      <div class="gwubudget-button">
        <v-btn color="primary" @click="setBudget(100)">$100</v-btn>
        <p>750+ Followers</p>
      </div>
    </div>
    <v-row class="mt-6">
      <v-btn color="primary" @click="$emit('back-step')">Back</v-btn>
      <v-spacer />
      <v-btn color="green" dark @click="setBudget(null)">Custom</v-btn>
    </v-row>
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

  &-button {
    text-align: center;
    padding: 10px;

    &-value {
      border: 3px solid #121d3b;
    }

    p {
      color: #121d3b;
      font-family: "Sanchez-Regular", serif;
      padding: 5px;
      margin: 0;
    }
  }

  @media screen and (min-width: 412px) {
    flex-direction: row;
  }
}
</style>
