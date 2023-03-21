import without from 'lodash/without'

const getDefaultState = () => {
  return {
    commentIds: []
  }
}

const state = getDefaultState()

const getters = {
  commentIds (state) {
    return state.commentIds
  }
}

const mutations = {
  PUSH_COMMENT_IDS (state, payload) {
    state.commentIds.push(...payload)
  },
  PUSH_COMMENT_ID (state, id) {
    state.commentIds.push(id)
  },
  POP_COMMENT_ID (state, id) {
    state.commentIds = without(state.likes, id)
  },
  RESET_COMMENT_IDS (state) {
    Object.assign(state, getDefaultState())
  }
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
