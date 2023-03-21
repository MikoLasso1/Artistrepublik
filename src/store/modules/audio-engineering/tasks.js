import Vue from 'vue'

const getDefaultState = () => {
  return {
    engineerTasks: [],
    engineerSubtasks: []
  }
}

const state = getDefaultState()

const getters = {
  getEngineerTasks (state) {
    return state.engineerTasks
  },
  getEngineerSubtasks (state) {
    return state.engineerSubtasks
  }
}

const mutations = {
  setEngineerTasks (state, tasks) {
    state.engineerTasks = tasks
  },
  setEngineerSubtasks (state, subtasks) {
    state.engineerSubtasks = subtasks
  }
}

const actions = {
  getEngineerTasks ({ commit }) {
    return Vue.$http.get('v1/audio-engineering/tasks')
      .then((response) => commit('setEngineerTasks', response.data.data))
      .catch((error) => error)
  },
  getEngineerSubtasks ({ commit }) {
    return Vue.$http.get('v1/audio-engineering/subtasks')
      .then((response) => commit('setEngineerSubtasks', response.data.data))
      .catch((error) => error)
  }
}

// Export the information
export default {
  state,
  getters,
  mutations,
  actions
}
