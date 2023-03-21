import Vue from 'vue'

const getDefaultState = () => {
  return {
    intent: null
  }
}

const state = getDefaultState()

const getters = {
  getIntent: function (state) {
    return state.intent
  }
}

const mutations = {
  setIntent: function (state, intent) {
    state.intent = intent
  }
}

const actions = {
  updateIntentStep: function ({ commit, getters }, step) {
    const intent = getters.getIntent
    return new Promise((resolve, reject) => {
      if (!intent) {
        resolve()
      }
      Vue.$http.put(`v1/intent/${intent.uuid}`, { step })
        .then(res => {
          const data = res.data.data
          commit('setIntent', data)
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
