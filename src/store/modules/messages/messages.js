import Vue from 'vue'
import has from 'lodash/has'
import findIndex from 'lodash/findIndex'

const state = {
  conversations: [],
  current_conversation_id: 0,
  conversationsLoading: false,
  messages: [],
  messagesMeta: {},
  messagesLoading: false
}
const getters = {
  getCurrentConversation: state => state.conversations.find(conversation => conversation.id === state.current_conversation_id) || {},
  getCurrentConversationId: state => state.current_conversation_id || 0,
  getConversations: state => state.conversations.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)),
  getMessages: state => state.messages.filter(message => message.conversation_id === state.current_conversation_id).sort((a, b) => b.id - a.id) || [],
  messagesLoading: state => state.messagesLoading,
  conversationsLoading: state => state.conversationsLoading
}
const mutations = {
  PUSH_CONVERSATION (state, payload) {
    const index = findIndex(state.conversations, function (conversation) {
      return conversation.id === payload.id
    })
    if (index === -1) {
      state.conversations.push(
        payload
      )
    }
  },
  SET_MESSAGES_META (state, payload) {
    state.messagesMeta = payload
  },
  SET_CURRENT_CONVERSATION_ID: function (state, payload) {
    Vue.set(state, 'current_conversation_id', payload)
  },
  PUSH_MESSAGE (state, payload) {
    const newMessage = payload
    newMessage.conversation_id = parseInt(payload.conversation_id)
    const index = findIndex(state.messages, function (message) {
      return message.id === newMessage.id
    })
    if (index === -1) {
      state.messages.push(
        newMessage
      )
    }
  },
  SET_MESSAGES_LOADING (state, payload) {
    Vue.set(state, 'messagesLoading', payload)
  },
  SET_CONVERSATIONS_LOADING (state, payload) {
    Vue.set(state, 'conversationsLoading', payload)
  },
  DELETE_CONVERSATION (state) {
    const index = state.conversations.findIndex(conversation => {
      return state.current_conversation_id = conversation.id
    })
    state.conversations.splice(index, 1)
  }
}
const actions = {
  fetchConversations (context, nextPage = false) {
    let query = {}
    if (nextPage === true && has(context.state.messagesMeta, 'current_page')) {
      query = {
        page: context.state.messagesMeta.current_page + 1
      }
    }
    Vue.$http.get('v1/conversations', { params: query })
      .then((response) => {
        if (response.data.data.length > 0) {
          response.data.data.forEach(newConversation => {
            context.commit('PUSH_CONVERSATION', newConversation)
          })
        }
        context.commit('SET_MESSAGES_META', response.data.meta)
      })
      .then(() => {
        if (context.state.current_conversation_id === 0 &&
          (((context.state.converstaions || [])[0] || {}).id || false)
        ) {
          context.commit('SET_CURRENT_CONVERSATION_ID', context.state.conversations[0].id)
          context.state.conversations[0].messages.forEach(message => {
            context.commit('PUSH_MESSAGE', message)
          })
        }
        context.commit('SET_CONVERSATIONS_LOADING', false)
        context.commit('SET_MESSAGES_LOADING', false)
      })
  },
  setCurrentConversation (context, conversationId) {
    if (context.state.current_conversation_id !== conversationId) {
      context.commit('SET_CURRENT_CONVERSATION_ID', conversationId)
      context.dispatch('fetchMessages')
    }
  },
  fetchMessages (context) {
    Vue.$http.get(`v1/conversations/${context.state.current_conversation_id}/messages`)
      .then(res => {
        const messages = res.data.data
        if (messages.length > 0) {
          messages.forEach(message => {
            context.commit('PUSH_MESSAGE', message)
          })
        }
      })
      .then(() => {
        context.commit('SET_MESSAGES_LOADING', false)
      })
  },
  sendMessage (context, input) {
    const data = {
      body: input
    }
    Vue.$http.post(`v1/conversations/${context.state.current_conversation_id}/messages`, data)
      .then(res => {
        context.commit('PUSH_MESSAGE', res.data.data)
      })
  },
  async createConversation (context, params) {
    context.commit('SET_MESSAGES_LOADING')
    Vue.$http.post('v1/conversations', params)
      .then(res => {
        context.commit('PUSH_CONVERSATION', res.data.data)
        context.commit('SET_CURRENT_CONVERSATION_ID', res.data.data.id)
        context.commit('SET_MESSAGES_LOADING', true)
        return res.data
      })
      .catch(() => {
        return false
      })
  },
  setConversationsLoading (context, payload = true) {
    context.commit('SET_CONVERSATIONS_LOADING', payload)
  },
  setMessagesLoading (context, payload = true) {
    context.commit('SET_MESSAGES_LOADING', payload)
  },
  deleteConversation (context) {
    const deleteID = context.state.current_conversation_id
    context.commit('SET_MESSAGES_LOADING')
    Vue.$http.delete(`v1/conversations/${deleteID}`)
      .then(response => {
        if (response.status === 204) {
          context.commit('DELETE_CONVERSATION', deleteID)
          context.commit('SET_CURRENT_CONVERSATION_ID', context.state.conversations[0].id)
          context.dispatch('fetchMessages')
        }
      })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
