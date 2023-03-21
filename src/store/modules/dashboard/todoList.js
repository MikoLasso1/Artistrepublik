import Vue from 'vue'

const state = {
  todoItems: {}
}

const getters = {
  getTodoItems (state) {
    return state.todoItems
  }
}

const mutations = {
  setTodoItems (state, data) {
    state.todoItems = data
  }
}

const actions = {
  fetchTodoItems ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get('v1/tasklist')
        .then(res => {
          return res.data
        })
        .then(res => {
          commit('setTodoItems', res.data)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  addTodoItem (data) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .post('v1/tasklist', data)
        .then(res => {
          return res.data
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
    })
  },
  updateTodoItem (data) {
    console.log(data)
    const taskId = data.id
    return new Promise((resolve, reject) => {
      Vue.$http
        .put('v1/tasklist/' + taskId, data)
        .then(res => {
          return res.data
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
    })
  },
  deleteTodoItem (id) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .delete('v1/tasklist/' + id)
        .then(res => {
          return res.data
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          console.log(err)
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
