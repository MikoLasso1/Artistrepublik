<template>
  <v-row align="center">
    <v-col cols="4">
      <div class="text-center">
        <a :href="`instagram.com/${account.handle}`"><img :src="account.picture_url" class="profile_img" alt="account image" loading="lazy" /></a>
        <br />
        <br />
        <a :href="`https://instagram.com/${account.handle}`">@{{ account.handle }}</a>
      </div>
    </v-col>
    <v-col cols="8">
      <h3 class="h3">Options</h3>
      <v-checkbox v-if="account.story_price_with_fee && parseFloat(account.story_price_with_fee) > 0" v-model="options.story" type="checkbox" class="checkbox-vertical-align" hide-details>
        <div slot="label">
          Story - ${{ account.story_price_with_fee }}
        </div>
      </v-checkbox>
      <v-checkbox v-if="account.feed_price_with_fee && parseFloat(account.feed_price_with_fee) > 0" v-model="options.feed" type="checkbox" class="checkbox-vertical-align" hide-details>
        <div slot="label">
          Feed - ${{ account.feed_price_with_fee }}
        </div>
      </v-checkbox>
      <v-checkbox
        v-if="account.story_swipe_up_price_with_fee && parseFloat(account.story_swipe_up_price_with_fee) > 0" v-model="options.storySwipe" type="checkbox" class="checkbox-vertical-align"
        hide-details
      >
        <div slot="label">
          Story with swipe up - ${{ account.story_swipe_up_price_with_fee }}
        </div>
      </v-checkbox>
      <v-checkbox
        v-if="account.feed_story_price_with_fee && parseFloat(account.feed_story_price_with_fee) > 0" v-model="options.feedStory" type="checkbox" class="checkbox-vertical-align"
        hide-details
      >
        <div slot="label">
          Feed + Story - ${{ account.feed_story_price }}
        </div>
      </v-checkbox>
      <v-checkbox
        v-if="account.feed_story_swipe_up_price_with_fee && parseFloat(account.feed_story_swipe_up_price_with_fee) > 0" v-model="options.feedStorySwipe" type="checkbox"
        class="checkbox-vertical-align" hide-details
      >
        <div slot="label">
          Feed + Story with swipe up - ${{ account.feed_story_swipe_up_price_with_fee }}
        </div>
      </v-checkbox>
    </v-col>
  </v-row>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
  props: {
    account: Object
  },
  data: function () {
    return {
      options: {
        story: false,
        feed: false,
        storySwipe: false,
        feedStory: false,
        feedStorySwipe: false
      },
      optionAlias: {
        'story': 'story',
        'feed': 'feed',
        'story-swipe-up': 'storySwipe',
        'feed-story': 'feedStory',
        'feed-story-swipe-up': 'feedStorySwipe'
      }
    }
  },
  computed: {
    ...mapGetters({
      accounts: 'getIPOrderCart'
    })
  },
  watch: {
    accounts: {
      handler: function () {
        this.checkBasedOnAccounts()
      },
      deep: true
    },
    'options.story': function () {
      if (this.options.story) {
        this.addIPOptionToCart({ account: this.account, type: 'story' })
      } else {
        this.removeIPOptionFromCart({ account: this.account, type: 'story' })
      }
    },
    'options.feed': function () {
      if (this.options.feed) {
        this.addIPOptionToCart({ account: this.account, type: 'feed' })
      } else {
        this.removeIPOptionFromCart({ account: this.account, type: 'feed' })
      }
    },
    'options.storySwipe': function () {
      if (this.options.storySwipe) {
        this.addIPOptionToCart({ account: this.account, type: 'story-swipe-up' })
      } else {
        this.removeIPOptionFromCart({ account: this.account, type: 'story-swipe-up' })
      }
    },
    'options.feedStory': function () {
      if (this.options.feedStory) {
        this.addIPOptionToCart({ account: this.account, type: 'feed-story' })
      } else {
        this.removeIPOptionFromCart({ account: this.account, type: 'feed-story' })
      }
    },
    'options.feedStorySwipe': function () {
      if (this.options.feedStorySwipe) {
        this.addIPOptionToCart({ account: this.account, type: 'feed-story-swipe-up' })
      } else {
        this.removeIPOptionFromCart({ account: this.account, type: 'feed-story-swipe-up' })
      }
    }
  },
  methods: {
    ...mapMutations([
      'addIPOptionToCart',
      'removeIPOptionFromCart'
    ]),
    checkBasedOnAccounts: function () {
      this.options.story = false
      this.options.feed = false
      this.options.storySwipe = false
      this.options.feedStory = false
      this.options.feedStorySwipe = false
      if (!(this.account.id in this.accounts)) {
        return
      }
      this.accounts[this.account.id].types.forEach(type => {
        this.options[this.optionAlias[type]] = true
      })
    }
  },
  created: function () {
    this.checkBasedOnAccounts()
  }
}
</script>

<style lang="scss">
.checkbox-vertical-align label {
  margin-bottom: 0;
}
</style>
