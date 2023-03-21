import Vue from 'vue'

const state = {
  tracks: [],
  topTracks: []
}

const getters = {
  getTracksInfo: function (state) {
    return state.tracks
  },
  getTopTracks: function (state) {
    return state.topTracks
  }
}

const mutations = {
  setTracksInfo (state, tracksData) {
    state.tracks = tracksData
  },
  setTopTracks (state, tracksData) {
    state.topTracks = tracksData
  }
}

const actions = {
  getLatestTracksInfo ({ commit }, username) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get('v1/user/' + username + '/tracks')
        .then(tracksData => {
          commit('setTracksInfo', tracksData.data)
          resolve(tracksData.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getTopTracks ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get('v1/tracks')
        .then(tracksData => {
          commit('setTopTracks', tracksData.data.data)
          resolve(tracksData.data)
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
