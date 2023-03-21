import Vue from 'vue'

const getDefaultState = () => {
  return {
    cart: {
      beats: [],
      samples: [],
      samplePacks: []
    },
    cartKey: null
  }
}

const state = getDefaultState()

const getters = {
  getCart: function (state) {
    return state.cart
  },
  getCartKey: function (state) {
    return state.cartKey
  },
  getCartItemCount: function (state) {
    const cart = state.cart
    let count = 0
    if (cart.beats.length > 0 || cart.samples.length > 0 || cart.samplePacks.length > 0) {
      count = cart.beats.length + cart.samples.length + cart.samplePacks.length
    }
    return count
  }
}

const mutations = {
  ADD_BEAT_TO_CART: function (state, beat) {
    state.cart.beats = state.cart.beats.filter(v => v.uuid !== beat.uuid)
    state.cart.beats.push(beat)
  },
  REMOVE_BEAT_FROM_CART: function (state, beat) {
    state.cart.beats = state.cart.beats.filter(v => v.uuid !== beat.uuid)
  },
  ADD_SAMPLE_TO_CART: function (state, sample) {
    state.cart.samples = state.cart.samples.filter(v => v.uuid !== sample.uuid)
    state.cart.samples.push(sample)
  },
  REMOVE_SAMPLE_FROM_CART: function (state, sample) {
    state.cart.samples = state.cart.samples.filter(v => v.uuid !== sample.uuid)
  },
  ADD_SAMPLE_PACK_TO_CART: function (state, samplePack) {
    state.cart.samplePacks = state.cart.samplePacks.filter(v => v.uuid !== samplePack.uuid)
    for (let i = 0; i < state.cart.samples.length; i++) {
      samplePack.samples.forEach(v => {
        if (v.uuid === state.cart.samples[i].uuid) {
          state.cart.samples.splice(i, 1)
        }
      })
    }
    state.cart.samplePacks.push(samplePack)
  },
  REMOVE_SAMPLE_PACK_FROM_CART: function (state, samplePack) {
    state.cart.samplePacks = state.cart.samplePacks.filter(v => v.uuid !== samplePack.uuid)
  },
  SET_CART: function (state, cart) {
    state.cart = cart
  },
  SET_CART_KEY: function (state, key) {
    state.cartKey = key
  },
  REMOVE_CART_KEY: function (state) {
    state.cartKey = null
  }
}

const actions = {
  clearCart: function ({ commit }) {
    commit('SET_CART', getDefaultState().cart)
  },
  removeCartKey: function ({ commit }) {
    commit('REMOVE_CART_KEY')
  },
  updateCartRecord: function ({ commit, state, rootState }) {
    const cartData = {
      beats: [],
      samples: [],
      sample_packs: []
    }

    state.cart.beats.forEach(v => {
      if ('offer' in v) {
        cartData.beats.push({ uuid: v.uuid, offer_id: v.offer.uuid })
      } else {
        cartData.beats.push({ uuid: v.uuid, pricing_id: v.pricing_id })
      }
    })
    state.cart.samples.forEach(v => cartData.samples.push(v.uuid))
    state.cart.samplePacks.forEach(v => cartData.sample_packs.push(v.uuid))

    return new Promise((resolve, reject) => {
      let request
      if (state.cartKey) {
        let requestUrl = `v1/sound-store/order/cart/${state.cartKey}`

        if (rootState.auth.user !== null && rootState.auth.user.username !== undefined) {
          requestUrl += `?username=${rootState.auth.user.username}`
        }
        request = Vue.$http.put(requestUrl, { data: cartData })
      } else {
        let requestUrl = 'v1/sound-store/order/cart'
        if (rootState.auth.user !== null && rootState.auth.user.username !== undefined) {
          requestUrl += `?username=${rootState.auth.user.username}`
        }
        request = Vue.$http.post(requestUrl, { data: cartData })
      }
      request.then(response => {
        const data = response.data.data.cart.key
        commit('SET_CART_KEY', data)
        resolve(data)
      })
        .catch(err => {
          reject(err)
        })
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
