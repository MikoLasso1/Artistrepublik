import Vue from 'vue'
import get from 'lodash/get'
import omit from 'lodash/omit'

const state = {
  posts: [],
  topPosts: [],
  meta: {},
  feedUser: {
    profile_photo: ''
  },
  nearby: []
}

const getters = {
  posts: state => state.posts.sort((a, b) => b.id - a.id),
  post: (state, id) => state.posts.find(p => p.id === id),
  meta: state => state.meta,
  topPosts: state => state.topPosts,
  feedUser: state => state.feedUser,
  nearby: state => state.nearby

}

const mutations = {
  PUSH_POSTS (state, payload) {
    state.posts.push(
      ...payload.filter((post) => {
        return !state.posts.map((p) => p.id).includes(post.id)
      })
    )
  },
  POP_POST (state, id) {
    state.posts = state.posts.filter((p) => {
      return p.id !== id
    })
  },
  PUSH_COMMENT (state, { post_id, comment }) {
    const post_index = state.posts.findIndex(p => p.id === post_id)
    if (post_index >= 0) {
      state.posts[post_index].comments.data.push(comment.data)
    }
  },
  SET_LIKES (state, { id, count }) {
    state.posts = state.posts.map((p) => {
      if (p.id === id) {
        p.likes_count = count
      }
      if (get(p.original_post, 'id') === id) {
        p.original_post.likes_count = count
      }
      return p
    })
  },
  SET_REPOSTS (state, { id, count }) {
    state.posts = state.posts.map((p) => {
      if (p.id === id) {
        p.reposts_count = count
      }
      if (get(p.original_post, 'id') === id) {
        p.original_post.reposts_count = count
      }
      return p
    })
  },
  SET_COMMENTS (state, { id, count }) {
    state.posts = state.posts.map((p) => {
      if (p.id === id) {
        p.comments_count = count
      }
      if (get(p.original_post, 'id') === id) {
        p.original_post.comments_count = count
      }
      return p
    })
  },
  SET_FEED_USER (state, payload) {
    Vue.set(state, 'feedUser', payload)
  },
  SET_FEED_META (state, payload) {
    Vue.set(state, 'meta', payload)
  },
  CLEAR_STATE (state) {
    Vue.set(state, 'posts', [])
    Vue.set(state, 'meta', {})
  },
  PUSH_NEARBY (state, payload) {
    Vue.set(state, 'nearby', payload)
  }
}

const actions = {
  async fetchFeed ({ commit }, params = {}) {
    // eslint-disable-next-line no-prototype-builtins
    if (!params.hasOwnProperty('page')) {
      commit('CLEAR_STATE')
    }
    const response = await Vue.$http.get('v1/feed', { params })
    commit('PUSH_POSTS', response.data.data)
    commit('likes/PUSH_LIKES', response.data.meta.likes, { root: true })
    commit('reposts/PUSH_REPOSTS', response.data.meta.reposts, { root: true })
    commit('followers/PUSH_FOLLOWINGS', response.data.meta.following, { root: true })
    commit('SET_FEED_META', response.data.meta)
    if ('user' in response.data) {
      commit('SET_FEED_USER', response.data.user)
    }
    return response
  },
  async quotePost (_, { post, data }) {
    await Vue.$http.post(`v1/posts/${post.id}/quotes`, data)
  },
  async commentOnPost ({ commit }, { post, data }) {
    const response = await Vue.$http.post(`v1/posts/${post.id}/comments`, data)
    commit('PUSH_COMMENT', { post_id: post.id, comment: response.data })
  },
  async fetchPost ({ commit }, id) {
    const response = await Vue.$http.get(`v1/posts/${id}`)
      .then(response => {
        const post = response.data.data
        if (post.original_post !== null) {
          commit('PUSH_POST', post.original_post)
        }
        if (post.comments !== null) {
          post.comments.data.forEach(comment => {
            commit('PUSH_POST', comment)
          })
        }
        commit('PUSH_POST', omit(post, ['originalPost', 'comments']))
      })
      .then(() => {
        commit('SET_CURRENT_POST_ID', id)
        return response
      })
  },
  async deletePost ({ commit }, id) {
    await Vue.$http.delete(`v1/feed/posts/${id}`)
      .then(response => {
        commit('POP_POST', id)
        return response
      })
      .catch(e => {
        return e
      })
  },
  fetchComments ({ commit }, id) {
    return new Promise((resolve, reject) => {
      Vue.$http.get(`v1/posts/${id}/comments`)
        .then((response) => {
          commit('PUSH_POSTS', response.data.data)
        })
        .then(() => {
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  createPost ({ commit }, params) {
    Vue.$http.post('v1/posts', params)
      .then(response => {
        commit('PUSH_POST', response.data.data)
      })
  },
  resetPostState ({ commit }) {
    commit('RESET_POST_STATE')
    commit('RESET_LIKES')
    commit('RESET_REPOSTS')
    commit('RESET_COMMENT_IDS')
  },
  showPostModal ({ commit }, params = {}) {
    commit('SHOW_POST_MODAL', params)
  },
  hidePostModal ({ commit }) {
    commit('HIDE_POST_MODAL')
  },
  async fetchNearby (_) {
    await Vue.$http.get('v1/users/nearby')
      .then((response) => {
        _.commit('PUSH_NEARBY', response.data.data)
        return response
      })
      .catch((err) => {
        console.log(err)
        return err
      })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
