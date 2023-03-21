import config from '@/config'
import Vue from 'vue'

const getDefaultState = () => {
  return {
    reviewSocialMedia: []
  }
}

const state = getDefaultState()

const getters = {
  getReviewSocialMedia (state) {
    return state.reviewSocialMedia
  }
}

const mutations = {
  setReviewSocialMedia (state, socialMedia) {
    state.reviewSocialMedia = socialMedia
  }
}

const actions = {
  fetchReviewSocialMedia ({ commit }, params) {
    return Vue.$http.get(config.REVIEW_REPUBLIK_API_URL + '/api/v1/social-media', { params })
      .then((response) => commit('setReviewSocialMedia', response.data.data))
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
