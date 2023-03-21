const getDefaultState = () => {
  return {
    cart: {}
  }
}

const state = getDefaultState()

const getters = {
  getIPOrderCart (state) {
    return state.cart
  }
}

const mutations = {
  addIPOptionToCart (state, { account, type }) {
    const cart = { ...state.cart }
    if (!(account.id in cart) || cart[account.id].types.indexOf(type) === -1) {
      if (!(account.id in cart)) {
        cart[account.id] = { ...account, types: [] }
      }
      cart[account.id].types.push(type)
    }
    state.cart = cart
  },
  removeIPOptionFromCart (state, { account, type }) {
    const cart = { ...state.cart }
    if (account.id in cart && cart[account.id].types.indexOf(type) !== -1) {
      cart[account.id].types.splice(cart[account.id].types.indexOf(type), 1)
      if (cart[account.id].types.length === 0) {
        delete cart[account.id]
      }
    }
    state.cart = cart
  },
  setIPOptionsToCart (state, outletsOptions) {
    state.cart = outletsOptions
  }
}

const actions = {
  clearIPOrderCart ({ commit }) {
    commit('setIPOptionsToCart', {})
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
