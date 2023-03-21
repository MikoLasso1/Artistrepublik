import Vue from 'vue'

const state = {
  hashtags: [],
  posts: []
}

const getters = {
  hashtags: state => state.hashtags,
  top: state => state.hashtags.sort((a, b) => b.total - a.total),
  posts: state => state.posts
}

const mutations = {
  PUSH_HASHTAGS (state, payload) {
    state.hashtags.push(
      ...payload.filter((hashtag) => {
        return !state.hashtags.map((h) => h.body).includes(hashtag.body)
      })
    )
  },
  SET_POSTS (state, payload) {
    state.posts = payload
  },
  PUSH_POSTS (state, payload) {
    state.posts.push(
      ...payload.filter((post) => {
        return !state.posts.map((p) => p.id).includes(post.id)
      })
    )
  }
}

const actions = {
  async fetchTopHashtags ({ commit }) {
    const response = await Vue.$http.get('v1/hashtags/top')
    commit('PUSH_HASHTAGS', response.data)
  },
  async fetchPosts ({ commit }, { tag, params = { page: 1 } }) {
    const response = await Vue.$http.get(`v1/posts/tag/${tag}`, params)
    if (params.page === 1) {
      commit('SET_POSTS', response.data.data)
    } else {
      commit('PUSH_POSTS', response.data.data)
    }
    return response
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
