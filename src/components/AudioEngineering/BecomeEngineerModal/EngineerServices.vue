<template>
  <v-card flat class="text-center w-100">
    <v-alert v-if="error" dark color="red">{{ error }}</v-alert>
    <h2>
      Services
    </h2>
    <v-form class="mt-4" v-model="valid" ref="form">
      <v-row align="center">
        <v-col cols="12">
          <v-card outlined flat class="text-center w-100 my-2" style="padding: 1em;" v-for="(service,k) in services" :key="k">
            <v-row align="center">
              <v-col cols="12" md="4">
                <v-select class="d-none" :items="tasks" item-text="name" return-object v-model="service.task" label="Category"></v-select>
                <v-select
                  :loading="loadSubtasks" clearable outlined style="padding: 0em" :rules="rules.subtask" v-model="service.subtask" :items="service.task.subtasks" item-text="name"
                  item-value="id" label="Type"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field label="Service" :rules="rules.name" hint="Give your service a searchable name" outlined v-model="service.name" />
              </v-col>
              <v-col cols="12" md="4">
                <v-textarea auto-grow outlined :rules="rules.description" rows="2" row-height="15" label="Description" hint="Describe what your are charging for" v-model="service.description" />
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="12" md="4">
                <v-text-field :rules="rules.price" label="Price" outlined type="number" v-model="service.price" prefix="$"></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  clearable outlined :rules="rules.turnaround" style="padding: 0em" v-model="service.turnaround" flat :items="turnaround" item-text="name" item-value="value"
                  label="Turnaround Time"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-icon @click="add(k)" v-show="k === services.length-1">add</v-icon>
                <v-icon @click="remove(k)" v-show="k || ( !k && services.length > 1)">clear</v-icon>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
export default {
  props: {
    engineer: Object
  },
  data: function () {
    return {
      loading: false,
      loadSubtasks: false,
      error: null,
      valid: false,
      rules: {
        name: [
          v => !!v || 'A name is required'
        ],
        subtask: [
          v => !!v || 'A type is required'
        ],
        description: [
          v => !!v || 'A description is required'
        ],
        price: [
          v => !!v || 'A price is required'
        ],
        turnaround: [
          v => !!v || 'A turnaround is required'
        ]
      },
      tasks: [],
      services: [{
        task: {
          subtask: []
        },
        subtask: null,
        name: '',
        description: '',
        price: 100,
        turnaround: null
      }],
      turnaround: [{
        value: 86400 * 1,
        operation: '<',
        name: 'Under a day'
      },
        {
          value: 86400 * 3,
          name: 'Under 3 days'
        },
        {
          value: 86400 * 7,
          name: 'Under 1 week'
        },
        {
          value: 86399 * 13,
          name: 'Under 2 weeks'
        },
        {
          value: 86400 * 14,
          operation: '>=',
          name: '2 weeks & above'
        }
      ]
    }
  },
  watch: {
    services: {
      handler (services) {
        let isDone = true
        for (const service of services) {
          isDone = isDone && service.name && service.price && service.description && service.turnaround
        }
        if (isDone) {
          this.$emit('updated-services', this.services)
          this.$emit('proceed')
        } else {
          this.$emit('prevent')
        }
      },
      deep: true
    }
  },
  methods: {
    add () {
      const defaultTask = this.tasks.filter(function (task) {
        return task.name === 'Mastering'
      }).shift()

      this.services.push({
        id: null,
        task: defaultTask,
        subtask: null,
        name: '',
        description: '',
        price: null,
        turnaround: null
      })
      this.$emit('prevent')
    },
    remove (index) {
      this.services.splice(index, 1)
    },
    setServices () {
      if (this.engineer && this.engineer.id) {
        this.services = []
        const defaultTask = this.tasks.filter(function (task) {
          return task.name === 'Mastering'
        }).shift()
        for (const service of this.engineer.catalog.services) {
          this.services.push({
            id: service.id,
            task: defaultTask,
            subtask: service.subtask.id,
            name: service.title,
            description: service.description,
            price: service.price / 100,
            turnaround: service.estimated_turnaround
          })
        }
      }
    }
  },
  created () {
    this.loadSubtasks = true
    this.$store.dispatch('getEngineerTasks').then(() => {
      this.tasks = this.$store.getters.getEngineerTasks
      const defaultTask = this.tasks.filter(function (task) {
        return task.name === 'Mastering'
      }).shift()
      for (var i = 0; i < this.services.length; i++) {
        this.services[i].task = defaultTask
      }
      this.setServices()
      this.loadSubtasks = false
    }).catch(err => {
      this.loadSubtasks = false
      this.$sentry.captureException(err)
      throw err
    })
  }
}
</script>
