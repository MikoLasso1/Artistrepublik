import Vue from 'vue'
import without from 'lodash/without'

const state = {
  reposts: []
}

const getters = {
  reposts (state) {
    return state.reposts
  }
}

const mutations = {
  PUSH_REPOSTS (state, payload) {
    state.reposts.push(...payload)
  },
  PUSH_REPOST (state, id) {
    state.reposts.push(id)
  },
  POP_REPOST (state, id) {
    state.reposts = without(state.reposts, id)
  }
}

const actions = {
  async repostPost (_, post) {
    await Vue.$http.post(`v1/posts/${post.id}/reposts`)
  },
  async unrepostPost (_, post) {
    await Vue.$http.delete(`v1/posts/${post.id}/reposts`)
  },
  syncRepost ({ commit, state }, id) {
    if (state.reposts.includes(id)) {
      commit('POP_REPOST', id)
      return
    }
    commit('PUSH_REPOST', id)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
