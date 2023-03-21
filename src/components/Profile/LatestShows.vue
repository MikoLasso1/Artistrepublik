<template>
  <div class="col-xl-12 order-xl-2 mb-5 mx-auto mb-xl-0">
    <div class="card mb-3 card-profile shadow component-container component-container-even">
      <div class="row justify-content-center">
        <section
          v-if="shows"
          class="card-body pt-0 pt-md-4"
        >
          <h2 class="mt-5 pl-xl-4 text-center">
            Latest Shows
          </h2>
          <div class="row text-center justify-content-center pt-5">
            <h3 class="coming-soon mt-5 mb-5 pl-4 text-center">
              Feature Coming Soon
            </h3>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LatestShows',
  props: {
    username: String
  },
  data () {
    return {}
  },
  computed: {
    shows () {
      return this.$store.getters.getShowsInfo
    }
  },
  watch: {
    username: function (newVal) {
      this.username = newVal
      this.fetchData()
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.$store.dispatch('getLatestShowsInfo', this.username)
    }
  }
}
</script>
<style scoped>
section {
  width: 90%;
  max-width: 1920px;
}

h2 {
  text-transform: uppercase;
}

h2, h3, p {
  font-family: "Montserrat-SemiBold", sans-serif !important;
}

h3 a {
  color: #7a549d;
}

h3 a:hover {
  color: #121d3b;
}

.coming-soon {
  font-size: 3rem;
  color: #cdc5cf;
  text-transform: uppercase;
  font-weight: bold;
  text-align: center;
}

.artist-show video {
  width: 100%;
  max-width: 310px;
  border-radius: 0.25rem;
}

.component-container-even {
  background-image: url(/img/profile/component_background_image.png);
  background-position: left top;
}

.webp .component-container-even {
  background-image: url(/img/profile/component_background_image.webp);
}

.component-container-odd {
  background-image: url(/img/profile/component_background_image_flipped.png);
  background-position: right top;
}

.webp .component-container-odd {
  background-image: url(/img/profile/component_background_image_flipped.webp);
}

.component-container {
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
