import Vue from 'vue'

const state = {
  campaigns: [],
  bids: []
}

const getters = {
  // gwuCampaigns: state => {
  //   return state.campaigns
  // },
  gwuBids: state => {
    return state.bids
  }
}

const mutations = {
  setGwuCampaigns (state, campaigns) {
    state.campaigns = campaigns
  },
  // addGwuCampaign(state, campaign) {
  //   state.campaigns.push(campaign)
  // },
  setGwuBids (state, bids) {
    state.bids = bids
  },
  // removeGwuCampaign(state, index) {
  //   state.campaigns.slice(index, 1)
  // },
  updateGwuCampaign (state, campaign) {
    state.campaigns[campaign.index] = campaign.data
  }
}

const actions = {
  // fetchGwuCampaigns({ commit }) {
  //   return new Promise((resolve, reject) => {
  //     Vue.$http
  //       .get('v1/gwu/campaign')
  //       .then(res => {
  //         return res.data
  //       })
  //       .then(res => {
  //         commit('setGwuCampaigns', res.data)
  //         resolve(res)
  //       })
  //       .catch(err => {
  //         commit('setGwuCampaigns', [])
  //         reject(err)
  //       })
  //   })
  // },
  // fetchGwuCampaign(id) {
  //   return new Promise((resolve, reject) => {
  //     Vue.$http
  //       .get('v1/gwu/campaign/' + id)
  //       .then(res => {
  //         return res.data
  //       })
  //       .then(res => {
  //         resolve(res)
  //       })
  //       .catch(err => {
  //         reject(err)
  //       })
  //   })
  // },
  fetchGwuBids ({ commit }, product_id) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get('v1/gwu/bids/' + product_id)
        .then(res => {
          return res.data
        })
        .then(res => {
          commit('setGwuBids', res.bids)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // createGwuCampaign({ commit }, campaign) {
  //   return new Promise((resolve, reject) => {
  //     Vue.$http
  //       .post('v1/gwu/campaign', {
  //         'name': campaign.name,
  //         'budget': campaign.budget * 100,
  //         'product_id': campaign.product_id,
  //         'genre': campaign.genre,
  //         'bid': campaign.bid * 100,
  //         'url': campaign.url
  //       })
  //       .then(res => {
  //         return res.data
  //       })
  //       .then(res => {
  //         if (res.success) {
  //           campaign['id'] = res.data.campaign.id
  //           campaign['active'] = null
  //           resolve(res)
  //         }
  //         reject(res)
  //       })
  //       .catch(err => {
  //         reject(err)
  //       })
  //   })
  // },
  modifyCampaign ({ commit }, campaign) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .put('v1/gwu/campaign', {
          name: campaign.name,
          product_id: campaign.product_id,
          genre: campaign.genre,
          bid: campaign.bid,
          url: campaign.url
        })
        .then(res => {
          return res.data
        })
        .then(res => {
          commit('updateGwuCampaign', campaign)
          resolve(res)
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
