import Vue from 'vue'

const state = {
  isPlaying: false,
  paused: false,
  url: null,
  uuid: null,
  playable: null
}

const getters = {
  getIsPlaying: function (state) {
    return state.isPlaying
  },
  getPaused: function (state) {
    return state.paused
  },
  getUrl: function (state) {
    return state.url
  },
  getUuid: function (state) {
    return state.uuid
  },
  getPlayable: function (state) {
    return state.playable
  }
}

const mutations = {
  SET_IS_PLAYING: function (state, val) {
    state.isPlaying = val
    if (!val) {
      state.url = null
    }
  },
  SET_PLAYABLE: function (state, val) {
    state.playable = val
  },
  SET_PAUSED: function (state, val) {
    state.paused = val
  },
  SET_PLAYING_URL: function (state, url) {
    state.url = url
  },
  SET_UUID: function (state, uuid) {
    state.uuid = uuid
  }
}

const actions = {
  playBeat: function ({ commit }, uuid) {
    return new Promise((resolve, reject) => {
      Vue.$http.get(`v1/sound-store/beat/play/${uuid}`)
        .then(response => {
          const data = response.data.data
          console.log(data)
          commit('SET_UUID', uuid)
          commit('SET_PLAYING_URL', data.url)
          commit('SET_IS_PLAYING', true)
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  playSample: function ({ commit }, uuid) {
    return new Promise((resolve, reject) => {
      Vue.$http.get(`v1/sound-store/sample-pack/sample/play/${uuid}`)
        .then(response => {
          const data = response.data.data
          commit('SET_UUID', uuid)
          commit('SET_PLAYING_URL', data.url)
          commit('SET_IS_PLAYING', true)
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  nowPlaying: function ({ commit }, beat) {
    commit('SET_PLAYABLE', beat)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
