import config from '@/config'
import Vue from 'vue'

const getDefaultState = () => {
  return {
    reviewCountries: []
  }
}

const state = getDefaultState()

const getters = {
  getReviewCountries (state) {
    return state.reviewCountries
  }
}

const mutations = {
  setReviewCountries (state, countries) {
    state.reviewCountries = countries
  }
}

const actions = {
  fetchReviewCountries ({ commit }, params) {
    return Vue.$http.get(config.REVIEW_REPUBLIK_API_URL + '/api/v1/countries', { params })
      .then((response) => commit('setReviewCountries', response.data.data.data))
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
