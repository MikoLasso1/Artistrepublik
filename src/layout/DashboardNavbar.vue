<template>
  <v-toolbar
    id="default-app-bar"
    class="dashnavbar"
    color="#1F1C28"
    height="70"
    flat
  >
    <!-- Mobile Nav Button -->
    <v-btn
      class="dashnavbar-menu mr-md-4"
      @click="drawer = !drawer"
      color="#2A2932"
      dark
      large
      v-if="$vuetify.breakpoint.smAndDown"
    >
      <v-icon>
        mdi-menu
      </v-icon>
    </v-btn>
    <MobileLogo v-if="$vuetify.breakpoint.smAndDown" />
    <v-spacer v-if="$vuetify.breakpoint.smAndDown" />
    <!-- Current minimize left sidebar button -->
    <v-btn
      class="ml-3 mr-4"
      elevation="1"
      fab
      color="primary"
      small
      v-if="$vuetify.breakpoint.mdAndUp"
      @click="mini = !mini"
    >
      <v-icon>
        {{ mini ? 'mdi-format-list-bulleted' : 'mdi-dots-vertical' }}
      </v-icon>
    </v-btn>
    <v-spacer v-if="$vuetify.breakpoint.smAndDown" />
    <!-- Mobile Search Button -->
    <v-btn
      v-if="$vuetify.breakpoint.smAndDown"
      class="dashnavbar-search mr-xs-2 mr-md-0"
      icon
      dark
      small
      @click="searchOpen = !searchOpen"
    >
      <v-icon
        dark
      >
        mdi-magnify
      </v-icon>
    </v-btn>
    <SearchInput v-show="searchOpen || $vuetify.breakpoint.mdAndUp" class="dashnavbar-searchopen" @searchStart="goToSearchPage($event)" />
    <v-spacer v-if="$vuetify.breakpoint.mdAndUp" />
    <!-- Help Button -->
    <v-btn
      v-if="$vuetify.breakpoint.mdAndUp"
      class="mx-7 p-0 dashnavbar-help"
      :href="$route.meta.helplink"
      target="_blank"
      dark
      text
    >
      <v-icon color="white">
        mdi-help-circle
      </v-icon>
      &nbsp;Help
    </v-btn>
    <NotificationMenu v-if="$vuetify.breakpoint.mdAndUp" :notifications="notifications" />
    <AccountMenu :user="user" />
  </v-toolbar>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import SearchInput from '@/components/GlobalLayout/SearchInput.vue'
import MobileLogo from '@/components/GlobalLayout/MobileLogo.vue'
import AccountMenu from '@/components/GlobalLayout/AccountMenu.vue'
import NotificationMenu from '@/components/GlobalLayout/NotificationMenu.vue'

export default {
  components: {
    SearchInput,
    MobileLogo,
    AccountMenu,
    NotificationMenu
  },
  props: {
    notifications: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      activeNotifications: false,
      searchOpen: false,
      showMenu: false,
      searchQuery: '',
      showSearchMenu: false
    }
  },
  computed: {
    ...mapGetters({
      getMini: 'getSideBarMini',
      getDrawer: 'getSideBarDrawer'
    }),
    mini: {
      // getter
      get: function () {
        return this.getMini
      },
      // setter
      set: function (newValue) {
        this.setSidebarDrawer(true)
        this.setSidebarMini(newValue)
      }
    },
    drawer: {
      // getter
      get: function () {
        return this.getDrawer
      },
      // setter
      set: function (newValue) {
        this.setSidebarDrawer(newValue)
      }
    },
    user () {
      return this.$store.getters.getUser
    },
    userAuthenticated () {
      return this.$store.getters.isAuthenticated
    },
    searchResults () {
      return this.$store.getters.getSearchValue
    }
  },
  methods: {
    ...mapMutations({
      setSidebarMini: 'SET_SIDEBAR_MINI',
      setSidebarDrawer: 'SET_SIDEBAR_DRAWER'
    }),
    startSearch (value) {
      this.searchQuery = value
      this.searchQuery.length > 1 &&
      this.$store.dispatch('getNextSearchPage', this.searchQuery)
    },
    goToSearchPage (value) {
      this.searchQuery = value
      this.searchOpen = false
      this.$router.push('/search?query=' + this.searchQuery)
    },
    toggleSidebar () {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
    },
    hideSidebar () {
      this.$sidebar.displaySidebar(false)
    },
    toggleMenu () {
      this.showMenu = !this.showMenu
    }
  },
  watch: {
    searchQuery: 'startSearch'
  }
}
</script>

<style lang="scss" scoped>
.dashnavbar {
  position: relative;
  z-index: 2;

  &-menu {
    padding: 0 !important;
    min-width: 44px !important;
  }

  &-search {
    .v-btn {
      &:not(.v-btn--round).v-size--default {
        padding: 0;
      }
    }
  }

  &-searchopen {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 1;
  }

  &-help {
    letter-spacing: 0;
    font-family: "system", sans-serif;
    font-weight: 400;
    text-transform: none;
  }

  @media screen and (min-width: 960px) {
    &-searchopen {
      position: static;
    }
  }
}
</style>
<style lang="scss">
.dashnavbar {
  > .v-toolbar__content {
    z-index: 2;
  }

}
</style>
