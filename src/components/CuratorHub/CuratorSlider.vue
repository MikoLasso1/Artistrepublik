<template>
  <div class="curatorslider">
    <VueSlickCarousel v-bind="settings">
      <div class="image-parent">
        <picture>
          <source srcset="/img/curator/curator-slider/1.webp" type="image/webp">
          <img src="/img/curator/curator-slider/1.png" alt="Top Tunes" loading="lazy" />
        </picture>
      </div>
      <div class="image-parent">
        <picture>
          <source srcset="/img/curator/curator-slider/2.webp" type="image/webp">
          <img src="/img/curator/curator-slider/2.png" alt="Audible Adderall" loading="lazy" />
        </picture>
      </div>
      <div class="image-parent">
        <picture>
          <source srcset="/img/curator/curator-slider/3.webp" type="image/webp">
          <img src="/img/curator/curator-slider/3.png" alt="Indy Folk" loading="lazy" />
        </picture>
      </div>
      <div class="image-parent">
        <picture>
          <source srcset="/img/curator/curator-slider/4.webp" type="image/webp">
          <img src="/img/curator/curator-slider/4.png" alt="2020 Rap Playlist" loading="lazy" />
        </picture>
      </div>
      <div class="image-parent">
        <picture>
          <source srcset="/img/curator/curator-slider/5.webp" type="image/webp">
          <img src="/img/curator/curator-slider/5.png" alt="Mellow Vibes" loading="lazy" />
        </picture>
      </div>
      <div class="image-parent">
        <picture>
          <source srcset="/img/curator/curator-slider/6.webp" type="image/webp">
          <img src="/img/curator/curator-slider/6.png" alt="Trap n Chill" loading="lazy" />
        </picture>
      </div>
      <div class="image-parent">
        <picture>
          <source srcset="/img/curator/curator-slider/7.webp" type="image/webp">
          <img src="/img/curator/curator-slider/7.png" alt="Lo-fi Focus" loading="lazy" />
        </picture>
      </div>
      <div class="image-parent">
        <picture>
          <source srcset="/img/curator/curator-slider/8.webp" type="image/webp">
          <img src="/img/curator/curator-slider/8.png" alt="#NoShittyMusic" loading="lazy" />
        </picture>
      </div>
    </VueSlickCarousel>
  </div>
</template>
<script>
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
  name: 'NetworkSlider',
  components: { VueSlickCarousel },
  data () {
    return {
      settings: {
        'arrows': true,
        // "dots": true,
        'infinite': true,
        'slidesToShow': 3,
        'slidesToScroll': 1,
        'autoplay': true,
        'speed': 2000,
        'autoplaySpeed': 1000,
        'cssEase': 'linear'
      }
    }
  }
}
</script>

<style scoped>
.image-parent {
  width: auto;
  text-align: center;
}

.image-parent img {
  max-width: 100%;
  max-height: 100px;
  margin: 0 auto;
}

.curatorslider {
  width: 100%;
}
</style>
