import Vue from 'vue'

const state = {
  routes: {}
}
const getters = {
  currentActivities (state) {
    return state.routes
  }
}
const mutations = {
  /**
   * Update the given route with the ID corresponding with the newly created record
   *
   * @param {*} state
   * @param {*} param
   */
  updateRouteActivity (state, { route, activity }) {
    state.routes[route] = activity
  },

  /**
   * Destroy the route's activity after recording the amount of time elapsed
   *
   * @param {*} state
   * @param {*} route
   */
  destroyRouteActivity (state, route) {
    delete state.routes[route]
  }
}
const actions = {
  /**
   * Record the time elapsed within a given route.
   *
   * @param {*} param0
   * @param {*} param1
   */
  recordElapsedTime ({ commit, state }, { route, elapsed }) {
    if (elapsed === 0) {
      return
    }
    return new Promise((resolve, reject) => {
      Vue.$http
        .post('v1/track/pages', { activity: state.routes[route], elapsed: Math.floor(elapsed / 1000) })
        .then(res => {
          resolve(res.data)
          commit('destroyRouteActivity', route)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  /**
   * Create a record of a user's visit to a route.
   *
   * @param {*} param0
   * @param {*} route
   */
  recordVisit ({ commit }, { route, params }) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .post('v1/track/pages', { route, params, url: window.location.href })
        .then(res => {
          resolve(res.data)
          const record = res.data.data
          commit('updateRouteActivity', { activity: record.id, route })
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
