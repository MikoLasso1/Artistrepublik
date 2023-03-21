import Vue from 'vue'
import without from 'lodash/without'

const state = {
  likes: []
}

const getters = {
  likes (state) {
    return state.likes
  }
}

const mutations = {
  PUSH_LIKES (state, payload) {
    state.likes.push(...payload)
  },
  PUSH_LIKE (state, id) {
    state.likes.push(id)
  },
  POP_LIKE (state, id) {
    state.likes = without(state.likes, id)
  }
}

const actions = {
  async likePost (_, post) {
    await Vue.$http.post(`v1/posts/${post.id}/likes`)
  },
  async unlikePost (_, post) {
    await Vue.$http.delete(`v1/posts/${post.id}/likes`)
  },
  syncLike ({ commit, state }, id) {
    if (state.likes.includes(id)) {
      commit('POP_LIKE', id)
      return
    }
    commit('PUSH_LIKE', id)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
