import Vue from 'vue'

const getDefaultState = () => {
  return {
    releases: [],
    release: {},
    payout_amount: 0,
    last_payout: '',
    stats: {
      release_count: 0,
      stream_count: 0,
      revenue: 0
    }
  }
}

const state = getDefaultState()

const getters = {
  getDistributionStats (state) {
    return state.stats
  },
  getReleases (state) {
    return state.releases
  },
  getRelease (state) {
    return state.release
  },
  getPayoutAmount (state) {
    return state.payout_amount
  },
  getLastPayout (state) {
    return state.last_payout
  },
  getTracks (state) {
    return state.release.hasOwnProperty('tracks') ? state.release.tracks : null
  }
}

const mutations = {
  setDistributionStats (state, stats) {
    state.stats = stats
  },
  setReleases (state, releases) {
    state.releases = releases
  },
  setRelease (state, release) {
    state.release = release
  },
  addTrack (state, track) {
    state.release.tracks.push(track)
  },
  updateTrack (state, track) {
    const newData = []
    for (let i = 0; i < state.release.tracks.length; i++) {
      const item = state.release.tracks[i]
      if (item.id === track.id) {
        newData.push(track)
      } else {
        newData.push(item)
      }
    }
    state.release.tracks = newData
  },
  removeTrack (state, track) {
    const newData = []
    for (let i = 0; i < state.release.tracks.length; i++) {
      const item = state.release.tracks[i]
      if (item.id !== track.id) {
        newData.push(item)
      }
    }
    state.release.tracks = newData
  },
  setPayoutAmount (state, payout_amount) {
    state.payout_amount = payout_amount
  },
  setLastPayout (state, last_payout) {
    state.last_payout = last_payout
  }
}

const actions = {
  getDistributionStats ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/distribution/stats')
        .then(response => response.data)
        .then(response => {
          resolve(response.data)
          commit('setDistributionStats', response.data)
        })
        .catch(error => reject(error))
    })
  },
  getReleases ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/distribution/release')
        .then(response => response.data)
        .then(response => {
          resolve(response.data)
          commit('setReleases', response.data)
        })
        .catch(error => reject(error))
    })
  },
  getRelease ({ commit }, id) {
    return new Promise((resolve, reject) => {
      Vue.$http.get(`v1/distribution/release/${id}?include=tracks`)
        .then(response => response.data)
        .then(response => {
          resolve(response.data)
          commit('setRelease', response.data)
        })
        .catch(error => reject(error))
    })
  },
  getPayoutAmount ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/distribution/payout')
        .then(response => response.data)
        .then(response => {
          resolve(response.data)
          commit('setPayoutAmount', response.data.payout_amount)
        })
        .catch(error => reject(error))
    })
  },
  getLastPayout ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/distribution/payout')
        .then(response => response.data)
        .then(response => {
          resolve(response.data)
          commit('setLastPayout', response.data.last_payout)
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
