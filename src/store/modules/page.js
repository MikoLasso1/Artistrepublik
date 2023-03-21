export default {
  state: {
    isLoading: true
  },
  mutations: {
    isLoading (state, value) {
      state.isLoading = value
    }
  },
  actions: {
    setLoading ({ commit }, value = true) {
      commit('isLoading', value)
    }
  },
  getters: {
    isLoading: state => state.isLoading
  }
}
