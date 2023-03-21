<template>
  <header class="elitereviews-header">
    <picture>
      <source
        media="(max-width: 1199px)"
        srcset="/img/elite-reviews/banner_sm.webp 1x, /img/elite-reviews/banner_sm.webp 2x, /img/elite-reviews/banner_sm.webp 3x"
        type="image/webp">
      <source
        media="(max-width: 1199px)"
        srcset="/img/elite-reviews/banner_sm.png 1x, /img/elite-reviews/banner_sm.png 2x, /img/elite-reviews/banner_sm.png 3x"
        type="image/png"
      >
      <source
        media="(min-width: 1200px)"
        srcset="/img/elite-reviews/banner_sm.webp 532w, /img/elite-reviews/banner_md.webp 1600w, /img/elite-reviews/banner.webp 2460w"
        type="image/webp" sizes="100vw"
      >
      <source
        media="(min-width: 1200px)"
        srcset="/img/elite-reviews/banner_sm.png 532w, /img/elite-reviews/banner_md.png 1600w, /img/elite-reviews/banner.png 2460w"
        type="image/png" sizes="100vw"
      >
      <img src="/img/elite-reviews/banner.png" class="w-100 h-auto" alt="Elite Reviews" loading="lazy" />
    </picture>
  </header>
</template>
<script></script>
<style lang="scss" scoped>
.elitereviews {
  &-header {
    position: relative;
    min-height: 90px;

    &-img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
