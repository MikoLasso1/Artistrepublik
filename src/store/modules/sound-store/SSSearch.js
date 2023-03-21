import Vue from 'vue'
import config from '@/config'

const getDefaultState = () => {
  return {
    search: [],
    meta: null,
    query: null,
    loading: false
  }
}

const state = getDefaultState()

const getters = {
  GET_SEARCH_VALUE: state => state.search,
  GET_IS_NOT_LAST_PAGE: state => state.meta && (state.meta.page.current < state.meta.page.total_pages),
  GET_IS_LOADING: state => state.loading
}

const mutations = {
  SET_VALUE: function (state, payload) {
    state.search = payload.new ? payload.data : [...state.value, ...payload.data]
  },
  SET_META: function (state, value) {
    state.meta = value
  },
  SET_QUERY: function (state, value) {
    state.query = value
  },
  SET_LOADING: function (state, value) {
    state.loading = value
  },
  CLEAR_SEARCH: function (state) {
    state.search = null
  }
}

const actions = {
  setLoading: function ({ commit }, value = true) {
    commit('isLoading', value)
  },
  search: function ({ commit }, payload) {
    const httpConfig = {
      headers: { Authorization: `Bearer ${config.SOUND_STORE_ELASTIC_SEARCH_TOKEN}` }
    }
    commit('SET_QUERY', payload.payload.query)
    commit('SET_LOADING', true)
    return new Promise((resolve, reject) => {
      Vue.$http.post(config.SOUND_STORE_ELASTIC_SEARCH_URL, payload.payload, httpConfig)
        .then(response => {
          commit('SET_VALUE', { data: response.data.results, new: payload.newSearch })
          commit('SET_META', response.data.meta)
          resolve(response.data)
          commit('SET_LOADING', false)
        })
        .catch(err => {
          reject(err)
          commit('SET_LOADING', false)
        })
    })
  },
  getNextSearchPage ({ dispatch, state }, value = null) {
    const payload = {
      page: {
        current: (!!state.meta && !value) ? state.meta.page.current + 1 : 1,
        size: 10
      },
      query: value || state.query
    }
    const newSearch = !!value

    dispatch('search', { payload, newSearch })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
