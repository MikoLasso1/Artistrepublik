<template>
  <v-col cols="12" v-if="friends && friends.length > 0" class="my-2">
    <v-card class="component-container component-container-odd text-center">
      <v-card-text>
        <h2 class="my-5 text-center">Friends</h2>
        <v-row justify-content="center">
          <user-card
            v-for="(friend, index) in friendsFiltered" :key="index"
            :user="friend"
            :shorthand="0"
            :status="friend.status"
            :sender="friend.sender"
            @get-user="getUser"
          />
          <hr>
        </v-row>
        <!--Button below will lead to a list of all friends for the profile being viewed-->
        <v-btn
          v-if="friendsCount > 4"
          @click="openModal"
          color="primary"
        >See all Friends
        </v-btn>
      </v-card-text>
    </v-card>
    <v-dialog
      id="modal-all-friend-list"
      v-model="modal"
      max-width="1200"
    >
      <v-card>
        <v-card-text>
          <div class="row justify-space-evenly m-auto">
            <user-card
              v-for="(friend, index) in friends" :key="index" class="my-2 col-md-6 col-lg-4"
              :user="friend"
            />
            <div class="col-12 pagination">
              <v-btn
                v-if="prevPage"
                color="info"
                class="mr-auto"
                @click="prevFriends"
              >Prev
              </v-btn>
              <v-btn
                v-if="nextPage"
                color="info"
                class="ml-auto"
                @click="nextFriends"
              >Next
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-col>
</template>
<script>
import UserCard from '../Social/UserCard'

export default {
  name: 'InfluentialConnections',
  components: {
    UserCard
  },
  props: {
    user: Object
  },
  data () {
    return {
      hideFooter: true,
      modal: false,
      params: {}
    }
  },
  computed: {
    friends () {
      return this.$store.getters.getInfluentialFriendInfo
    },
    friendsMeta () {
      return this.$store.getters.getInfluentialConnectionsMeta
    },
    friendsCount () {
      return this.$store.getters.getInfluentialConnectionsMeta.total
    },
    friendsFiltered () {
      return this.$store.getters.getInfluentialFriendInfo.slice(0, 4)
    },
    prevPage () {
      return this.$store.getters.getInfluentialFriendPrev
    },
    nextPage () {
      return this.$store.getters.getInfluentialFriendNext
    }
  },
  methods: {
    openModal () {
      this.modal = true
    },
    fetchData () {
      this.$store.dispatch('getInfluentialConnectionInfo', { user: this.user.username, params: this.params })
    },
    prevFriends () {
      this.params.page = this.prevPage
      this.fetchData()
    },
    nextFriends () {
      this.params.page = this.nextPage
    },
    getUser (user) {
      this.$router.push('/' + user.username)
    }
  },
  created () {
    this.fetchData()
  }
}
</script>
<style scoped>
section {
  width: 90%;
  max-width: 1920px;
}

h2 {
  text-transform: uppercase;
}

h2,
h3,
p {
  font-family: "Montserrat", sans-serif;
}

h3 a {
  color: #7a549d;
}

h3 a:hover {
  color: #121d3b;
}

.rep {
  color: #7f244f;
}

.artist-friend img {
  width: 100%;
  max-width: 200px;
  border-radius: 0.25rem;
}

.component-container-even {
  background-image: url(/img/profile/component_background_image.png);
  background-position: left top;
}

.webp .component-container-even {
  background-image: url(/img/profile/component_background_image.webp);
}

.component-container-odd {
  background-image: url(/img/profile/component_background_image_flipped.png);
  background-position: right top;
}

.webp .component-container-odd {
  background-image: url(/img/profile/component_background_image_flipped.webp);
}

.component-container {
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
