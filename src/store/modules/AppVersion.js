import Vue from 'vue'

const state = {
  appVersion: 0
}

const getters = {
  getAppVersion: function (state) {
    return state.appVersion
  }
}

const mutations = {
  SET_APP_VERSION: function (state, version) {
    state.appVersion = version
  }
}

const actions = {
  fetchAppVersion: function ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/app-setting', {
        params: {
          key: 'frontend_version'
        }
      })
        .then(response => {
          const data = response.data
          commit('SET_APP_VERSION', data.value)
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
