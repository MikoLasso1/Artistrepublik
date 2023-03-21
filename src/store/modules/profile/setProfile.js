import Vue from 'vue'

const state = {
  token: null,
  roles: {
    admin: null,
    user: null,
    guest: true
  },
  user_profile: {
    name: '',
    rep_points: '',
    band_name: '',
    bio: '',
    website: '',
    tracks: '',
    profile_photo: '',
    city: '',
    cover_photo: '',
    skills: [],
    email: '',
    social_links: [],
    spotify_enabled: false,
    spotify_artist_id: null
  },
  profileLoading: false
}
const getters = {
  sendProfileInfo: state => {
    return state.user_profile
  },
  userRole (state) {
    for (const key in state.roles) {
      if (state.roles[key]) {
        return key
      }
    }
  },
  profileTest: state => state.profileLoading
}
const mutations = {
  getToken (state, token) {
    state.token = token
  },
  setUserProfilePhoto (state, url) {
    state.user_profile.profile_photo = url
  },
  setUserCoverPhoto (state, url) {
    state.user_profile.cover_photo = url
  },
  setUserCity (state, city) {
    state.user_profile.city = city
  },
  setProfileInfo (state, userData) {
    state.user_profile = userData
    state.user_profile.skills = userData.skills.map(skill => {
      return skill.name
    })
  },
  clearProfile (state) {
    state.user_profile = []
  },
  clearDataAfterLogOut (state) {
    for (const key in state.user_profile) {
      state.user_profile[key] = ''
      state.token = null
    }
  },
  setSpotifyArtistId (state, artistId) {
    state.user_profile.spotify_artist_id = artistId
  },
  SET_PROFILE_TEST (state, payload) {
    Vue.set(state, 'profileLoading', payload)
  }
}

const actions = {
  getAllFriends (data) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get('v1/user/' + data.id + '/friends?page=' + data.page)
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
  setUserProfile ({ commit }, username) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get('v1/user/' + username)
        .then(response => {
          return response.data
        })
        .then(userData => {
          commit('setProfileInfo', userData.data)
          resolve(userData.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  setSpotifyArtist ({ commit }, artistId) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .post('v1/spotify/artist', { spotify_artist_id: artistId })
        .then(response => response.data)
        .then(spotifyArtist => {
          resolve(spotifyArtist)
          commit('setSpotifyArtistId', spotifyArtist.spotify_artist_id)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  doesUserExist ({ commit }, username) {
    commit('SET_PROFILE_TEST', true)
    return Vue.$http.get(`v1/username/exist/${username}`)
      .then(response => {
        return !!response.data.exists
      }).catch(() => {
        return false
      })
  }
}
export default {
  actions,
  state,
  mutations,
  getters
}
