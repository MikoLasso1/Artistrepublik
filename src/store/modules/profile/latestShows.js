import Vue from 'vue'

const state = {
  shows: []
}

const getters = {
  getShowsInfo: function (state) {
    return state.shows
  }
}

const mutations = {
  setShowsInfo (state, showsData) {
    state.shows = showsData
  }
}

const actions = {
  getLatestShowsInfo ({ commit }, username) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get('v1/user/' + username + '/shows')
        .then(showsData => {
          commit('setShowsInfo', showsData.data)
          resolve(showsData.data)
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

// From MS02 Delivery
// const actions = {
//   showNewsFeed({ commit }, feed) {
//     Vue.$http
//       .get("v1/latest-shows")
//       .then(response => {
//         return response;
//       })
//       .catch(err => {});
//   }
// };

// export default {
//   actions
// };
