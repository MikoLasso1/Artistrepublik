import Vue from 'vue'
import moment from 'moment'
import cookie from 'js-cookie'

const getCookieToken = () => {
  const token = cookie.get('auth._token.cookie')
  if (token) {
    return token.replace('Bearer ', '')
  }
  return null
}

const removeAuthCookies = () => {
  cookie.remove('auth._token.cookie')
  cookie.remove('auth._token_expiration.cookie')
  cookie.remove('auth.strategy')
}

const state = {
  token: getCookieToken(),
  expiration: cookie.get('auth._token_expiration.cookie') || null,
  user: {
    profile_photo: '',
    cover_photo: ''
  },
  beta: {
    status: null,
    message: null
  },
  resent: false,
  valid: null
}

const getters = {
  getUser: state => {
    return state.user
  },
  isAuthenticated: state => {
    return ((state.token !== null) && (state.expiration !== null) && (moment(parseFloat(state.expiration)).diff(moment.utc()) > 0))
  },
  shouldExtendSession: state => {
    return state.expiration !== null &&
      state.expiration - moment.utc().unix() > 0 &&
      state.expiration - moment.utc().unix() < 7200
  },
  isResent: state => {
    return state.resent
  },
  isValidated: state => {
    return state.valid
  },
  token: state => state.token
}

const mutations = {
  setToken (state, token) {
    Vue.set(state, 'token', token)
  },
  setExpiration (state, expiration) {
    Vue.set(state, 'expiration', moment.utc(expiration).valueOf())
  },
  setUser (state, user) {
    Vue.set(state, 'user', user)
  },
  setUserProfilePhoto (state, image_url) {
    Vue.set(state.user, 'profile_photo', image_url)
  },
  setUserCoverPhoto (state, image_url) {
    Vue.set(state.user, 'cover_photo', image_url)
  },
  setUserCity (state, city) {
    Vue.set(state.user, 'city', city)
  },
  setResent (state, status) {
    Vue.set(state, 'resent', status)
  },
  logout (state) {
    removeAuthCookies()
    localStorage.removeItem('user')
    Vue.set(state, 'token', null)
    Vue.set(state, 'expiration', null)
    Vue.set(state, 'user', null)
  },
  setBetaResponse (state, res) {
    Vue.set(state, 'status', res.status)
    Vue.set(state, 'message', res.message)
  },
  setValidation (state, status) {
    Vue.set(state, 'valid', status)
  },
  setRegisterReturnData (state, data) {
    const token = data.access_token
    const expiration = data.expires_at
    cookie.set('auth._token.cookie', 'Bearer ' + token)
    cookie.set('auth._token_expiration.cookie', moment.utc(expiration).valueOf())
    cookie.set('auth.strategy', 'cookie')
    localStorage.setItem('user_id', data.id)
    Vue.$http.defaults.headers.common.Authorization = 'Bearer ' + token
    Vue.set(state, 'token', token)
    Vue.set(state, 'user', data)
    Vue.set(state, 'expiration', expiration)
  }
}

const actions = {
  autoLogin ({ state }) {
    if (!cookie.get('auth._token.cookie') || !localStorage.getItem('user_id') || !cookie.get('auth._token_expiration.cookie')) {
      if (state.token !== null) {
        cookie.set('auth._token.cookie', 'Bearer ' + state.token)
      }
      if (state.userId !== null) {
        localStorage.setItem('user_id', state.userId)
      }
      if (state.expiration !== null) {
        cookie.set('auth._token_expiration.cookie', state.expiration)
      }
    }

    if (!state.token || !state.expiration || !state.userId) {
      if (cookie.get('auth._token.cookie')) {
        Vue.set(state, 'token', getCookieToken())
      }
      if (localStorage.getItem('user_id')) {
        Vue.set(state, 'userId', localStorage.getItem('user_id'))
      }
      if (cookie.get('auth._token_expiration.cookie')) {
        Vue.set(state, 'expiration', cookie.get('auth._token_expiration.cookie'))
      }
    }
    // TODO: Add request to get user like what is returned in login.
  },
  betaRegister ({ commit }, user) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .post('v1/beta/signup', user)
        .then(res => {
          return res.data
        })
        .then(res => {
          commit('setBetaResponse', res)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  forgotPasswordRequest (_, email) {
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
  extend ({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      Vue.$http.post('v1/auth/extend')
        .then(res => {
          return res.data
        })
        .then(res => {
          const token = res.access_token
          const expiration = res.expires_at
          cookie.set('auth._token.cookie', 'Bearer ' + token)
          cookie.set('auth._token_expiration.cookie', moment.utc(expiration).valueOf())
          cookie.set('auth.strategy', 'cookie')
          localStorage.setItem('user_id', res.id)
          Vue.$http.defaults.headers.common.Authorization = 'Bearer ' + token
          commit('setToken', token)
          commit('setExpiration', expiration)
          commit('setUser', res)
          dispatch('fetchSettings').then(() => {
            resolve(res)
          })
        })
        .catch(err => {
          removeAuthCookies()
          localStorage.removeItem('user')
          reject(err)
        })
    })
  },
  login ({ commit, dispatch }, user) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .post('v1/auth/login', user)
        .then(res => {
          return res.data
        })
        .then(res => {
          const token = res.data.access_token
          const expiration = res.data.expires_at
          cookie.set('auth._token.cookie', 'Bearer ' + token)
          cookie.set('auth._token_expiration.cookie', moment.utc(expiration).valueOf())
          cookie.set('auth.strategy', 'cookie')
          localStorage.setItem('user_id', res.data.id)
          Vue.$http.defaults.headers.common.Authorization = 'Bearer ' + token
          commit('setToken', token)
          commit('setExpiration', expiration)
          commit('setUser', res.data)
          dispatch('getGenres')
          dispatch('getSubGenres')
          dispatch('fetchSettings').then(() => {
            resolve(res.data)
          })
        })
        .catch(err => {
          commit('setToken', null)
          commit('setUser', null)
          commit('setExpiration', null)
          removeAuthCookies()
          localStorage.removeItem('user')
          reject(err)
        })
    })
  },
  logout ({ commit, dispatch }) {
    commit('logout')
    window.localStorage.clear()
    removeAuthCookies()
    delete Vue.$http.defaults.headers.common.Authorization
    dispatch('resetSettings')
  },
  register: function ({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      return Vue.$http.post('v1/auth/register', data)
        .then(res => {
          const data = res.data.data
          commit('setRegisterReturnData', data)
          dispatch('fetchSettings').then(() => {
            resolve(data)
          })
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getMe: function ({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get('v1/auth/me')
        .then(res => {
          return res.data
        })
        .then(res => {
          localStorage.setItem('user_id', res.data.id)
          commit('setUser', res.data)
          dispatch('getGenres')
          dispatch('getSubGenres')
          dispatch('fetchSettings').then(() => {
            resolve(res.data)
          })
        })
        .catch(err => {
          commit('setToken', null)
          commit('setUser', null)
          commit('setExpiration', null)
          removeAuthCookies()
          localStorage.removeItem('user')
          reject(err)
        })
    })
  },
  resend ({ commit }) {
    commit('setResent', false)
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/auth/resend')
        .then(res => {
          resolve(res.data)
          commit('setResent', true)
        })
        .catch(err => {
          reject(err.data)
        })
    })
  },
  resetPasswordRequest (data) {
    return new Promise((resolve, reject) => {
      Vue.$http.put('v1/password/reset', {
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        token: data.token
      })
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
  validate ({ commit }, key) {
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/auth/register/activate/' + key)
        .then(res => {
          res = res.data
          commit('setValidation', true)
          resolve(res)
        })
        .catch(err => {
          commit('setValidation', false)
          reject(err)
        })
    })
  },
  validatePasswordReset (token) {
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/password/reset/' + token)
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
  }
}

// Export the information
export default {
  state,
  getters,
  mutations,
  actions
}
