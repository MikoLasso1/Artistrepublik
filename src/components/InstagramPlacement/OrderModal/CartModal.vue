<template>
  <v-dialog v-model="modal" max-width="400">
    <v-card>
      <v-card-title class="headline">
        Cart
        <v-spacer></v-spacer>
        <v-icon @click="modal = false">mdi-close</v-icon>
      </v-card-title>
      <div class="items" v-if="Object.keys(accounts).length !== 0">
        <div class="item" v-for="account in accounts" v-bind:key="account.id">
          <v-row>
            <v-col cols="6">
              <div class="text-center">
                <img :src="account.picture_url" class="profile_img" alt="account picture" loading="lazy" />
                <br />
                <a :href="`https://instagram.com${account.handle}`">@{{ account.handle }}</a>
              </div>
            </v-col>
            <v-col cols="6" align-self="center">
              <ul class="mt-2">
                <li v-for="(type, i) in account.types" v-bind:key="i">
                  <p class="body-1 mb-0">{{ typeText[type] }} - ${{ getPriceForAccount(account, type) }}</p>
                  <a class="text-primary text-right" @click.prevent="removeItem(account, type)">Remove</a>
                </li>
              </ul>
            </v-col>
          </v-row>
        </div>
      </div>
      <div v-else class="text-center">
        <p class="body-1">No Items in your cart</p>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="Object.keys(accounts).length !== 0" text color="primary" @click="$emit('checkout')">Checkout</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  data: function () {
    return {
      modal: false,
      typeText: {
        story: 'Story',
        feed: 'Feed',
        'story-swipe-up': 'Story Swipe Up',
        'feed-story': 'Feed + Story',
        'feed-story-swipe-up': 'Feed + Story with swipe up'
      }
    }
  },
  computed: {
    ...mapGetters({
      accounts: 'getIPOrderCart'
    })
  },
  methods: {
    ...mapMutations([
      'removeIPOptionFromCart'
    ]),
    openModal: function () {
      this.modal = true
    },
    removeItem: function (account, type) {
      this.removeIPOptionFromCart({ account, type })
    },
    getPriceForAccount: function (account, type) {
      switch (type) {
        case 'story':
          return account.story_price_with_fee
        case 'feed':
          return account.feed_price_with_fee
        case 'story-swipe-up':
          return account.story_swipe_up_price_with_fee
        case 'feed-story':
          return account.feed_story_price_with_fee
        case 'feed-story-swipe-up':
          return account.feed_story_swipe_up_price_with_fee
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  padding: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
}

.items {
  border-top: 1px solid rgba(0, 0, 0, 0.3);
}

.profile_img {
  width: 100px;
  margin-bottom: 4px;
}
</style>
