<template>
  <div class="h-100">
    <header class="header">
      <picture>
        <source media="(max-width: 1199px)"
                srcset="/img/feed/header_sm.webp 1x,
                            /img/feed/header_sm.webp 2x,
                            /img/feed/header_sm.webp 3x"
                type="image/webp">
        <source media="(max-width: 1199px)"
                srcset="/img/feed/header_sm.jpg 1x,
                            /img/feed/header_sm.jpg 2x,
                            /img/feed/header_sm.jpg 3x"
                type="image/jpg">
        <source media="(min-width: 1200px)"
                srcset="/img/feed/header_sm.webp 532w,
                            /img/feed/header_md.webp 1600w,
                            /img/feed/header.webp 2460w"
                type="image/webp" sizes="100vw">
        <source media="(min-width: 1200px)"
                srcset="/img/feed/header_sm.jpg 532w,
                            /img/feed/header_md.jpg 1600w,
                            /img/feed/header.jpg 2460w"
                type="image/jpg" sizes="100vw">
        <img src="/img/feed/header.jpg" class="w-100 h-auto" alt="Messages" loading="lazy">
      </picture>
    </header>

    <v-container>
      <v-row class="d-flex align-stretch">
        <v-col
          cols="12"
          md="4"
          class="px-3"
        >
          <feed-profile-card
            v-if="user"
            :user="user"
          />
          <suggest-nearby />
        </v-col>
        <v-col
          cols="12"
          md="8"
        >
          <slot />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import FeedProfileCard from '@/components/Feed/Sections/FeedProfileCard'
import SuggestNearby from '@/components/Users/Nearby/SuggestNearby'
import { mapGetters } from 'vuex'

export default {
  name: 'FeedLayout',
  components: {
    FeedProfileCard,
    SuggestNearby
  },
  computed: {
    ...mapGetters({
      user: 'feed/feedUser'
    })
  }
}
</script>

<style scoped></style>
