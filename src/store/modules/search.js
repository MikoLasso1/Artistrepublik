import Vue from 'vue'

const uri = process.env.VUE_APP_ELASTIC_SEARCH_URI

export default {
  state: {
    searchValue: null,
    searchMeta: null,
    query: null
  },
  mutations: {
    setValue (state, payload) {
      state.searchValue = payload.new ? payload.data : [...state.searchValue, ...payload.data]
    },
    setMeta (state, value) {
      state.searchMeta = value
    },
    setQuery (state, value) {
      state.query = value
    },
    clearSearch (state) {
      state.searchValue = null
    }
  },
  actions: {
    setLoading ({ commit }, value = true) {
      commit('isLoading', value)
    },
    searchElastic ({ commit }, payload) {
      const config = {
        headers: { Authorization: `Bearer ${process.env.VUE_APP_ELASTIC_SEARCH_TOKEN}` }
      }
      commit('setQuery', payload.payload.query)
      return Vue.$http.post(uri, payload.payload, config).then(res => {
        commit('setValue', { data: res.data.results, new: payload.newSearch })
        commit('setMeta', res.data.meta)
      })
    },
    getNextSearchPage ({ dispatch, state }, value = null) {
      const payload = {
        page: {
          current: (!!state.searchMeta && !value) ? state.searchMeta.page.current + 1 : 1,
          size: 10
        },
        query: value || state.query
      }
      const newSearch = !!value

      dispatch('searchElastic', { payload, newSearch })
    }
  },
  getters: {
    getSearchValue: state => state.searchValue,
    isNotLastPage: state => state.searchMeta && (state.searchMeta.page.current < state.searchMeta.page.total_pages)
  }
}
