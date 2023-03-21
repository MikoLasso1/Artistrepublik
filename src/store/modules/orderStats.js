import Vue from 'vue'

const state = {
  order_stats: {
    total: ''
  }
}

const getters = {
  getOrderStats: state => {
    return state.order_stats
  }
}

const mutations = {
  setOrderStats (state, data) {
    state.order_stats = { total: data.order_count }
  }
}

const actions = {
  getOrderStats ({ commit }, type) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get(`v1/order/stats/${type}`)
        .then(res => {
          commit('setOrderStats', res.data)
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
