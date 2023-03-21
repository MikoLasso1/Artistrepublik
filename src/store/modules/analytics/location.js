import Vue from 'vue'

const state = {
  countries: [],
  regions: [],
  cities: [],
  user: {}
}

const getters = {}

const mutations = {
  setCountries (state, countries) {
    state.countries = countries
  },
  setRegions (state, regions) {
    state.countries = regions
  },
  setCities (state, cities) {
    state.cities = cities
  }
}

const actions = {
  fetchCountries ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get('v1/locations/countries')
        .then(res => {
          return res.data
        })
        .then(res => {
          commit('setCountries', res.countries)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  fetchRegion ({ commit }, country) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get('v1/locations/country/' + country + '/regions')
        .then(res => {
          return res.data
        })
        .then(res => {
          commit('setRegions', res.regions)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  fetchCities ({ commit }, data) {
    const country = data.country
    const region = data.region
    return new Promise((resolve, reject) => {
      Vue.$http
        .get('v1/locations/country/' + country + '/region/' + region + '/cities')
        .then(res => {
          return res.data
        })
        .then(res => {
          commit('setCities', res.cities)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

// Export the information
export default {
  state,
  getters,
  mutations,
  actions
}
