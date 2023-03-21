import Vue from 'vue'
import postGetters from '@/store/modules/feed/Post/getters'
import postActions from '@/store/modules/feed/Post/actions'
import postMutations from '@/store/modules/feed/Post/mutations'

const state = {
  notifications: [],
  posts: [],
  messageNotifications: [],
  feedNotifications: [],
  friendRequestNotifications: []
}
const getters = {
  ...postGetters,
  notificationCounts (state) {
    return {
      messages: state.messageNotifications.length,
      feed: state.feedNotifications.length,
      friendRequests: state.friendRequestNotifications.length
    }
  },
  messageNotifications: state => state.messageNotifications,
  feedNotifications: state => state.feedNotifications,
  friendRequestNotifications: state => state.friendRequestNotifications

}

const mutations = {
  ...postMutations,
  SET_NOTIFICATIONS (state, payload) {
    state.messageNotifications = payload.filter(note => note.type.includes('\\Messages\\'))
    state.feedNotifications = payload.filter(note => note.type.includes('\\Feed\\'))
    state.friendRequestNotifications = payload.filter(note => note.type.includes('\\Friends\\'))
  }
}

const actions = {
  ...postActions,
  fetchNotifications (context) {
    Vue.$http.get('v1/notifications')
      .then(res => {
        console.log(res)
        context.commit('SET_NOTIFICATIONS', res.data.data)
      })
  }
  // socket_postLiked({ commit }, message) {
  //   console.log(message)
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
