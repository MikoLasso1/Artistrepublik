import Vue from 'vue'

const actions = {
  // addAditionalInfo({ commit }, userData) {
  //   return new Promise((resolve, reject) => {
  //     Vue.$http
  //       .post('v1/save-profile', userData)
  //       .then(response => {
  //         return response.data
  //       })
  //       .then(succRes => {
  //         resolve(succRes)
  //       })
  //       .catch(error => {
  //         reject(error)
  //       })
  //   })
  // },
  editProfile (userData) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .post(`v1/edit-profile/${localStorage.getItem('user_id')}`, userData)
        .then(response => {
          return response.data
        })
        .then(succRes => {
          resolve(succRes)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getSkills () {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get('v1/all-skills')
        .then(response => {
          return response.data
        })
        .then(succRes => {
          resolve(succRes)
        })
        .catch(error => {
          const err = error.data.error
          reject(err)
        })
    })
  }
}
export default {
  actions
}
