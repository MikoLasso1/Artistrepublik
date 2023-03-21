import config from '@/config'
import Vue from 'vue'

const getDefaultState = () => {
  return {
    reviewerSettings: {}
  }
}

const state = getDefaultState()

const getters = {
  getReviewerSettings (state) {
    return state.reviewerSettings
  }
}

const mutations = {
  setReviewerSettings (state, settings) {
    state.reviewerSettings = settings
  }
}

const actions = {
  fetchReviewerSettings ({ commit }, uuid) {
    return Vue.$http.get(config.REVIEW_REPUBLIK_API_URL + '/api/v1/reviewers/' + uuid)
      .then((response) => commit('setReviewerSettings', response.data.data))
      .catch((error) => {
        console.log(error)
      })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
