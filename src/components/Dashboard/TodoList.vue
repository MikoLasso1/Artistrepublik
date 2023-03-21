<template>
  <div class="todolist">
    <v-card class="todo-list-card">
      <v-card-title>
        <h2 class="todo-list-heading">Your To-Do List</h2>
      </v-card-title>
      <v-card-subtitle>
        Freestyle Your Priorities
      </v-card-subtitle>
      <v-card-text class="my-1">
        <div class="todo-list-container">
          <v-btn v-if="!addingItem" color="purple darken-4" type="" dark @click="addingItem = true" small>
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
          <v-form v-if="addingItem" v-model="valid" @submit.prevent="submitItem" ref="form">
            <v-text-field
              v-model="item.title"
              label="Add a task"
              light
            ></v-text-field>
            <v-btn color="purple darken-4" dark @click="submitItem()" small>Add</v-btn>
            <v-btn color="#f5365c" dark class="mx-1" @click="addingItem = false;item.title = null;" small>Cancel</v-btn>
          </v-form>
          <v-container v-if="loading">
            <v-card>
              <v-card-text class="text-center">
                <v-progress-circular indeterminate size="64" color="purple"></v-progress-circular>
              </v-card-text>
            </v-card>
          </v-container>
          <ul v-if="todoList !== undefined && todoList.length !== 0" class="todo-list">
            <li class="todo-list-record" v-for="(task, index) in todoList" :key="index">
              <div class="todo-list-item">
                <div class="todo-list-info">
                  <h3
                    class="list-info-title h4"
                    :class="{ todoComplete: task.status }"
                  >
                    {{ task.title }}
                  </h3>
                </div>
                <div class="list-box">
                  <div class="list-box-container">
                    <input
                      class="list-box-checkbox"
                      type="checkbox"
                      v-model="task.status"
                      @click="updateItem(task.id, index)"
                      name="completed-todo"
                    />
                  </div>
                  <v-icon @click="deleteItem(task.id)" color="#f5365c" dark>mdi-trash-can</v-icon>
                </div>
              </div>
            </li>
          </ul>
          <div v-else class="todo-list-none">
            <h3 class="todo-list-none-title">You have no current tasks.</h3>
            <picture>
              <source srcset="/img/brand/logo_dark_xs.webp" type="image/webp">
              <img class="todo-list-none-image" src="/img/brand/logo_dark_xs.png" alt="Artist Republik Logo" loading="lazy" />
            </picture>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  name: 'todo-list',
  props: ['user'],
  data () {
    return {
      item: {
        title: null
      },
      loading: true,
      valid: true,
      addingItem: false
    }
  },
  methods: {
    submitItem () {
      if (this.item.title === null && this.item.title === '') {
        console.log('error')
        return
      }
      this.$store.dispatch('addTodoItem', {
        'title': this.item.title,
        'status': 0
      })
        .then(() => {
          this.item.title = null
          this.loading = true
          this.fetchTodoList()
          this.loading = false
          this.addingItem = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    updateItem (id, index) {
      if (this.todoList[index].status === 0 || this.todoList[index].status === false) {
        this.todoList[index].status = 1
      } else {
        this.todoList[index].status = 0
      }
      this.$store.dispatch('updateTodoItem', {
        'id': id,
        'title': this.todoList[index].title,
        'status': this.todoList[index].status
      }).then(() => {
        this.fetchTodoList()
      })
    },
    deleteItem (id) {
      this.$store.dispatch('deleteTodoItem', id).then(() => {
        this.fetchTodoList()
      })
    },
    fetchTodoList () {
      this.$store.dispatch('fetchTodoItems')
    }
  },
  computed: {
    todoList () {
      return this.$store.getters.getTodoItems
    }
  },
  mounted () {
    this.loading = true
    this.fetchTodoList()
    this.loading = false
  }
}
</script>
<style scoped>
.todolist,
.todo-list-card {
  height: 100%;
}

.todo-list-heading {
  margin: 0;
}

.todo-list {
  flex-direction: column;
  display: flex;
  padding-left: 0;
  margin: 1rem 0 0;
  min-height: 100%
}

.todo-list-record {
  position: relative;
  padding: 1rem 1rem;
  margin-bottom: -1px;
  background-color: #fff;
  border-bottom: 1px solid #e9ecef;
  list-style: none;
}

.todo-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.todo-list-item:before {
  content: "";
  position: absolute;
  width: 3px;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #7a549d;
  border-radius: 8px;
}

.todo-list-info {
  padding-left: 0.75rem;
}

.list-info-title {
  margin: 0;
  padding: 0;
}

.list-info-time {
  font-size: 0.75rem;
  text-align: left;
  padding: 0;
  margin: 0;
}

.todoComplete {
  text-decoration: line-through;
}

.list-box {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-end;
}

.list-box-checkbox {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: inline-block;
  position: relative;
  background-color: #ede2f0;
  color: #fff;
  top: 10px;
  height: 30px;
  width: 30px;
  border: 0;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-right: 7px;
  outline: none;
}

.list-box-checkbox:checked::before {
  position: absolute;
  font: 13px/1 "Open Sans", sans-serif;
  left: 11px;
  top: 7px;
  content: "\02143";
  transform: rotate(40deg);
}

.list-box-checkbox:hover,
.list-box-checkbox:checked {
  background-color: #dbcfdf;
}

.todo-list-none {
  padding: 3rem 0;
  text-align: center;
}

.todo-list-none-title {
  text-transform: uppercase;
  font-weight: 300;
}

.todo-list-none-image {
  opacity: 0.5;
  max-width: 100px;
}

.todo-list {
  max-height: 210px;
  overflow-y: auto;
}

.todo-list::-webkit-scrollbar {
  width: 11px;
  scrollbar-width: thin;
  scrollbar-color: rgb(220, 209, 223) #eae5eb;
}

.todo-list::-webkit-scrollbar-track {
  background: #eae5eb;
}

.todo-list::-webkit-scrollbar-thumb {
  background-color: rgb(220, 209, 223);
  border-radius: 6px;
  border: 3px solid rgb(220, 209, 223);
}
</style>
