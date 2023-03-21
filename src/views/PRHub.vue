<template>
  <div class="h-100">
    <header class="header">
      <picture>
        <source
          media="(max-width: 1199px)"
          srcset="/img/blog-promotion/pr_banner_sm.webp 1x,
                        /img/blog-promotion/pr_banner_sm.webp 2x,
                        /img/blog-promotion/pr_banner_sm.webp 3x"
          type="image/webp"
        >
        <source
          media="(max-width: 1199px)"
          srcset="/img/blog-promotion/pr_banner_sm.jpg 1x,
                        /img/blog-promotion/pr_banner_sm.jpg 2x,
                        /img/blog-promotion/pr_banner_sm.jpg 3x"
          type="image/jpg"
        >
        <source
          media="(min-width: 1200px)"
          srcset="/img/blog-promotion/pr_banner_sm.webp 532w,
                        /img/blog-promotion/pr_banner_md.webp 1600w,
                        /img/blog-promotion/pr_banner.webp 2460w"
          type="image/webp" sizes="100vw"
        >
        <source
          media="(min-width: 1200px)"
          srcset="/img/blog-promotion/pr_banner_sm.jpg 532w,
                        /img/blog-promotion/pr_banner_md.jpg 1600w,
                        /img/blog-promotion/pr_banner.jpg 2460w"
          type="image/jpg" sizes="100vw"
        >
        <img src="/img/blog-promotion/pr_banner.jpg" class="w-100 h-auto" alt="Press Release" loading="lazy">
      </picture>
    </header>
    <div class="container-fluid pb-8" v-if="is_manager">
      <PRTotals />
      <become-manager class="mb-4" :from-hub="true" />
      <PRTable />
    </div>
    <div class="container-fluid pb-8" v-else>
      <become-manager></become-manager>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PRTotals from '@/components/PRHub/PRTotals'
import PRTable from '@/components/PRHub/PRTable'
import BecomeManager from '@/components/PRHub/BecomeManager'

export default {
  components: {
    PRTotals,
    PRTable,
    BecomeManager
  },
  metaInfo () {
    return {
      title: 'Blog Promotion',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: 'Artist Republik is a 360 degree platform offering blog promotion to help launch your career! We offer reviews, mastering, distribution, playlisting, and more!'
        },
        { vmid: 'og:title', property: 'og:title', content: 'Blog Promotion | Artist Republik | The ONLY 360 degree Platform for Independent Artists' },
        {
          vmid: 'og:description',
          property: 'og:description',
          content: 'Artist Republik is a 360 degree platform offering blog promotion to help launch your career! We offer reviews, mastering, distribution, playlisting, and more!'
        },
        { vmid: 'og:image', property: 'og:image', content: 'https://app.artistrepublik.com/img/blog-promotion/blog-promotion.png' },
        {
          vmid: 'og:url',
          property: 'og:url',
          content: 'https://app.artistrepublik.com' + this.$route.fullPath
        },
        {
          vmid: 'twitter:title',
          property: 'twitter:title',
          content:
            'Blog Promotion | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Artist Republik is a 360 degree platform offering blog promotion to help launch your career! We offer reviews, mastering, distribution, playlisting, and more!'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      is_manager: 'getIsPressReleaseManager',
      status: 'getPressReleaseManagerStatus'
    })
  },
  created () {
    if (this.status === 'pending') {
      this.$store.dispatch('fetchSettings')
    }
  }
}
</script>
<style>
.bg-prhub {
  padding-top: 25% !important;
}

@media screen and (min-width: 992px) {
  .bg-prhub {
    padding-top: 7.5% !important;
  }
}
</style>
