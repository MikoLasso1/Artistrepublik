const state = {
  message: []
}

const getters = {
  validationErrors: state => {
    return state.message
  }
}

const mutations = {
  setValidationErrors (state, res) {
    res.map(r => {
      state.message.push(r[0])
    })
  }
}

const actions = {}

// Export the information
export default {
  state,
  getters,
  mutations,
  actions
}
