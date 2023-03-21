import Vue from 'vue'

const state = {
  skills: []
}

const getters = {
  getskillsInfo: function (state) {
    return state.skills
  }
}

const mutations = {
  setSkillsInfo (state, skillData) {
    state.connections = skillData
  }
}

const actions = {
  getSkillsButtonInfo ({ commit }, username) {
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/user/' + username + '/details')
        .then((friendData) => {
          console.log(friendData)
          commit('setSkillsInfo', skillsData.data)
          resolve(skillsData.data)
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
