import Vue from 'vue'

const state = {
  connections: [],
  connectionsMeta: {
    current_page: 1
  },
  next: null,
  prev: null
}

const getters = {
  getInfluentialFriendInfo: function (state) {
    return state.connections
  },
  getInfluentialConnectionsMeta: function (state) {
    return state.connectionsMeta
  },
  getInfluentialFriendNext: function (state) {
    return (state.connectionsMeta.current_page < state.connectionsMeta.last_page ? state.connectionsMeta.current_page++ : state.connectionsMeta.current_page)
  },
  getInfluentialFriendPrev: function (state) {
    return (state.connectionsMeta.current_page > 1 ? state.connectionsMeta.current_page - 1 : 1)
  }
}

const mutations = {
  setFriendsInfo (state, friendData) {
    state.connections = friendData
  },
  setInfluentialConnectionsMeta (state, payload) {
    state.connectionsMeta = payload
  }
}

const actions = {
  getInfluentialConnectionInfo ({ commit }, { user, params = {} }) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get('v1/user/' + user + '/friends', params)
        .then(friendData => {
          commit('setFriendsInfo', friendData.data.data)
          commit('setInfluentialConnectionsMeta', friendData.data.meta)
          resolve(friendData.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

// Export the information
export default {
  state,
  getters,
  mutations,
  actions
}
