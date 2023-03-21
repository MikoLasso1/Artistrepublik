import Vue from 'vue'

const state = {
  followers: [],
  following: []
}

const getters = {
  getFollowing: state => state.following
}

const mutations = {
  PUSH_FOLLOWINGS (state, ids) {
    if (ids.length > 0) {
      state.following.push(...ids)
    }
  },
  PUSH_FOLLOWING (state, id) {
    state.following.push(id)
  },
  POP_FOLLOWING (state, id) {
    state.following = state.following.filter(u => u !== id)
  }

}

const actions = {
  async followUser (_, id) {
    await Vue.$http.post(`v1/users/${id}/follow`)
    _.dispatch('syncFollow', id)
  },
  async unfollowUser (_, id) {
    await Vue.$http.delete(`v1/users/${id}/follow`)
    _.dispatch('syncFollow', id)
  },
  syncFollow ({ commit, state }, id) {
    if (state.following.includes(id)) {
      commit('POP_FOLLOWING', id)
      return
    }
    commit('PUSH_FOLLOWING', id)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
