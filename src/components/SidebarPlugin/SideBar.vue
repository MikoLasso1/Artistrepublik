<template>
  <nav
    id="sidenav-main"
    class="navbar navbar-vertical fixed-left navbar-expand-md navbar-dark"
  >
    <div class="w-100 navbar-toggle-section">
      <!--Toggler-->
      <navbar-toggle-button @click.native="showSidebar">
        <span class="navbar-toggler-icon" />
      </navbar-toggle-button>
      <router-link
        class="navbar-brand"
        to="/"
      >
        <picture>
          <source srcset="/img/brand/logo.webp" type="image/webp">
          <img class="navbar-brand-img" src="/img/brand/logo.png" alt="Artist Republik Logo" loading="lazy" />
        </picture>
      </router-link>

      <slot />
      <div
        v-show="$sidebar.showSidebar"
        id="sidenav-collapse-main"
        class="navbar-collapse collapse show"
      >
        <div class="navbar-collapse-header d-md-none">
          <div class="row">
            <div class="col-6 collapse-brand">
              <router-link to="/">
                <picture>
                  <source srcset="/img/brand/logo_dark_xs.webp" type="image/webp">
                  <img src="/img/brand/logo_dark_xs.png" alt="Artist Republik Logo" loading="lazy" />
                </picture>
              </router-link>
            </div>
            <div class="col-6 collapse-close">
              <navbar-toggle-button @click.native="closeSidebar" />
            </div>
          </div>
        </div>
        <v-expansion-panels dark class="navbar-nav">
          <slot name="links" />
          <slot name="comingsoon" />
        </v-expansion-panels>
        <div v-if="hasAdvertisement === true">
          <hr class="my-3">
          <h2 class="h6 navbar-heading text-muted">
            Sponsored Post
          </h2>
          <ul class="navbar-nav">
            <slot name="sponsored" />
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
import NavbarToggleButton from '@/components/NavbarToggleButton'

export default {
  name: 'Sidebar',
  components: {
    NavbarToggleButton
  },
  props: {
    logo: {
      type: String,
      default: '/img/brand/logo.png',
      description: 'Artist Republik Logo'
    },
    autoClose: {
      type: Boolean,
      default: true,
      description: 'Whether sidebar should autoclose on mobile when clicking an item'
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  },
  provide () {
    return {
      autoClose: this.autoClose
    }
  },
  beforeDestroy () {
    if (this.$sidebar.showSidebar) {
      this.$sidebar.showSidebar = false
    }
  },
  methods: {
    closeSidebar () {
      this.$sidebar.displaySidebar(false)
    },
    showSidebar () {
      this.$sidebar.displaySidebar(true)
    },
    hasAdvertisement () {
      return this.$slots.sponsored
    }
  }
}
</script>
<style scoped>
.navbar {
  background-color: #000;
}
</style>
<style>
.navbar-vertical .navbar-brand {
  text-align: center;
  width: 100%;
}

.navbar-toggle-section {
  position: relative;
}

.navbar-toggler {
  position: absolute;
  top: 0;
  left: 0;
}

.navbar-vertical .navbar-brand-img, .navbar-vertical .navbar-brand > picture img.navbar-brand-img {
  max-height: 3rem;
}

@media screen and (min-width: 360px) {
  .navbar-vertical .navbar-brand-img, .navbar-vertical .navbar-brand > picture img.navbar-brand-img {
    max-height: 5.5rem;
  }
}
</style>
