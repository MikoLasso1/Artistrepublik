import Vue from 'vue'

const state = {
  commentModal: false,
  repostModal: false,
  postId: null
}

const getters = {
  commentModal: state => state.commentModal,
  repostModal: state => state.repostModal,
  modalPost: (state, getters, rootState) => rootState.feed.posts.find(post => post.id === state.postId)
}

const mutations = {
  SET_COMMENT_MODAL (state, payload) {
    Vue.set(state, 'commentModal', payload)
  },
  SET_REPOST_MODAL (state, payload) {
    Vue.set(state, 'repostModal', payload)
  },
  SET_POST_ID (state, payload) {
    Vue.set(state, 'postId', payload)
  }
}

const actions = {
  showCommentModal (context, postId) {
    context.commit('SET_POST_ID', postId)
    context.commit('SET_COMMENT_MODAL', true)
  },
  hideCommentModal (context) {
    context.commit('SET_COMMENT_MODAL', false)
  },
  showRepostModal (context, postId) {
    context.commit('SET_POST_ID', postId)
    context.commit('SET_REPOST_MODAL', true)
  },
  hideRepostModal (context) {
    context.commit('SET_REPOST_MODAL', false)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
