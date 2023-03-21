import Vue from 'vue'

const getDefaultState = () => {
  return {
    account: {
      general: {
        username: null,
        fname: null,
        lname: null,
        birthday: null,
        phone: null,
        gender: null,
        about: null,
        skills: null,
        artist_name: null,
        genre_id: null,
        phone_opt_in: null
      },
      address: {
        address: null,
        address2: null,
        state: null,
        city: null,
        zipcode: null
      },
      distributions: {
        artist_name: null
      },
      billing: {
        address: null,
        address2: null,
        state: null,
        city: null,
        zipcode: null
      },
      payments: {
        paypal_email: null,
        stripe_enabled: false,
        paypal_enabled: false,
        paypal_merchant: false,
        card_brand: null,
        card_last_four: null
      },
      spotify: {
        spotify_enabled: false,
        spotify_artist_id: null
      },
      instagram: {
        instagram_enabled: false,
        instagram_username: null
      },
      links: {
        spotify: null,
        soundcloud: null,
        instagram: null,
        twitter: null,
        snapchat: null,
        facebook: null
      },
      subscriptions: {
        distribution: false,
        curator: false,
        mini_profile: false
      }
    },
    press_release: {
      is_manager: false,
      status: 'pending'
    },
    audio_engineer: {
      id: null,
      is_banned: false,
      is_audio_engineer: false,
      status: 'pending'
    },
    elite_reviewer: {
      uuid: null,
      is_banned: false,
      is_reviewer: false,
      status: 'pending'
    },
    instagram_placement_account: {
      is_account: false,
      id: null,
      is_banned: false
    },
    sound_user: {
      is_account: false,
      display_name: null
    },
    curator: {
      id: null,
      is_curator: false
    },
    privacy: {
      global: {
        in_search: null,
        in_marketplace: null
      },
      registered: {
        in_search: null,
        in_marketplace: null
      }
    },
    security: {
      email: null,
      password: null,
      phone: null
    },
    notifications: {
      general: {
        marketing: null,
        new_messages: null
      },
      marketplace: {
        orders: null,
        message: null
      }
    },
    mini_profile: {
      is_account: false,
      fan_count: 0
    },
    userTutorial: null
  }
}

const state = getDefaultState()

const getters = {
  getSettings (state) {
    return state
  },
  getDistributionArtistName: function (state) {
    return state.account.distributions.artist_name
  },
  getUserTutorial (state) {
    return state.userTutorial
  },
  getStripeEnabled: function (state) {
    return state.account.payments.stripe_enabled
  },
  getPaypalEnabled: function (state) {
    return state.account.payments.paypal_enabled
  },
  getIsPressReleaseManager: function (state) {
    return state.press_release.is_manager
  },
  getPressReleaseManagerStatus: function (state) {
    return state.press_release.status
  },
  getInstagram: function (state) {
    return state.account.instagram
  },
  getInstagramPlacementAccount: function (state) {
    return state.instagram_placement_account
  },
  getAudioEngineer: function (state) {
    return state.audio_engineer
  },
  getEliteReviewer: function (state) {
    return state.elite_reviewer
  },
  getCardDetails: function (state) {
    return { card_brand: state.account.payments.card_brand, card_last_four: state.account.payments.card_last_four }
  },
  getSubscriptions: function (state) {
    return state.account.subscriptions
  },
  getIsSoundUser: function (state) {
    return state.sound_user.is_account
  },
  getSoundUserDisplayName: function (state) {
    return state.sound_user.display_name
  },
  getIsCurator: function (state) {
    return state.curator.is_curator
  },
  getFanCount: function (state) {
    return state.mini_profile.fan_count
  }
}

const mutations = {
  fillSettings (state, settings) {
    Object.assign(state, settings)
  },
  resetSettings: function (state) {
    Object.assign(state, getDefaultState())
  },
  setUserTutorial (state, userTutorial) {
    state.userTutorial = userTutorial
  },
  setEliteReviewer: function (state, reviewer) {
    return state.elite_reviewer = reviewer
  }
}

const actions = {
  fetchSettings ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get('v1/settings')
        .then(res => {
          return res.data
        })
        .then(res => {
          commit('fillSettings', res)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  updateUserInfo (data) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .post('v1/settings', data)
        .then(res => {
          return res.data
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  requestPasswordReset (email) {
    return new Promise((resolve, reject) => {
      Vue.$http.post('v1/password/reset', { email: email })
        .then(res => {
          return res.data
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  updateForgottenPassword (data) {
    return new Promise((resolve, reject) => {
      Vue.$http.post('v1/password/reset/' + data.token, { email: data.email, password: data.password })
        .then(res => {
          return res.data
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  updateProfileImage ({ commit }, image_data) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .post('v1/settings/profile/image', {
          profile_image: image_data
        })
        .then(res => {
          return res.data
        })
        .then(res => {
          commit('setUserProfilePhoto', res.url)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  updateProfileCoverImage ({ commit }, image_data) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .post('v1/settings/profile/cover', {
          cover_image: image_data
        })
        .then(res => {
          return res.data
        })
        .then(res => {
          commit('setUserCoverPhoto', res.url)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  saveSpotifyCode (code) {
    return new Promise((resolve, reject) => {
      Vue.$http.post('v1/spotify', { code: code })
        .then(res => {
          return res.data
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  updateUserTutorial ({ commit }, boolean) {
    return new Promise((resolve, reject) => {
      Vue.$http.post('v1/settings/tutorial', boolean)
        .then(res => {
          return res.data
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getUserTutorial ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/settings/tutorial')
        .then(res => {
          if (res.data.tutorial_show === 1) {
            commit('setUserTutorial', true)
          } else {
            commit('setUserTutorial', false)
          }
          return res.data
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  resetSettings ({ commit }) {
    commit('resetSettings')
  }
}

// Export the information
export default {
  state,
  getters,
  mutations,
  actions
}
