import Vue from 'vue'

const state = {
  access: false
}

const getters = {
  getSpotifyAccessStatus: function (state) {
    return state.access
  }
}

const mutations = {
  setSpotifyAccessStatus: function (state, status) {
    state.access = status
  }
}

const actions = {
  checkSpotifyAccessStatus: function ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get('v1/spotify/access/check')
        .then(res => res.data)
        .then(response => {
          commit('setSpotifyAccessStatus', response.data.is_setup)
          resolve(response.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  setSpotifyAccessCode: function ({ commit }, code) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .post('v1/spotify/access', { code })
        .then(res => res.data)
        .then(response => {
          if (response.data.success) {
            commit('setSpotifyAccessStatus', true)
          }
          resolve(response.data)
        })
        .catch(err => reject(err))
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
