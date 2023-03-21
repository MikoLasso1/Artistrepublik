<template>
  <div>
    <div
      class="main-content login-bg"
      :style="`background-image: url(/img/bg/img` + getBG + `.png);background-image: url(/img/bg/img` + getBG + `.webp);`"
    >
      <!-- Navbar -->
      <base-nav
        class="navbar-top navbar-horizontal navbar-dark"
        container-classes="px-4 container"
        expand
      >
        <router-link
          slot="brand"
          class="navbar-brand"
          to="/"
        />
        <template v-slot="{ closeMenu }">
          <!-- Collapse header -->
          <div class="navbar-collapse-header d-md-none">
            <div class="row">
              <div class="col-6 collapse-brand">
                <router-link to="/">
                  <picture>
                    <source srcset="/img/brand/logo.webp" type="image/webp">
                    <img class="navbar-brand-img" src="/img/brand/logo.png" alt="Artist Republik Logo" loading="lazy" />
                  </picture>
                </router-link>
              </div>
              <div class="col-6 collapse-close">
                <v-btn
                  dark
                  type="button"
                  class="navbar-toggler"
                  aria-label="Toggle sidenav"
                  @click="closeMenu"
                >
                  <span />
                  <span />
                </v-btn>
              </div>
            </div>
          </div>
          <!-- Navbar items -->
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <router-link
                v-if="isLogged"
                class="nav-link nav-link-icon"
                to="/dashboard"
              >
                <i class="ni ni-tv-2" aria-hidden="true" />
                <span class="nav-link-inner--text"> Dashboard</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                v-if="!isLogged"
                class="nav-link nav-link-icon"
                to="/login"
              >
                <i class="ni ni-key-25" aria-hidden="true" />
                <span class="nav-link-inner--text"> Login</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                v-if="!isLogged"
                class="nav-link nav-link-icon"
                to="/register"
              >
                <i class="ni ni-circle-08" aria-hidden="true" />
                <span class="nav-link-inner--text"> Register</span>
              </router-link>
            </li>
          </ul>
        </template>
      </base-nav>
      <!-- Header -->
      <div class="header py-7 py-lg-8">
        <div class="container">
          <div class="header-body text-center mb-6">
            <div class="row justify-content-center">
              <div class="col-lg-5 col-md-6">
                <router-link to="/dashboard">
                  <picture>
                    <source srcset="/img/brand/logo.webp" type="image/webp">
                    <img style="max-width: 200px;" src="/img/brand/logo.png" alt="Artist Republik Logo" loading="lazy" />
                  </picture>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Page content -->
      <div class="container pb-5">
        <slide-y-up-transition
          mode="out-in"
          origin="center top"
        >
          <router-view />
        </slide-y-up-transition>
      </div>
      <footer class="py-5">
        <div class="container">
          <div class="row align-items-center justify-content-xl-between">
            <div class="col-xl-6">
              <div class="copyright text-center text-xl-left text-white">
                &copy; {{ year }} Artist Republik
              </div>
            </div>
            <div class="col-xl-6">
              <ul
                class="nav nav-footer text-white justify-content-center justify-content-xl-end"
              >
                <li class="nav-item">
                </li>
                <li class="nav-item">
                  <a
                    href="https://blog.artistrepublik.com"
                    class="nav-link  text-white"
                    target="_blank"
                    rel="noopener"
                  >Blog</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>
<script>
import cookie from 'js-cookie'
import { SlideYUpTransition } from 'vue2-transitions'

export default {
  name: 'AuthLayout',
  components: {
    SlideYUpTransition
  },
  data () {
    return {
      year: new Date().getFullYear(),
      showMenu: false
    }
  },
  computed: {
    getBG: function () {
      return Math.ceil(Math.random() * 4)
    },
    isLogged: function () {
      if (cookie.get('auth._token.cookie')) {
        return true
      }
      return false
    }
  }
}
</script>
<style scoped>
.login-bg {
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50%;
}
</style>
