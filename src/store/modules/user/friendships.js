import Vue from 'vue'

const state = {
  friends: [],
  friendIds: [],
  pendingFriendIds: [],
  incomingFriendIds: [],
  suggestedFriends: []
}

const getters = {
  getFriends: state => state.friends,
  suggestedFriends: state => state.suggestedFriends,
  friendIds: state => state.friendIds,
  pendingFriendIds: state => state.pendingFriendIds,
  incomingFriendIds: state => state.incomingFriendIds
}

const mutations = {
  SET_FRIENDS (state, payload) {
    state.friends = payload
  },
  PUSH_SUGGESTED_FRIENDS (state, payload) {
    state.suggestedFriends.push(
      ...payload.filter((friend) => {
        return !state.suggestedFriends.map((f) => f.id).includes(friend.id)
      })
    )
  },
  SET_FRIEND_IDS (state, payload) {
    state.friendIds = payload
  },
  SET_PENDING_FRIEND_IDS (state, payload) {
    state.pendingFriendIds = payload
  },
  PUSH_PENDING_FRIEND (state, payload) {
    state.pendingFriendIds.push(payload)
  },
  SET_INCOMING_FRIEND_IDS (state, payload) {
    state.incomingFriendIds = payload
  },
  REMOVE_FRIEND_BY_ID (state, payload) {
    state.friends = state.friends.filter(user => user.id !== payload)
    state.friendIds = state.friends.filter(userId => userId !== payload)
    state.pendingFriendIds = state.pendingFriendIds.filter(userId => userId !== payload)
    state.incomingFriendIds = state.incomingFriendIds.filter(userId => userId !== payload)
  }
}

const actions = {
  fetchRelationship ({ user, key = 'id' }) {
    if (user === undefined) {
      return
    }
    return new Promise((resolve, reject) => {
      Vue.$http
        .get(`v1/user/friend/${user}?key=${key}`)
        .then(res => {
          return res.data.data
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  fetchSuggested ({ commit }, page) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get('v1/user/friend/suggested?page=' + page)
        .then(res => {
          if (res.data.data.length) {
            commit('PUSH_SUGGESTED_FRIENDS', res.data.data)
          }
          return res
        })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  initiateRelationship ({ commit }, userId) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .post('v1/user/friend/request', { id: userId })
        .then(res => {
          return res.data
        })
        .then(res => {
          commit('REMOVE_FRIEND_BY_ID', userId)
          commit('PUSH_PENDING_FRIEND', userId)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  removeRelationship ({ commit }, userId) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .post('v1/user/friend/remove', { id: userId })
        .then(res => {
          commit('REMOVE_FRIEND_BY_ID', userId)
          return res.data
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  fetchFriends (context, params = {}) {
    Vue.$http.get('v1/user/friend/list', params)
      .then(res => {
        context.commit('SET_FRIENDS', res.data.data)
      })
  },
  friendsInit ({ commit }) {
    Vue.$http.get('v1/user/friend/init')
      .then(res => {
        commit('followers/PUSH_FOLLOWINGS', res.data.data.following_ids, { root: true })
        commit('SET_FRIEND_IDS', res.data.data.friend_ids)
        commit('SET_PENDING_FRIEND_IDS', res.data.data.pending_friend_ids)
        commit('SET_INCOMING_FRIEND_IDS', res.data.data.incoming_friend_ids)
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
