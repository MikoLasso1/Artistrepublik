import Vue from 'vue'

const getDefaultState = () => {
  return {
    roles: []
  }
}

const state = getDefaultState()

const getters = {
  getArtistRoles (state) {
    return state.roles
  }
}

const mutations = {
  setRoles (state, roles) {
    state.roles = roles
  }
}

const actions = {
  getArtistRoles ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/distribution/artist/roles')
        .then(response => {
          resolve(response.data)
          commit('setRoles', response.data)
        })
        .catch(error => reject(error))
    })
  }
}

// Export the information
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
