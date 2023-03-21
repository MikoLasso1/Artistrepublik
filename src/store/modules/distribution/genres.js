import Vue from 'vue'

const getDefaultState = () => {
  return {
    genres: [],
    subGenres: []
  }
}

const state = getDefaultState()

const getters = {
  getGenres (state) {
    return state.genres
  },
  getSubGenres (state) {
    return state.subGenres
  }
}

const mutations = {
  setGenres (state, genres) {
    state.genres = genres
  },
  setSubGenres (state, subGenres) {
    state.subGenres = subGenres
  }
}

const actions = {
  getGenres ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/distribution/genres')
        .then(response => response.data)
        .then(response => {
          resolve(response.data)
          commit('setGenres', response.data)
        })
        .catch(error => reject(error))
    })
  },
  getSubGenres ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/distribution/sub-genres')
        .then(response => response.data)
        .then(response => {
          resolve(response.data)
          commit('setSubGenres', response.data)
        })
        .catch(error => reject(error))
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
