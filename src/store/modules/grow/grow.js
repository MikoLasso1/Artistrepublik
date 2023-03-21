import Vue from 'vue'

const state = {
  campaigns: [],
  bids: []
}
const getters = {
  getCampaigns: state => state.campaigns
}
const mutations = {
  setCampaigns (state, campaigns) {
    state.campaigns = campaigns
  },
  setBids (state, bids) {
    state.bids = bids
  }
}
const actions = {
  getCampaigns: async function ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get('v1/gwu/campaigns')
        .then(res => {
          if (res.status === 'success') {
            commit('setCampaigns', res.campaigns)
            resolve(res.campaigns)
          } else {
            reject(res.status)
          }
        })
        .catch(err => reject(err))
    })
  },
  getBid: async function ({ commit }, { product_id }) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get('v1/gwu/bids/' + product_id)
        .then(data => {
          commit('setBids', data.bids)
          resolve(data.bids[0])
        })
        .catch(err => reject(err))
    })
  },
  createCampaign: async function ({ commit }, campaign) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .post('v1/gwu/campaign/create', campaign)
        .then(resp => {
          if (resp.status === 'success') {
            commit('setCampaigns', resp.campaigns)
            resolve(resp.campaigns)
          } else {
            reject(resp.status)
          }
        })
        .catch(err => reject(err))
    })
  },
  updateCampaign: async function ({ commit }, campaign) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .put('v1/gwu/campaign/edit', campaign)
        .then(response => {
          if (response.status === 'success') {
            commit('setCampaigns', response.campaigns)
            resolve(response.campaigns)
          } else {
            reject(response.status)
          }
        })
        .catch(err => reject(err))
    })
  },
  // activateCampaign: async function (campaign) {
  //   return new Promise((resolve, reject) => {
  //     Vue.$http
  //       .put('v1/gwu/campaign/activate', campaign)
  //       .then(res => {
  //         resolve(res)
  //         // if (data.status === 'success') {
  //         //   this.campaigns = data.campaigns;
  //         //   resolve(data.campaigns);
  //         // } else {
  //         //   reject(data.status);
  //         // }
  //       })
  //       .catch(err => reject(err))
  //   })
  // },
  deactivateCampaign: async function (campaign) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .put('v1/gwu/campaign/deactivate', campaign)
        .then(res => {
          resolve(res)
          // if (data.status === 'success') {
          //   this.campaigns = data.campaigns
          //   resolve(data.campaigns)
          // } else {
          //   reject(data.status)
          // }
        })
        .catch(err => reject(err))
    })
  },
  deleteCampaign: async function (campaign) {
    // this.dispatch('fetch', {body, url, method})
    return new Promise((resolve, reject) => {
      Vue.$http
        .delete('v1/gwu/campaign/delete', campaign)
        .then(res => {
          resolve(res)
          // if (data.status === 'success') {
          //   this.campaigns = data.campaigns;
          //   resolve(data.campaigns);
          // } else {
          //   reject(data.status);
          // }
        })
        .catch(err => reject(err))
    })
  }
}
export default {
  actions,
  state,
  mutations,
  getters
}
