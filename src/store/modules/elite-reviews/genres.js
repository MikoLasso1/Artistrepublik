import config from '@/config'
import Vue from 'vue'

const getDefaultState = () => {
  return {
    reviewGenres: []
  }
}

const state = getDefaultState()

const getters = {
  getReviewGenres (state) {
    return state.reviewGenres
  }
}

const mutations = {
  setReviewGenres (state, genres) {
    state.reviewGenres = genres
  }
}

const actions = {
  fetchReviewGenres ({ commit }) {
    Vue.$http.get(config.REVIEW_REPUBLIK_API_URL + '/api/v1/genres' + '?options[sort][direction]=asc&options[sort][column]=sort').then((res) => {
      commit('setReviewGenres', res.data.data)
    }).catch((error) => error)
  }
}

// Export the information
export default {
  state,
  getters,
  mutations,
  actions
}
