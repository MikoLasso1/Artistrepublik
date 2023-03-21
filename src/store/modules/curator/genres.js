import Vue from 'vue'

const getDefaultState = () => {
  return {
    genres: []
  }
}

const state = getDefaultState()

const getters = {
  getGenres: function (state) {
    return state.genres
  }
}

const mutations = {
  setGenres: function (state, genres) {
    state.genres = genres
  }
}

const actions = {
  getGenres ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/service/playlist-republik/genre')
        .then(response => response.data)
        .then(response => {
          resolve(response.data)
          commit('setGenres', response.data)
        })
        .catch(error => reject(error))
    })
  }
}

// Export the information
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
