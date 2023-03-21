const getDefaultState = () => {
  return {
    cart: [],
    purchasedPlaylistIds: []
  }
}

const state = getDefaultState()

const getters = {
  getCuratorOrderCart (state) {
    return state.cart
  },
  getPurchasedPlaylistIds (state) {
    return state.purchasedPlaylistIds
  }
}

const mutations = {
  addPlaylistToCart (state, playlist) {
    const found = state.cart.some(el => el.id === playlist.id)
    if (!found) state.cart.push(playlist)
  },
  removePlaylistFromCart (state, playlist) {
    state.cart = state.cart.filter(v => v.id !== playlist.id)
  },
  setPlaylistsToCart (state, playlists) {
    state.cart = playlists
  },
  setPurchasedPlaylistIds (state, playlistIds) {
    state.purchasedPlaylistIds = playlistIds
  }
}

const actions = {
  clearCruratorCart ({ commit }) {
    commit('setPlaylistsToCart', [])
  }
}

// Export the information
export default {
  state,
  getters,
  mutations,
  actions
}
