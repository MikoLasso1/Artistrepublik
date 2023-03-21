<template>
  <div class="UserLocation mb-4">
    <div class="row">
      <div class="col">
        <base-input label="Country">
          <select
            v-model="user.country"
            class="form-control"
            @change="fetchRegion"
          >
            <option
              disabled
              selected
              value="null"
            >
              Select a Country
            </option>
            <option
              v-for="(country, index) in countries"
              :value="country.code"
              :key="index"
            >
              {{ country.name }}
            </option>
          </select>
        </base-input>
      </div>
    </div>
    <div
      v-if="regions.length > 0"
      class="row"
    >
      <div class="col">
        <base-input label="State/Region">
          <select
            v-model="user.region"
            class="form-control"
            @change="fetchCities"
          >
            <option
              disabled
              selected
              value="null"
            >
              Select a State/Region
            </option>
            <option
              v-for="(region, index) in regions"
              :value="region.code"
              :key="index"
            >
              {{ region.name }}
            </option>
          </select>
        </base-input>
      </div>
    </div>
    <div
      v-if="cities.length > 0"
      class="row"
    >
      <div class="col">
        <base-input label="City">
          <select
            v-model="user.city"
            class="form-control"
          >
            <option
              disabled
              selected
              value="null"
            >
              Select a City
            </option>
            <option
              v-for="(city, index) in cities"
              :key="index"
              :value="city.ID"
            >
              {{ city.name }}
            </option>
          </select>
        </base-input>
      </div>
    </div>
    <div class="row">
      <v-btn
        dark
        color="success"
        class="form-control mx-3"
        @click="saveLocation"
      >
        Update Location
      </v-btn>
    </div>
  </div>
</template>
<script>
export default {
  components: {},

  data () {
    return {
      user: {
        country: null,
        region: null,
        city: null
      },
      countries: [],
      regions: [],
      cities: []
    }
  },
  mounted () {
    this.fetchCountries()
  },
  methods: {
    fetchCountries () {
      this.$store.dispatch('fetchCountries')
        .then(res => {
          this.countries = res.countries
        })
        .catch(() => {
          // Do Nada
        })
    },
    fetchRegion () {
      this.user.region = null
      this.user.city = null
      this.regions = []
      this.cities = []
      this.$store.dispatch('fetchRegion', this.user.country)
        .then(res => {
          this.regions = res.regions
        })
        .catch(() => {
          // Do Nada
        })
    },
    fetchCities () {
      this.$store.dispatch('fetchCities', this.user)
        .then(res => {
          this.cities = res.cities
        })
        .catch(() => {
          // Do Nada
        })
    },
    saveLocation () {

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
  font-family: "Montserrat", sans-serif;
}

h3 a {
  color: #7a549d;
}

h3 a:hover {
  color: #121d3b;
}

.rep {
  color: #7f244f;
}

.artist-friend img {
  width: 100%;
  max-width: 200px;
  border-radius: 0.25rem;
}
</style>
