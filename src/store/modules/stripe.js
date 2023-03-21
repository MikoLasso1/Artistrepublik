import Vue from 'vue'

const getDefaultState = () => {
  return {
    token: null
  }
}
const state = getDefaultState()

const getters = {}

const mutations = {
  setStripeToken (state, token) {
    state.token = token
  },
  resetState (state) {
    Object.assign(state, getDefaultState())
  }
}

const actions = {
  authorizeAccount (code) {
    return new Promise((resolve, reject) => {
      Vue.$http.post('v1/stripe', { code: code })
        .then(res => {
          return res.data
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  fetchStripeAuthorization () {
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/stripe')
        .then(res => {
          return res.data
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  createCharge (token) {
    return new Promise((resolve, reject) => {
      Vue.$http.post('v1/tx/create', { token: token }).then(res => {
        return res.data
      }).then(res => {
        resolve(res)
      }).catch(err => {
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
