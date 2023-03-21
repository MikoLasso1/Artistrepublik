import Vue from 'vue'

const state = {
  listings: [],
  featured: [],
  selected: null,
  type: null,
  genres: [],
  styles: [],
  moods: [],
  isFetchingGenres: false,
  isFetchingStyles: false,
  isFetchingMoods: false
}

const getters = {
  getListings: function (state) {
    return state.listings
  },
  getFeatured: function (state) {
    return state.featured.featured
  },
  getSelected: function (state) {
    return state.selected
  },
  getGenres: function (state) {
    return state.genres
  },
  getStyles: function (state) {
    return state.styles
  },
  getMoods: function (state) {
    return state.moods
  }
}

const mutations = {
  SET_LISTINGS: function (state, listings) {
    state.listings = listings
  },
  SET_FEATURED: function (state, listings) {
    state.featured = listings
  },
  SET_SELECTED: function (state, listing) {
    state.selected = listing
  },
  SET_TYPE: function (state, type) {
    state.type = type
  },
  SET_GENRES: function (state, genres) {
    state.genres = genres
    state.isFetchingGenres = false
  },
  SET_STYLES: function (state, styles) {
    state.styles = styles
    state.isFetchingStyles = false
  },
  SET_MOODS: function (state, moods) {
    state.moods = moods
    state.isFetchingMoods = false
  },
  SET_IS_FETCHING_GENRES: function (state, val) {
    state.isFetchingGenres = val
  },
  SET_IS_FETCHING_STYLES: function (state, val) {
    state.isFetchingStyles = val
  },
  SET_IS_FETCHING_MOODS: function (state, val) {
    state.isFetchingMoods = val
  }
}

const actions = {
  fetchListings: function ({ commit, state }, filters) {
    return new Promise((resolve, reject) => {
      Vue.$http.get(`v1/sound-store${state.type ? `/${state.type}` : ''}${filters ? `?${filters}` : ''}`)
        .then(response => {
          const data = response.data.data
          commit('SET_LISTINGS', data)
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  fetchFeatured: function ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/sound-store/featured')
        .then(response => {
          const data = response.data.data
          commit('SET_FEATURED', data)
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  fetchGenres: function ({ commit, state }) {
    if (state.isFetchingGenres) {
      return
    }
    commit('SET_IS_FETCHING_GENRES', true)
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/sound-store/genres')
        .then(response => {
          const data = response.data.data
          commit('SET_GENRES', data.genres)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  fetchStyles: function ({ commit, state }) {
    if (state.isFetchingStyles) {
      return
    }
    commit('SET_IS_FETCHING_STYLES', true)
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/sound-store/style')
        .then(response => {
          const data = response.data.data
          commit('SET_STYLES', data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  fetchMoods: function ({ commit, state }) {
    if (state.isFetchingMoods) {
      return
    }
    commit('SET_IS_FETCHING_MOODS', true)
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/sound-store/mood')
        .then(response => {
          const data = response.data.data
          commit('SET_MOODS', data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
