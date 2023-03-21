import Vue from 'vue'

const state = {
  stats: {
    rep: '',
    tracks: '',
    orders: '',
    connects: ''
  }
}

const getters = {
  getDashboardStats: state => {
    return state.stats
  }
}

const mutations = {
  setDashboardStats (state, data) {
    state.stats = data.stats
  },
  incrementDashboardConnection (state) {
    state.stats.connects += 1
  }
}

const actions = {
  getStats ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get('v1/dashboard/stats')
        .then(res => {
          commit('setDashboardStats', res.data)
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
