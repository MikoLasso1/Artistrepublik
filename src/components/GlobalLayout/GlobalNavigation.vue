<template>
  <v-navigation-drawer
    id="default-drawer"
    v-model="drawer"
    :dark="true"
    :right="$vuetify.rtl"
    :mini-variant.sync="mini"
    mini-variant-width="100"
    width="270"
    color="#2B2833"
    :hide-overlay="!isMobile"
    :app="isMobile"
    mobile-breakpoint="959"
    class="globalnavigation"
  >
    <v-list expand nav class="globalnavigation-sidebar-list p-0">
      <v-list-item
        class="mb-0 globalnavigation-sidebar-first justify-space-between"
      >
        <v-btn
          v-if="$vuetify.breakpoint.smAndDown"
          class="globalnavigation-sidebar-close"
          @click="drawer = !drawer"
          dark
          color="#1E1A24"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-list-item-avatar size="45" v-if="mini">
          <v-img
            src="/img/brand/logo_home_sm.png"
            width="100%"
            position="unset"
          />
        </v-list-item-avatar>
        <v-list-item-content class="text-center">
          <router-link v-if="!mini && $vuetify.breakpoint.mdAndUp" to="/">
            <picture>
              <img
                class="navbar-brand-img"
                width="159"
                src="/img/brand/navlogo_lg.svg"
                alt="Artist Republik Logo"
                loading="lazy"
              />
            </picture>
          </router-link>
          <MobileLogo v-else />
        </v-list-item-content>
      </v-list-item>
      <v-divider v-if="$vuetify.breakpoint.smAndDown" light class="m-0" />
      <v-spacer class="pt-7" />
      <template v-for="(item, i) in items">
        <h2
          :key="`heading-${i}`"
          v-if="item.heading"
          :class="{ 'globalnavigation-heading-small': mini }"
          class="px-4 pt-7 globalnavigation-heading"
        >
          {{ item.heading }}
        </h2>
        <NavListGroup v-else-if="item.items" :key="`group-${i}`" :item="item" />
        <NavListItem v-else :key="`item-${i}`" :item="item" />
      </template>
    </v-list>
    <div class="pt-12 pb-15" />
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import MobileLogo from '@/components/GlobalLayout/MobileLogo.vue'
import NavListItem from '@/components/GlobalLayout/NavListItem'
import NavListGroup from '@/components/GlobalLayout/NavListGroup'

export default {
  components: {
    NavListItem,
    NavListGroup,
    MobileLogo
  },
  data () {
    return {
      isMobile: false,
      items: [
        {
          heading: 'Home'
        },
        // {
        //   title: 'Launchpad',
        //   icon: 'mdi-rocket-launch',
        //   to: '/launchpad',
        // },
        {
          title: 'Dashboard',
          icon: 'mdi-home',
          to: '/dashboard'
        },
        {
          title: 'Help Center',
          icon: 'mdi-help',
          href: 'https://support.artistrepublik.com'
        },
        {
          heading: 'Tools'
        },
        {
          title: 'Production',
          icon: 'mdi-music-note',
          items: [
            {
              title: 'Mastering',
              to: '/features/mastering'
            },
            {
              title: 'Elite Reviews',
              to: '/features/reviews'
            },
            {
              title: 'Sound Store',
              to: '/features/sound-store'
            },
            {
              title: 'Featured X',
              href: 'https://featuredx.com/'
            }
          ]
        },
        {
          title: 'Distribution',
          icon: 'mdi-playlist-music',
          to: '/features/distribution'
        },
        {
          title: 'Marketing',
          icon: 'mdi-crosshairs-gps',
          items: [
            {
              title: 'Marketing Hub',
              to: '/marketing-hub'
            },
            {
              title: 'Grow With Us',
              to: '/features/grow'
            },
            {
              title: 'Playlisting',
              to: '/features/playlisting'
            },
            {
              title: 'Blog Promotion Manager',
              to: '/features/blog-promotion-order'
            },
            {
              title: 'Instagram Placement',
              to: '/features/instagram-placement-order'
            },
            {
              title: 'Artist Links',
              to: '/features/artist-links'
            }
          ]
        },
        {
          title: 'Live Shows',
          icon: 'mdi-star',
          href: 'https://www.fanpasslive.com/'
        },
        {
          title: 'Social',
          icon: 'mdi-account-multiple',
          items: [
            {
              title: 'Trending',
              to: '/trending'
            },
            {
              title: 'Messages',
              to: '/messages'
            },
            {
              title: 'Feed',
              to: '/feed'
            },
            {
              title: 'Networking',
              to: '/networking'
            }
          ]
        },
        {
          heading: 'Vendors'
        },
        {
          title: 'Biz Resources',
          icon: 'mdi-web',
          items: [
            {
              title: 'Instagram Placement',
              to: '/features/instagram-placement'
            },
            {
              title: 'Blog Promotion Manager',
              to: '/features/blog-promotion'
            },
            {
              title: 'Curator Hub',
              to: '/features/curator'
            },
            {
              title: 'Producer Center',
              to: '/features/audio-engineering'
            },
            {
              title: 'Reviewer Center',
              to: '/features/reviewer-center'
            },
            {
              title: 'Sound Store',
              to: '/features/sound-store/manage'
            }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      getMini: 'getSideBarMini',
      getDrawer: 'getSideBarDrawer'
    }),
    mini: {
      get: function () {
        return this.getMini
      },
      set: function (newValue) {
        this.setSidebarMini(newValue)
      }
    },
    drawer: {
      get: function () {
        return this.getDrawer
      },
      set: function (newValue) {
        this.setSidebarDrawer(newValue)
      }
    }
  },
  methods: {
    ...mapMutations({
      setSidebarMini: 'SET_SIDEBAR_MINI',
      setSidebarDrawer: 'SET_SIDEBAR_DRAWER'
    })
  },
  mounted () {
    this.isMobile = this.isMobileDevice()
  }
}
</script>
<style lang="scss" scoped>
.globalnavigation {
  .v-navigation-drawer--fixed,
  .v-navigation-drawer--open {
    z-index: 3;
  }

  &-sidebar {
    &-close {
      padding: 0 !important;
      min-width: 44px !important;
      min-height: 44px !important;

      .v-btn {
        &:not(.v-btn--round).v-size--default {
          min-width: 44px !important;
          min-height: 44px !important;
          padding: 0;
        }
      }
    }

    &-first {
      padding: 4px 16px;
    }
  }

  &-heading {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: rgba(255, 255, 255, 0.6);

    &-small {
      font-size: 10px;
    }
  }
}
</style>
<style lang="scss">
.globalnavigation {
  .v-navigation-drawer__content {
    &::-webkit-scrollbar {
      width: 11px;
      scrollbar-width: thin;
      scrollbar-color: #2b2833 #1f1c28;
    }

    &::-webkit-scrollbar-track {
      background: #2b2833;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #1f1c28;
      border-radius: 6px;
      border: 3px solid #1f1c28;
    }
  }

  .v-list-item--disabled .v-list-item__title {
    color: rgba(255, 255, 255, 0.55);
  }

  &-sidebar-list {
    .navlistgroup .v-list-group__header.v-list-item .v-list-item__icon .v-icon {
      opacity: 0.8;
    }

    .v-list-item {
      border-radius: 0px !important;

      &:hover {
        .v-list-item__title {
          opacity: 1;
        }

        &.navlistitem .v-list-item__icon .v-icon,
        &.v-list-group__header .v-list-item__icon .v-icon {
          opacity: 1;
        }
      }

      &:before {
        border-radius: 0px !important;
      }

      &--link:before {
        background-color: unset;
      }

      &__icon .v-icon {
        opacity: 0.8;
      }

      &__title {
        font-size: 0.9rem;
        color: white;
        opacity: 0.8;
        font-weight: unset;
      }
    }
  }

  @media screen and (min-width: 960px) {
    .v-navigation-drawer__content {
      padding: 0 10px;
    }
  }
}
</style>
