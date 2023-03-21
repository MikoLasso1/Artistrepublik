<template>
  <v-row>
    <v-col cols="12" md="6" class="my-4 mb-md-0">
      <v-card
        flat
        class="samples-beats"
        dark
        :height="height"
      >
        <v-img
          :height="height"
          src="/img/sound-store/thousands-of-sample-and-packs.png"
        >
          <v-card-text
            class="d-flex flex-column justify-space-between beatstore-featured-container"
          >
            <div class="mt-md-4">
              <h1 class="beatstore-featured-heading">Thousands of<br>Beats to Explore</h1>
              <p class="overline">All In One Store</p>
            </div>
            <router-link :to="`/features/sound-store/beats`" class="text-center">
              <v-btn color="primary">Shop</v-btn>
            </router-link>
          </v-card-text>
        </v-img>
      </v-card>
    </v-col>
    <v-col cols="12" md="6" class="my-4">
      <v-card
        class="pointer"
        flat
        :height="height / 2 - 15"
        dark
        @click="showFeatured('beat')"
      >
        <v-img
          :height="height / 2 - 15"
          src="/img/sound-store/featured-sample.png"
        >
          <v-card-text>
            <div class="mt-md-4">
              <h2 class="beatstore-featured-heading mt-md-4">Featured Beat</h2>
              <p class="overline">Coming Soon</p>
            </div>
          </v-card-text>
        </v-img>
      </v-card>
      <v-card
        flat
        :height="height / 2 - 15"
        dark
        class="mt-4 featured-pack"
        @click="showFeatured('sample-pack')"
      >
        <v-img
          :height="height / 2 - 15"
          src="/img/sound-store/featured-pack.png"
        >
          <v-card-text>
            <div class="mt-md-4">
              <h2 class="beatstore-featured-heading mt-md-4">Featured Pack</h2>
              <p class="overline">Coming Soon</p>
            </div>
          </v-card-text>
        </v-img>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      featuredItems: 'SSListings/getFeatured'
    }),
    height: function () {
      let heightVar = 200
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          heightVar = 280
          break
        case 'sm':
          heightVar = 250
          break
        case 'md':
        case 'lg':
        case 'xl':
          heightVar = 400
          break
      }
      return heightVar
    }
  },
  methods: {
    showFeatured (type) {
      let uuid = this.featuredItems[type.replace(/-/g, '_')]
      if (uuid) {
        let path = `/features/sound-store/${type}/${uuid}/featured`
        this.$router.push({ path: path })
      }

    },
    ...mapActions({
      fetchFeatured: 'SSListings/fetchFeatured'
    })
  },
  mounted: async function () {
    this.loading = true
    await this.fetchFeatured()
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.beatstore {
  &-featured {
    &-heading {
      font-family: "ProximaNova-Bold";
      font-size: 40px;
      color: white;
      line-height: 1;
      text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.2),
      1px -1px 0 rgba(0, 0, 0, 0.2),
      -1px 1px 0 rgba(0, 0, 0, 0.2),
      1px 1px 0 rgba(0, 0, 0, 0.2);
    }

    &-container {
      height: 100%;
    }
  }
}

.overline {
  font-size: 16px !important;
}

.featured-pack {
  @media screen and (min-width: 768px) {
    margin-top: 30px !important;
  }
}
</style>
