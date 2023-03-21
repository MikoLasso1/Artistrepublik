<template>
  <div>
    <h2>Pick Your Campaign!</h2>
    <ul class="gwu-terms-list">
      <li><span>One Time:</span> run a one-time campaign for a specific budget.</li>
      <li><span>Subscription:</span> set your monthly budget and let us do the rest with automated growth every month.</li>
    </ul>
    <p class="gwu-terms-content">Please allow 1 - 3 business days for your campaign to be reviewed.</p>
    <div class="d-flex justify-space-between px-4 gwu-terms-buttons">
      <v-btn class="m-1" color="primary" @click="chooseOption(false)">One Time</v-btn>
      <v-btn class="m-1" color="primary" @click="chooseOption(true)">Subscription</v-btn>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    chooseOption: function (isSubscription) {
      this.$emit('is-subscription', isSubscription)
      this.$emit('next-step')
    }
  }
}
</script>
<style lang="scss" scoped>
.gwu-terms {
  &-list {
    li {
      color: #121d3b;
      font-family: "Sanchez-Regular", serif;
      text-transform: capitalize;

      span {
        color: #ee44aa;
        text-transform: uppercase;
      }
    }
  }

  &-content {
    color: #121d3b;
    font-size: 0.8rem;
    line-height: 1.25;
    max-width: 80%;
    margin: 30px auto;
  }

  &-buttons {
    flex-direction: column;
  }

  @media screen and (min-width: 412px) {
    &-buttons {
      flex-direction: row;
    }
  }
}
</style>
