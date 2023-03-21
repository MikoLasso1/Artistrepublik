<template>
  <div class="soundstore-nav">
    <v-toolbar color="#212529" dark>
      <v-app-bar-nav-icon class="hidden-md-and-up" @click.stop="navDrawer = !navDrawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn icon v-if="!hideFilters" class="hidden-md-and-up" @click.stop="filterDrawer = !filterDrawer">
        <v-icon>
          mdi-filter
        </v-icon>
      </v-btn>
      <v-spacer class="hidden-sm-and-down"></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down justify-center align-center">
        <v-btn text :to="`/features/sound-store`">Home</v-btn>
        <v-btn text :to="`/features/sound-store/beats`">Beats</v-btn>
        <!-- <v-btn text :to="`/features/sound-store/samples`">Samples/Packs</v-btn> -->
        <v-btn text :to="`/features/sound-store/favorites`">Favorites</v-btn>
        <SearchAutoComplete />
      </v-toolbar-items>
      <v-spacer class="hidden-sm-and-down"></v-spacer>
      <v-badge offset-y="20px" v-if="cartItemCount" :content="cartItemCount">
        <v-btn icon color="primary" :to="`/features/sound-store/cart`">
          <v-icon>mdi-cart</v-icon>
        </v-btn>
      </v-badge>
      <v-btn v-else icon color="primary" :to="`/features/sound-store/cart`">
        <v-icon>mdi-cart</v-icon>
      </v-btn>
      <v-spacer class="hidden-sm-and-down"></v-spacer>
    </v-toolbar>
    <v-navigation-drawer
      v-model="navDrawer"
      absolute
      left
      temporary
      color="#212529"
      dark
    >
      <v-list dense nav>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <SearchAutoComplete />
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="`/features/sound-store`">
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="`/features/sound-store/beats`">
          <v-list-item-content>
            <v-list-item-title>Beats</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- <v-list-item link :to="`/features/sound-store/samples`">
          <v-list-item-content>
            <v-list-item-title>Samples/Packs</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->
        <v-list-item link :to="`/features/sound-store/favorites`">
          <v-list-item-content>
            <v-list-item-title>Favorites</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer
      v-model="filterDrawer"
      absolute
      right
      temporary
      color="#212529"
      dark
    >
      <filters v-if="$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs" @filterUpdated="filters" :show-styles="showStyles" :show-bpm="showBpm" />
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Filters from '@/components/SoundStore/Filters'
import SearchAutoComplete from '@/components/SoundStore/SearchAutoComplete'

export default {
  components: {
    Filters,
    SearchAutoComplete
  },
  props: {
    showStyles: {
      type: Boolean,
      default: true
    },
    showBpm: {
      type: Boolean,
      default: true
    }
  },
  data: function () {
    return {
      navDrawer: false,
      filterDrawer: false
    }
  },
  methods: {
    filters (val) {
      this.$emit('filterUpdated', val)
    }
  },
  computed: {
    ...mapGetters({
      cart: 'SSCart/getCart',
      cartItemCount: 'SSCart/getCartItemCount'
    }),
    hideFilters () {
      return (this.$route.name === 'sound.store' || this.$route.name === 'sound.store.cart')
    }
  }
}
</script>
