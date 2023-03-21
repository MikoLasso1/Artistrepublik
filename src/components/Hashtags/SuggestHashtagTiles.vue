<template>
  <v-container>
    <v-row align="stretch">
      <v-col v-for="(hashtag, index) in hashtags" :key="index" :cols="(12 / cols)" class="d-flex flex-column mb-4">
        <v-card class="d-flex justify-center">
          <v-card-text class="d-flex justify-center">
            <a-hashtag-component :body="hashtag.body" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import AHashtagComponent from '@/components/Feed/Entities/APostHashtagEntity.vue'

export default {
  name: 'SuggestHashtagTiles',
  components: {
    AHashtagComponent
  },
  data: () => ({
    cols: 4
  }),
  computed: {
    ...mapGetters({
      hashtags: 'hashtags/top'
    })
  },
  methods: {
    ...mapActions({
      fetchTopHashtags: 'hashtags/fetchTopHashtags'
    })
  },
  mounted () {
    this.fetchTopHashtags()
    if (this.$vuetify.breakpoint.smAndDown) {
      this.cols = 2
    }
  }
}
</script>

<style scoped>

</style>
