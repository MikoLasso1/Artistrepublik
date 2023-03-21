import Vue from 'vue'

const getDefaultState = () => {
  return {
    outlets: []
  }
}

const state = getDefaultState()

const getters = {
  getPROutlets: function (state) {
    return state.outlets
  }
}

const mutations = {
  setPROutlets: function (state, outlets) {
    state.outlets = outlets
  },
  updateOutletOption: function (state, option) {
    const newOutletData = []
    state.outlets.forEach(v => {
      v.options.forEach(o => {
        if (o.id === option.id) {
          o = option
        }
      })
      newOutletData.push(v)
    })
    state.outlets = newOutletData
  },
  addOutletOption: function (state, { outlet_id, option }) {
    const newOutletData = []
    state.outlets.forEach(v => {
      if (v.id === outlet_id) {
        v.options.push(option)
      }
      newOutletData.push(v)
    })
    state.outlets = newOutletData
  },
  deleteOutletOption: function (state, id) {
    const newOutletData = []
    state.outlets.forEach(v => {
      v.options = v.options.filter(v => v.id !== id)
      newOutletData.push(v)
    })
    state.outlets = newOutletData
  },
  addOutlet: function (state, outlet) {
    state.outlets.push(outlet)
  },
  updateOutlet: function (state, outlet) {
    const newOutletData = []
    state.outlets.forEach(v => {
      if (v.id === outlet.id) {
        v = outlet
      }
      newOutletData.push(v)
    })
    state.outlets = newOutletData
  },
  deletePROption: function (state, id) {
    state.outlets = state.outlets.filter(v => v.id !== id)
  }
}

const actions = {
  getMyPROutlets: function ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/press-release/outlet?include=options&me=true')
        .then(response => {
          commit('setPROutlets', response.data.data)
          resolve(response.data.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  updateOutletOption: function ({ commit }, { id, data }) {
    return new Promise((resolve, reject) => {
      Vue.$http.put(`v1/press-release/outlet/option/${id}`, data)
        .then(response => {
          commit('updateOutletOption', response.data.data)
          resolve(response.data.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  saveOutletOption: function ({ commit }, data) {
    return new Promise((resolve, reject) => {
      Vue.$http.post('v1/press-release/outlet/option', data)
        .then(response => {
          commit('addOutletOption', { outlet_id: data.press_release_outlet_id, option: response.data.data })
          resolve(response.data.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  deleteOutletOption: function ({ commit }, id) {
    return new Promise((resolve, reject) => {
      Vue.$http.delete(`v1/press-release/outlet/option/${id}`)
        .then(response => {
          commit('deleteOutletOption', id)
          resolve(response.data.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  savePROutlet: function ({ commit }, { id, data }) {
    let url = 'v1/press-release/outlet'
    if (id) {
      url += `/${id}`
    }
    return new Promise((resolve, reject) => {
      Vue.$http({
        method: 'POST',
        url: url,
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        const outlet = response.data.data
        outlet.options = []
        if (id) {
          commit('updateOutlet', outlet)
        } else {
          commit('addOutlet', outlet)
        }
        resolve(outlet)
      })
        .catch(err => {
          reject(err)
        })
    })
  },
  deletePROutlet: function ({ commit }, id) {
    return new Promise((resolve, reject) => {
      Vue.$http.delete(`v1/press-release/outlet/${id}`)
        .then(response => {
          commit('deletePROption', id)
          resolve(response.data.data)
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
