<template>
  <div v-if="user.username && myUsername() !== user.username" ref="card" class="usercard mb-4">
    <router-link
      :to="({ name: 'profile', params: { username: user.username }})"
      class="usercard-link-img text-left"
    >
      <v-avatar
        rounded="circle"
      >
        <img
          :src="user.profile_photo"
          class="usercard-image"
          loading="lazy"
          :alt="user.username"
        />
      </v-avatar>
    </router-link>
    <router-link :to="({ name: 'profile', params: { username: user.username }})" class="usercard-link-name" @click="getUser(user.username)">
      <p class="usercard-name">{{ user.username }}</p>
    </router-link>
    <p class="usercard-rep">
      REP&nbsp;<span class="font-weight-700 rep">{{ user.rep_points }}</span>
    </p>
    <UserRelationship
      v-if="myUsername() !== user.username"
      :username="user.username"
      :user="user"
      :shorthand="user.shorthand"
      :friend-status="status"
      :is-sender="sender"
      class="userrelationship"
    />
  </div>
</template>
<script>
import UserRelationship from '../Social/UserRelationship.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    UserRelationship
  },
  props: {
    user: {
      type: Object,
      default: null
    },
    twoColumns: {
      type: Boolean
    },
    shorthand: {
      type: Number,
      default: 0,
      description: 'Whether or not to show text in buttons'
    }
  },
  data () {
    return {
      loaded: false,
      status: 4,
      sender: true
    }
  },
  computed: {
    ...mapGetters({
      friendIds: 'friendIds',
      incomingFriendIds: 'incomingFriendIds',
      pendingFriendIds: 'pendingFriendIds',
      suggestedFriendIds: 'suggestedFriends'
    })
  },
  methods: {
    myUsername () {
      return this.$store.getters.getUser.username
    },
    getUser (username) {
      this.$emit('get-user', username)
    },
    getStatus () {
      let friends = Object.values(this.friendIds)
      let incoming = Object.values(this.incomingFriendIds)
      let pending = Object.values(this.pendingFriendIds)
      if (friends.includes(this.user.id)) {
        this.status = 1
        return
      }
      if (incoming.includes(this.user.id)) {
        this.status = 0
        this.sender = false
        return
      }
      if (pending.includes(this.user.id)) {
        this.status = 0
        this.sender = true
        return
      }
      this.status = 4
      this.sender = true
      this.loaded = true
    }
  },
  mounted () {
    this.getStatus()
  }
}
</script>
<style scoped>
.usercard {
  max-width: 100%;
  font-family: "Montserrat", sans-serif;
  display: grid;
  grid-template-columns: min-content auto;
  grid-template-rows: min-content min-content;
  align-items: center;
  width: 100%;
  padding: 15px;
}

.usercard-image {
  height: 50px;
  width: 50px;
  justify-self: flex-start;
  cursor: pointer;
}

.usercard-name {
  word-break: break-word;
  text-align: right;
  font-weight: bold;
}

.rep {
  color: #3d2151;
  font-weight: bold;
}

.usercard-link-name {
  color: #3d2151;
  cursor: pointer;
}

.usercard-link:hover {
  color: #7a549d;
}

.userrelationship {
  justify-self: end;
  padding: 0 5px;
}

@media screen and (min-width: 580px) {
  .usercard {
    grid-template-columns: 62px auto auto;
    grid-template-rows: min-content min-content;
    align-items: start;
  }

  .usercard-name,
  .usercard-rep {
    text-align: left;
  }

  .usercard-link-img {
    grid-column: 1;
    grid-row: 1 / span 2
  }

  .usercard-link-name {
    grid-column: 2;
    grid-row: 1;
  }

  .usercard-link-name p,
  .usercard-rep {
    margin: 0 0 3px;
  }

  .usercard-rep {
    grid-column: 2;
    grid-row: 2;
  }

  .userrelationship {
    grid-column: 3;
    grid-row: 1 / span 2;
    padding: 0 20px;
  }
}

@media screen and (min-width: 1200px) {
  .usercard {
    grid-template-columns: auto auto;
    grid-template-rows: min-content min-content;
    align-items: center;
  }

  .usercard-link-img {
    grid-column: 1;
    grid-row: 1;
  }

  .usercard-link-name {
    grid-column: 2;
    grid-row: 1;
  }

  .usercard-link-name p,
  .usercard-rep {
    margin: 0 0 3px;
  }

  .usercard-rep {
    grid-column: 1;
    grid-row: 2;
  }

  .userrelationship {
    grid-column: 2;
    grid-row: 2;
  }
}

@media screen and (min-width: 1536px) {
  .usercard {
    grid-template-columns: 62px auto auto;
    grid-template-rows: min-content min-content;
    align-items: start;
  }

  .usercard-link-img {
    grid-column: 1;
    grid-row: 1 / span 2
  }

  .usercard-link-name {
    grid-column: 2;
    grid-row: 1;
  }

  .usercard-link-name p,
  .usercard-rep {
    margin: 0 0 3px;
  }

  .usercard-rep {
    grid-column: 2;
    grid-row: 2;
  }

  .userrelationship {
    grid-column: 3;
    grid-row: 1 / span 2;
  }
}
</style>
