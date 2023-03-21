<template>
  <v-card class="my-4">
    <v-card-text class="text-right">
      <v-tooltip top color="primary" max-width="300">
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            color="primary"
            v-bind="attrs"
            v-on="on"
            large
          >
            mdi-comment-question
          </v-icon>
        </template>
        <span class="tooltip-text">
        Once your campaign is funded, it can take up to 48 hours for your campaign to be approved and sent to our advertising network.<br>We advertise your music across a massive network of over 200,000+ monthly music lovers through blogs, Influencers, other artists and more!.<br>We only charge PER conversion so you always get what you pay for.
      </span>
      </v-tooltip>
    </v-card-text>
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="data"
      class="elevation-0"
    >
      <template v-slot:item.active="{ item }">
        <v-chip :color="getStatusColor(item.active)" dark @click="payForCampaign(item)">{{ statuses[item.active] }}</v-chip>
      </template>
      <template v-slot:item.genre="{ item }">
        {{ genres[item.genre] }}
      </template>
      <template v-slot:item.product_id="{ item }">
        {{ productTypes[item.product_id] }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import Vue from 'vue'
import { genres } from '@/store/modules/utils/GWUGenres'

export default {
  data: function () {
    return {
      headers: [
        { text: 'Campaign Name', value: 'name' },
        { text: 'Platform', value: 'product_id' },
        { text: 'Genre', value: 'genre' },
        { text: 'Status', value: 'active' },
        { text: 'bid', value: 'bid' },
        { text: 'budget', value: 'budget' },
        { text: 'Plays', value: 'history.plays' },
        { text: 'Follows', value: 'history.follows' }
      ],
      data: [],
      loading: false,
      statuses: {
        0: 'Paused',
        1: 'Active',
        2: 'Complete',
        3: 'Payment Failed',
        4: 'Complete',
        null: 'Awaiting Payment'
      },
      genres: genres,
      productTypes: {
        1: 'Spotify Follower Growth',
        2: 'SoundCloud Follower Growth',
        4: 'SoundCloud Stream Growth',
        7: 'SoundCloud Engagement'
      }
    }
  },
  methods: {
    loadData: async function () {
      this.loading = true
      try {
        let { data: { data } } = await Vue.$http.get('v1/gwu')
        this.data = data
      } catch (err) {
        this.throwError(err)
      }
      this.loading = false
    },
    getStatusColor: function (activeStatus) {
      switch (activeStatus) {
        case null:
        case 0:
          return 'red'
        case 1:
        case 4:
          return 'green'
        default:
          return 'orange'
      }
    },
    payForCampaign: function (campaign) {
      if (campaign.active === 3 || campaign.active === null) {
        this.$emit('pay', campaign)
      }
    }
  },
  mounted: function () {
    this.loadData()
  }
}
</script>

<style>

</style>
