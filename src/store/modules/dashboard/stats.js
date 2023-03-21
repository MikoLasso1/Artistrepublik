import Vue from 'vue'

const state = {
  stats: {
    rep: '',
    tracks: '',
    orders: '',
    connects: ''
  },
  gwu: {
    campaigns: 0,
    spend: 0,
    plays: 0,
    follows: 0
  }
}

const getters = {
  getDashboardStats: state => {
    return state.stats
  },
  getDashboardGWU: state => {
    return state.gwu
  }
}

const mutations = {
  setDashboardStats (state, data) {
    state.stats = data.stats
  },
  incrementDashboardConnection (state) {
    state.stats.connects += 1
  },
  setDashboardGWU (state, data) {
    state.gwu.campaigns = data.campaigns
    state.gwu.spent = data.spent
    state.gwu.plays = data.plays
    state.gwu.follows = data.follows
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
  },
  getGWUStats ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get('v1/dashboard/gwu')
        .then(res => {
          return res.data
        })
        .then(res => {
          commit('setDashboardGWU', res.gwu)
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
