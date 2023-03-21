const getDefaultState = () => {
  return {
    visible: false,
    beat: null
  }
}

const state = getDefaultState()

const getters = {
  getVisible: function (state) {
    return state.visible
  },
  getBeat: function (state) {
    return state.beat
  }
}

const mutations = {
  SET_VISIBLE: function (state, visible) {
    state.visible = visible
  },
  SET_BEAT: function (state, beat) {
    state.beat = beat
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
