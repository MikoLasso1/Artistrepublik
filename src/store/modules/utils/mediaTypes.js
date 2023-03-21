import Vue from 'vue'

const state = {
  image: [],
  video: []
}

const getters = {
  mediaTypes: state => [...state.image, ...state.video],
  videoTypes: state => state.video,
  imageTypes: state => state.image
}

const mutations = {
  PUSH_IMAGE_TYPE (state, payload) {
    state.image.push(
      ...payload.filter((iType) => {
        return !state.image.map((p) => p).includes(iType)
      })
    )
  },
  PUSH_VIDEO_TYPE (state, payload) {
    state.video.push(
      ...payload.filter((vType) => {
        return !state.video.map((p) => p).includes(vType)
      })
    )
  },
  POP_IMAGE_TYPE (state, payload) {
    state.image = state.image.filter((p) => {
      return p !== payload
    })
  },
  POP_VIDEO_TYPE (state, payload) {
    state.video = state.video.filter((p) => {
      return p !== payload
    })
  }
}

const actions = {
  async fetchMediaTypes ({ commit }) {
    const response = await Vue.$http.get('v1/media/mediaTypes')
    commit('PUSH_IMAGE_TYPE', response.data.data.image)
    commit('PUSH_VIDEO_TYPE', response.data.data.video)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
