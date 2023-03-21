<template>
  <v-col cols="12" class="friend-requests p-0">
    <v-card class="friend-requests-card">
      <v-card-title>
        <h2 v-if="friendRequests.length > 0" class="h3 mb-0">Friend Requests</h2>
        <h2 v-else class="h3 mb-0">
          Friend Suggestions
          <br>
          <span v-if="getProfileInfo.city" class="user_city">
          People in your area: {{ getProfileInfo.city }}
          <router-link to="/settings">Update Address</router-link>
        </span>
          <span v-if="! getProfileInfo.city" class="user_city">
          To see people in your area, be sure to
          <router-link to="/settings">update your address</router-link>.
        </span>
        </h2>
        <v-spacer />
        <ReferFriend />
      </v-card-title>
      <v-card-text>
        <div class="wrap p-2 m-auto w-100">
          <div v-if="friendRequests.length > 0">
            <div v-for="(req, index) in friendRequests" :key="index">
              <UserCard :user="req" @get-user="goToProfile" />
              <hr>
            </div>
            <v-col cols="12" class="pagination">
              <v-btn v-if="prevPage" dark class="mr-auto" color="primary" small @click="prevFriends">Prev</v-btn>
              <v-btn dark color="primary" small v-if="nextPage" class="btn ml-auto" @click="nextFriends">Next</v-btn>
            </v-col>
          </div>
          <div v-else-if="suggestions.length > 0">
            <div v-for="(req, index) in suggestions" :key="index">
              <UserCard :user="req" />
            </div>
            <div class="col-12 pagination">
              <v-btn v-if="prevSuggPage" color="primary" small class="mr-auto" @click="fetch(prevSuggPage)">Prev</v-btn>
              <v-btn v-if="nextSuggPage" color="primary" small class="ml-auto" @click="fetch(nextSuggPage)">Next</v-btn>
            </div>
          </div>
          <div v-else class="friend-requests-none">
            <h3 class="friend-requests-none-title">You have no current requests / suggestions.</h3>
            <picture>
              <source srcset="/img/brand/logo_dark_xs.webp" type="image/webp">
              <img class="friend-requests-none-image" src="/img/brand/logo_dark_xs.png" alt="Artist Republik Logo" loading="lazy" />
            </picture>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import UserCard from '@/components/Social/UserCard.vue'
import ReferFriend from '@/components/Dashboard/ReferFriend'

export default {
  components: {
    UserCard,
    ReferFriend,
  },
  props: {
    username: String,
  },
  data () {
    return {
      suggestions: [],
      nextSuggPage: '',
      prevSuggPage: '',
    }
  },
  computed: {
    friendRequests () {
      return this.$store.getters.getFriendRequests
    },
    getProfileInfo () {
      return this.$store.getters.sendProfileInfo
    },
    user () {
      return this.$store.getters.getUser
    },
    prevPage () {
      return this.$store.getters.getFriendRequestsPrev
    },
    nextPage () {
      return this.$store.getters.getFriendRequestsNext
    },
  },
  mounted () {
    this.fetch()
    this.getUserProfile(this.$store.getters.getUser.username)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    acceptRequest (user_id, index) {
      let data = {
        username: user_id,
        index: index,
      }
      this.$store.dispatch('acceptRequest', data)
    },
    denyRequest (user_id, index) {
      let data = {
        username: user_id,
        index: index,
      }
      this.$store.dispatch('denyRequest', data)
    },
    fetch (page = 1) {
      this.$store.dispatch('friendRequests', { page: page })
      if (this.friendRequests.length === 0) {
        this.$store
          .dispatch('fetchSuggested', page)
          .then(res => {
            this.nextSuggPage = res.links.next
              ? res.links.next.match(/\d$/)[0]
              : null
            this.prevSuggPage = res.links.prev
              ? res.links.prev.match(/\d$/)[0]
              : null
            this.suggestions = []
            this.suggestions = res.data
          })
          .catch(() => {
            this.suggestions = []
          })
      }
    },
    prevFriends () {
      this.fetch(this.prevPage)
    },
    nextFriends () {
      this.fetch(this.nextPage)
    },
    getUserProfile (username) {
      this.$store.dispatch('setUserProfile', username)
    },
    goToProfile (username) {
      this.$router.push({ path: `/` + username })
    },
  },
}
</script>
<style lang="scss" scoped>
.wrap {
  max-height: 300px;
  overflow-y: auto;
}

.wrap::-webkit-scrollbar {
  width: 11px;
  scrollbar-width: thin;
  scrollbar-color: rgb(220, 209, 223) #eae5eb;
}

.wrap::-webkit-scrollbar-track {
  background: #eae5eb;
}

.wrap::-webkit-scrollbar-thumb {
  background-color: rgb(220, 209, 223);
  border-radius: 6px;
  border: 3px solid rgb(220, 209, 223);
}

.friend-requests,
.friend-requests-card {
  height: 100%;
}

.friend-requests .user_city {
  font-size: 12px;
  float: right;
  font-weight: 100;
  font-style: italic;
}

.friend-requests-none {
  padding: 3rem 0;
  text-align: center;
}

.friend-requests-none-title {
  text-transform: uppercase;
  font-weight: 300;
}

.friend-requests-none-image {
  opacity: 0.5;
  max-width: 100px;
}
</style>
<style>
div.v-card__title {
  word-break: break-word;
}
</style>
