import config from '@/config'
import Vue from 'vue'

const getDefaultState = () => {
  return {
    reviewStates: []
  }
}

const state = getDefaultState()

const getters = {
  getReviewStates (state) {
    return state.reviewStates
  }
}

const mutations = {
  setReviewStates (state, states) {
    state.reviewStates = states
  }
}

const actions = {
  fetchReviewStates ({ commit }, params) {
    return Vue.$http.get(config.REVIEW_REPUBLIK_API_URL + '/api/v1/states', { params })
      .then((response) => commit('setReviewStates', response.data.data.data))
      .catch((error) => error)
  }
}

// Export the information
export default {
  state,
  getters,
  mutations,
  actions
}
