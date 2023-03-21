const getDefaultState = () => {
  return {
    cart: []
  }
}

const state = getDefaultState()

const getters = {
  getPROrderCart (state) {
    return state.cart
  }
}

const mutations = {
  addOutletOptionToCart (state, outletOption) {
    const found = state.cart.some(el => el.id === outletOption.id)
    if (!found) state.cart.push(outletOption)
  },
  removeOutletOptionFromCart (state, outletOption) {
    state.cart = state.cart.filter(v => v.id !== outletOption.id)
  },
  setOutletOptionsToCart (state, outletsOptions) {
    state.cart = outletsOptions
  }
}

const actions = {
  clearPROrderCart ({ commit }) {
    commit('setPlaylistsToCart', [])
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
