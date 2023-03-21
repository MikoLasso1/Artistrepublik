<template>
  <v-dialog persistent v-model="active" max-width="700" :scrollable="false">
    <v-card>
      <v-card-title class="justify-center">
        <span class="display-2">
          Create a new conversation
        </span>
      </v-card-title>
      <v-card-text class="overflow-hidden pb-0">
        <v-container>
          <v-row justify="center">
            <v-col cols="12">
              <v-text-field outlined clearable v-model="subject" label="Subject" />
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12">
              <v-text-field outlined clearable v-model="friendSearch" label="Search Friends" append-icon="mdi-magnify" />
            </v-col>
          </v-row>
          <v-row class="overflow-y-auto">
            <v-col cols="12">
              <v-list outlined class="py-0">
                <template
                  v-for="(friend, index) in friends"
                >
                  <v-list-item
                    :key="friend.id"
                    @click="onAddFriend(friend.id)"
                  >
                    <v-list-item-avatar>
                      <v-img :src="friend.profile_photo" alt="user image" loading="lazy" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      {{ friend.name }}
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-icon :color="added.includes(friend.id) ? 'primary' : 'grey'">mdi-chat</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                  <v-divider class="my-0" v-if="index + 1 < friends.length" :key="index"></v-divider>
                </template>
              </v-list>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="px-10 pb-4">
        <v-btn color="error" @click="onCancel">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="onSubmit">Create</v-btn>
      </v-card-actions>
    </v-card>
    <template v-slot:modal-footer>
      <v-btn dark color="error" @click="onCancel">
        Cancel
      </v-btn>
      <v-btn dark color="success" @click="onSubmit">
        Create
      </v-btn>
    </template>
  </v-dialog>
</template>

<script>
import findIndex from 'lodash/findIndex'

export default {
  name: 'CreateConversation',
  data: () => ({
    subject: '',
    friendSearch: '',
    added: []
  }),
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    friends () {
      return this.$store.getters.getFriends.filter(friend => {
        return (friend.username.toLowerCase().includes(this.friendSearch.toLowerCase()) || this.added.includes(friend.id))
      })
        .sort((a, b) => {
          if (this.added.includes(a.id)) return 1
          else return a.name - b.name
        })
    }
  },
  methods: {
    onAddFriend (id) {
      if (this.added.includes(id)) {
        let arrIndex = findIndex(this.added, item => item === id)
        this.added.splice(arrIndex, 1)
      } else {
        this.added.push(id)
      }
    },
    onCancel () {
      this.added = []
      this.subject = ''
      this.$emit('onCancel')
    },
    onSubmit () {
      let params = { participants: this.added, subject: this.subject }
      this.$emit('onSubmit', params)
      this.added = []
      this.subject = ''
    }
  }
}
</script>

<style scoped></style>
