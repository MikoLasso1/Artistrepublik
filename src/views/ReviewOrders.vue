<template>
  <v-container>
    <v-main class="px-5">
      <order-details />
      <v-card md="12" style="height: inherit; margin: 0px; width: 100%; display: flex;">
        <orders-table :buyer="buyer" />
      </v-card>
    </v-main>
  </v-container>
</template>

<script>
import OrdersTable from '@/components/EliteReviews/OrdersTable'
import OrderDetails from '@/components/EliteReviews/OrderDetails'

export default {
  components: {
    OrdersTable,
    OrderDetails
  },
  metaInfo () {
    return {
      title: 'Elite Reviews Orders',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content:
            'Elite Reviews on Artist Republik enables artists to get their music reviewed by top tier artists for feedback and personal growth. We are the only 360 platform.'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content:
            'Elite Reviews | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content:
            'Elite Reviews on Artist Republik enables artists to get their music reviewed by top tier artists for feedback and personal growth. We are the only 360 platform.'
        },
        {
          vmid: 'og:url',
          property: 'og:url',
          content: 'https://app.artistrepublik.com' + this.$route.fullPath
        },
        {
          vmid: 'twitter:title',
          property: 'twitter:title',
          content:
            'Elite Reviews | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Elite Reviews on Artist Republik enables artists to get their music reviewed by top tier artists for feedback and personal growth. We are the only 360 platform.'
        }
      ]
    }
  },
  computed: {
    buyer: function () {
      return this.$store.state.settings.account.general.email
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
