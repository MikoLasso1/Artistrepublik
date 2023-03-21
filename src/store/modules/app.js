const state = {
  miniSideBar: false,
  miniSideBarDrawer: true
}

const getters = {
  getSideBarMini: function (state) {
    return state.miniSideBar
  },
  getSideBarDrawer: function (state) {
    return state.miniSideBarDrawer
  }
}

const mutations = {
  SET_SIDEBAR_MINI: function (state, data) {
    state.miniSideBar = data
  },
  SET_SIDEBAR_DRAWER: function (state, data) {
    state.miniSideBarDrawer = data
  }
}

export default {
  namespaced: false,
  state,
  getters,
  mutations
}
