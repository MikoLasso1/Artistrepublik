<template>
  <div>
    <div
      v-if="loaded && !currentUser"
      ref="card"
      class="UserRelationship"
    >
      <v-btn
        v-if="status === null || status === 4"
        color="primary"
        @click="sendRequest"
      >
        <v-icon small>mdi-account-plus</v-icon>
        <span v-if="shorthand === 1">&nbsp;Add Friend</span>
      </v-btn>

      <v-menu
        offset-y
        v-if="status === 0 && sender === true"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
            v-if="status === 0 && sender === true"
          >
            <v-icon small>mdi-check</v-icon>
            &nbsp;<span v-if="shorthand === 1">Request Sent</span>
            <v-icon small>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-if="status === 0 && sender === true"
            @click="sendRequest"
            class="v-btn v-btn--flat v-btn--text theme--light v-size--default"
          >
            <v-list-item-title>
              <v-icon small>mdi-close</v-icon>
              &nbsp;Cancel Request
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu
        offset-y
        v-if="status === 0 && sender === false"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
            v-if="status === 0 && sender === false"
          >
            &nbsp;Respond
            <v-icon small>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-if="status === 0 && sender === false"
            @click="acceptRequest"
          >
            <v-list-item-title>
              <v-icon small>mdi-check</v-icon>
              &nbsp;Accept Request
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="denyRequest"
            v-if="status === 0 && sender === false"
          >
            <v-list-item-title>
              <v-icon small>mdi-close</v-icon>
              Deny Request
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu
        offset-y
        v-if="status === 1"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
            v-if="status === 1"
          >
            <v-icon small>mdi-check</v-icon>
            &nbsp;<span v-if="shorthand === 1">Friends</span>
            <v-icon small>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-if="status === 1"
            @click="sendRequest"
          >
            <v-list-item-title>
              <v-icon small>mdi-close</v-icon>
              &nbsp;Remove Friend
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    username: {
      type: String
    },
    user: {
      type: Object
    },
    shorthand: {
      type: Number,
      default: 0,
      description: 'Whether or not to show text in buttons'
    },
    friendStatus: Number,
    isSender: [Number, Boolean]
  },
  data () {
    return {
      loaded: true,
      sender: this.isSender,
      status: this.friendStatus
    }
  },
  computed: {
    currentUser () {
      return ((this.$store.getters.getUser || {}).username || false)
        && this.$store.getters.getUser.username === this.username
    }
  },
  watch: {
    username: function (newVal) {
      this.username = newVal
      this.fetchStatus()
    }
  },
  methods: {
    acceptRequest () {
      let data = {
        id: this.user.id
      }
      this.$store.dispatch('acceptRequest', data)
    },
    denyRequest () {
      let data = {
        id: this.user.id
      }
      this.$store.dispatch('denyRequest', data)
    },
    sendRequest () {
      if (!this.loaded) {
        return
      }

      if (this.status === null || this.status === 4) {
        this.$store.dispatch('initiateRelationship', this.user.id)
          .then(() => {
            this.status = 0
            this.sender = true
          })
          .catch(() => { /* DO NOTHING */
          })
      }
      if ((this.status === 0 && this.sender) || this.status === 1) {
        this.$store.dispatch('removeRelationship', this.user.id)
          .then(() => {
            this.status = null
          })
          .catch(() => { /* DO NOTHING */
          })
      }
    },
    fetchStatus () {
      if (this.friendStatus !== undefined && this.isSender !== undefined) {
        this.loaded = true
        return
      }
      this.loaded = false
      this.$store.dispatch('fetchRelationship', { user: this.username, key: 'username' })
        .then(res => {
          this.status = res.status
          this.sender = res.sender
          this.loaded = true
        })
        .catch(() => {
          this.status = null
          this.loaded = true
        })
    }
  }
}
</script>

<style scoped>
</style>
