import Vue from 'vue'

const state = {
  favorites: [],
  loaded: false
}

const getters = {
  getFavorites: function (state) {
    return state.favorites
  },
  getLoaded: function (state) {
    return state.loaded
  }
}

const mutations = {
  SET_FAVORITES: function (state, favorites) {
    state.favorites = favorites
  },
  SET_LOADED: function (state, loaded) {
    state.loaded = loaded
  }
}

const actions = {
  fetchFavorites: function ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/sound-store/favorite')
        .then(response => {
          const data = response.data.data
          commit('SET_FAVORITES', data)
          commit('SET_LOADED', true)
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  addFavorite: function ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Vue.$http.post('v1/sound-store/favorite', payload)
        .then(response => {
          const data = response.data.data
          commit('SET_FAVORITES', data)
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  removeFavorite: function ({ commit }, uuid) {
    return new Promise((resolve, reject) => {
      Vue.$http.delete(`v1/sound-store/favorite/${uuid}`)
        .then(response => {
          const data = response.data.data
          commit('SET_FAVORITES', data)
          resolve(data)
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
