<template>
  <div>
    <VueSlickCarousel v-bind="settings">
      <div class="image-parent">
        <img
          alt="amazon music"
          src="/img/distribution/network-slider/amazonmusic.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="anghami"
          src="/img/distribution/network-slider/anghami.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="distribution network"
          src="/img/distribution/network-slider/applemusic.png"
          loading="lazy"
        />
      </div>
      <div class="image-parent">
        <img
          alt="awa"
          src="/img/distribution/network-slider/awa.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="boomplay"
          src="/img/distribution/network-slider/boomplay.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="deezer"
          src="/img/distribution/network-slider/deezer.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="facebook audio library"
          src="/img/distribution/network-slider/facebookaudiolibrary.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="facebook rights manager"
          src="/img/distribution/network-slider/facebookrightsmanager.png"
          loading="lazy"
        >
      </div>
      <div class="image-parent">
        <img
          alt="google play music"
          src="/img/distribution/network-slider/googleplaymusic.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="iheart radio"
          src="/img/distribution/network-slider/iheartradio.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="imusica"
          src="/img/distribution/network-slider/imusica.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="network"
          src="/img/distribution/network-slider/itunes.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="kdigital media"
          src="/img/distribution/network-slider/kdigitalmedia.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="kkbox"
          src="/img/distribution/network-slider/kkbox.png"
          loading="lazy"
        />
      </div>
      <div class="image-parent">
        <img
          alt="mixcloud" src="/img/distribution/network-slider/mixcloud.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="music times" src="/img/distribution/network-slider/musictimes.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="napster rhapsody" src="/img/distribution/network-slider/napsterrhapsody.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="netease" src="/img/distribution/network-slider/netease.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="nuuday" src="/img/distribution/network-slider/nuuday.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="network" src="/img/distribution/network-slider/pandora.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="resso" src="/img/distribution/network-slider/resso.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="saavan" src="/img/distribution/network-slider/saavn.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="shazam"
          src="/img/distribution/network-slider/shazam.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="snapchat"
          src="/img/distribution/network-slider/snapchat.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="soundcloud"
          src="/img/distribution/network-slider/soundcloud.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="spotify"
          src="/img/distribution/network-slider/spotify.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="tencent"
          src="/img/distribution/network-slider/tencent.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="tidal"
          src="/img/distribution/network-slider/tidal.png"
        />
      </div>
      <div class="image-parent">
        <img
          alt="tiktok"
          src="/img/distribution/network-slider/tiktok.png"
          loading="lazy"
        />
      </div>
      <div class="image-parent">
        <img
          alt="triller"
          src="/img/distribution/network-slider/triller.png"
          loading="lazy"
        />
      </div>
      <div class="image-parent">
        <img
          alt="uma"
          src="/img/distribution/network-slider/uma.png"
          loading="lazy"
        />
      </div>
      <div class="image-parent">
        <img
          alt="yandex"
          src="/img/distribution/network-slider/yandex.png"
          loading="lazy"
        />
      </div>
      <div class="image-parent">
        <img
          alt="you tube content id"
          src="/img/distribution/network-slider/ytcontentid.png"
          loading="lazy"
        />
      </div>
      <div class="image-parent">
        <img
          alt="you tube music"
          src="/img/distribution/network-slider/ytmusic.png"
          loading="lazy"
        />
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
  components: {
    VueSlickCarousel
  },
  data () {
    return {
      settings: {
        arrows: true,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        speed: 4000,
        autoplaySpeed: 4000,
        pauseOnHover: false,
        cssEase: 'linear',
        responsive: [
          {
            breakpoint: 1600,
            settings: {
              slidesToShow: 5,
              slidesToScroll: 1,
              infinite: true,
              dots: false,
              arrows: false
            }
          },
          {
            breakpoint: 1366,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 1,
              infinite: true,
              dots: false,
              arrows: false
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
              dots: false,
              arrows: false
            }
          }
        ]
      }
    }
  }
}
</script>
<style>
.image-parent {
  width: auto;
  text-align: center;
}

.image-parent img {
  max-width: 100%;
  max-height: 100px;
  margin: 0 auto;
}
</style>
