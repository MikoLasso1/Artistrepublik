<template>
  <div>
    <v-row class="mb-2">
      <v-col cols="12" lg="12" class="mb-4">
        <v-card class="card shadow mini-settings">
          <v-card-title class="card-header">
            <v-row>
              <v-col cols="8">{{ title }}</v-col>
              <v-spacer></v-spacer>
              <v-col cols="4" class="text-right" v-if="link">
                <v-btn
                  color="primary"
                  elevation="2"
                  small
                  @click="showAll()"
                >View All
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text class="mt-4">
            <v-row v-if="!loading">
              <v-col cols="12" sm="6" md="4" lg="3" class="mb-4" v-for="listing in listings" v-bind:key="listing.uuid">
                <beat v-if="type === `beats`" :beat="listing" />
                <sample v-if="type === `sample-packs`" :sample-pack="listing" />
              </v-col>
            </v-row>
            <div v-else class="text-center">
              <v-progress-circular indeterminate color="primary" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Beat from '@/components/SoundStore/BeatCard'
import Sample from '@/components/SoundStore/SampleCard'

export default {
  components: {
    Beat,
    Sample
  },
  props: {
    listings: Array,
    title: String,
    link: String,
    type: {
      type: String,
      default: 'beats'
    },
    loading: {
      type: Boolean,
      default: false
    },
    hideLink: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    showAll () {
      this.$router.push({ path: this.link })
    }
  }
}
</script>
