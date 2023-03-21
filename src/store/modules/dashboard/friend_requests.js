import Vue from 'vue'

const state = {
  requests: [],
  next: null,
  prev: null
}

const getters = {
  requestCount: function (state) {
    return state.requests.length
  },
  getFriendRequests: function (state) {
    return state.requests
  },
  getFriendRequestsNext: function (state) {
    return state.next
  },
  getFriendRequestsPrev: function (state) {
    return state.prev
  }
}

const mutations = {
  setRequests (state, requests) {
    state.requests = requests
  },
  removeRequest (state, index) {
    state.requests.splice(index, 1)
  },
  setNextPage (state, links) {
    const nextPage = links.next ? links.next.match(/\d$/)[0] : null
    state.next = nextPage
  },
  setPrevPage (state, links) {
    const prevPage = links.prev ? links.prev.match(/\d$/)[0] : null
    state.prev = prevPage
  }
}

const actions = {
  friendRequests ({ commit }, page = 1) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get('v1/user/friend/requests?page=' + page)
        .then(res => {
          commit('setRequests', res.data.data)
          commit('setNextPage', res.data.links)
          commit('setPrevPage', res.data.links)
          // debugger
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  denyRequest ({ commit }, data) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .post('v1/user/friend/request/deny', { username: data.username })
        .then(res => {
          if (res.data.status === 'success') {
            commit('removeRequest', data.index)
            resolve(res)
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  acceptRequest ({ commit }, data) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .post('v1/user/friend/request/accept', { username: data.username })
        .then(res => {
          if (res.data.status === 'success') {
            commit('removeRequest', res.data.index)
            commit('incrementDashboardConnection')
            resolve(res)
            return
          }
          reject(err)
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
