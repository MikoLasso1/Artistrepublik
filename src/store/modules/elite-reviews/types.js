import config from '@/config'
import Vue from 'vue'

const getDefaultState = () => {
  return {
    reviewTypes: []
  }
}

const state = getDefaultState()

const getters = {
  getReviewTypes (state) {
    return state.reviewTypes
  }
}

const mutations = {
  setReviewTypes (state, types) {
    state.reviewTypes = types
  }
}

const actions = {
  fetchReviewTypes ({ commit }) {
    return Vue.$http.get(config.REVIEW_REPUBLIK_API_URL + '/api/v1/types')
      .then((response) => commit('setReviewTypes', response.data.data))
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
