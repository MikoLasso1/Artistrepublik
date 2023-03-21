<template>
  <v-app style="overflow: hidden;">
    <div id="app" data-app :class="{'webp': webp}">
      <router-view />
    </div>
  </v-app>
</template>

<script>
import { addInterceptor as authInterceptor } from '@/api/authHandler'
import { addInterceptor as errorInterceptor } from '@/api/errorHandler'

export default {
  data () {
    return {
      webp: true
    }
  },
  metaInfo: {
    title: 'Artist Republik',
    titleTemplate: '%s | Artist Republik',
    meta: [
      {
        vmid: 'description',
        name: 'description',
        content: 'Artist Republik is a 360 degree platform used by thousands of independent artists! We offer reviews/feedback, mastering, distribution, playlisting, and more!'
      },
      {
        vmid: 'og:title',
        property: 'og:title',
        content: 'Artist Republik | The ONLY 360 degree Platform for Independent Artists'
      },
      {
        vmid: 'og:description',
        property: 'og:description',
        content: 'Artist Republik is a 360 degree platform used by thousands of independent artists! We offer reviews/feedback, mastering, distribution, playlisting, and more!'
      },
      {
        vmid: 'og:image',
        property: 'og:image',
        content: 'https://artistrepublik.com/img/brand/logo_dark.png'
      },
      {
        vmid: 'og:url',
        property: 'og:url',
        content: 'https://artistrepublik.com/'
      },
      { vmid: 'og:type', property: 'og:type', content: 'website' },
      {
        vmid: 'twitter:image',
        property: 'twitter:image',
        content: 'https://artistrepublik.com/img/brand/logo_dark.png'
      },
      {
        vmid: 'twitter:title',
        property: 'twitter:title',
        content: 'Artist Republik | The ONLY 360 degree Platform for Independent Artists'
      },
      {
        vmid: 'twitter:description',
        property: 'twitter:description',
        content:
          'Artist Republik is a 360 degree platform used by thousands of independent artists! We offer reviews/feedback, mastering, distribution, playlisting, and more!'
      },
      {
        vmid: 'twitter:site',
        property: 'twitter:site',
        content: '@artistrepublik'
      },
      { vmid: 'twitter:card', property: 'twitter:card', content: 'app' }
    ]
  },
  updated () {
    if (this.$route.meta.track === true) {
      this.$store.dispatch('recordVisit', { route: this.$route.name, params: this.$route.params })
    }
  },
  mounted () {
    this.isWebPSupported('lossless', (feature, isSupported) => {
      if (!isSupported) {
        this.webp = false
      }
    })
  },
  created () {
    authInterceptor(this)
    errorInterceptor(this)
    this.$store.dispatch('autoLogin')
  }
}
</script>

<style>
.vue-image-crop-upload .vicp-wrap {
  width: 95% !important;
}

.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-right {
  float: none !important;
}

html {
  height: 100%;
  max-height: 100%;
  padding: 0;
  border: 0;
}

div.v-input.required .v-label::after {
  content: " *";
  color: red;
}
</style>

<style scoped src="./assets/css/main.css">
</style>
