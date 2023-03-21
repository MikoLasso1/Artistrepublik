<template>
  <div>
    <div class="text-center">
      <v-icon color="primary" size="100">mdi-bullhorn</v-icon>
      <h4 class="h4">Review Campaign</h4>
    </div>
    <v-row class="my-2">
      <v-col cols="4" class="text-right"><strong>Campaign Name:</strong></v-col>
      <v-col cols="8">{{ campaign.name }}</v-col>
      <v-col cols="4" class="text-right"><strong>Budget:</strong></v-col>
      <v-col v-if="!isSubscription" cols="8">${{ campaign.budget }}</v-col>
      <v-col v-else cols="8">${{ subscriptionPlan.price }} per month</v-col>
      <v-col v-if="!isSubscription" cols="4" class="text-right"><strong>Bid per action:</strong></v-col>
      <v-col v-if="!isSubscription" cols="8">${{ campaign.bid }}</v-col>
      <v-col cols="4" class="text-right"><strong>Campaign Type:</strong></v-col>
      <v-col cols="8">{{ productTypes[campaign.product_id] }}</v-col>
      <v-col cols="4" class="text-right"><strong>URL/URI:</strong></v-col>
      <v-col cols="8">{{ campaign.url }}</v-col>
    </v-row>
    <p class="subtitle-1 text-center my-2">*No refund will be given for any funded campaigns</p>
    <div class="mt-6 d-flex justify-space-between">
      <v-btn color="primary" @click="$emit('back-step')">Back</v-btn>
      <v-btn color="primary" @click="createCampaign">Next</v-btn>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  props: {
    campaign: Object,
    isSubscription: Boolean,
    subscriptionPlan: Object
  },
  data: function () {
    return {
      productTypes: {
        1: 'Spotify Follower Growth',
        2: 'SoundCloud Follower Growth',
        4: 'SoundCloud Stream Growth',
        7: 'SoundCloud Engagement'
      }
    }
  },
  computed: {
    data: function () {
      let data = {
        name: this.campaign.name,
        genre: this.campaign.genre,
        product_id: this.campaign.product_id,
        url: this.campaign.url,
        subscription: this.isSubscription
      }
      if (!this.isSubscription) {
        data.bid = this.campaign.bid * 100
        data.budget = this.campaign.budget * 100
      } else {
        data.subscription_id = this.campaign.subscription_id
      }
      return data
    }
  },
  methods: {
    createCampaign: async function () {
      try {
        let { data: { data } } = await Vue.$http.post('v1/gwu', this.data)
        this.$emit('set-id', data.id)
      } catch (err) {
        this.throwError(err)
      }
      this.$emit('next-step')
    }
  }
}
</script>

<style>

</style>
