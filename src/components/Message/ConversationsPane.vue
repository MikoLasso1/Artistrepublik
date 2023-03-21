<template>
  <div class="">
    <v-list
      class="overflow-y-auto overflow-x-hidden pa-0 py-0 "
      flat
      width="100%"
    >
      <v-list-item-group
        mandatory
      >
        <div v-if="conversations.length">
          <v-list-item
            v-for="(item, index) in conversations"
            :key="index"
            two-line
            class="px-2"
            :class="{ active: conversation_id === item.id }"
            @click="conversationSelected(item.id)"
          >
            <v-list-item-avatar>
              <v-img :src="item.participants[0].profile_photo" alt="user image" loading="lazy" />
            </v-list-item-avatar>

            <v-list-item-content class="ml-2 align-content-start">
              <v-list-item-title v-text="item.subject" />
              <v-list-item-subtitle class="text--primary">
                {{
                  item.participants.map(function (particpant) {
                    return particpant.name
                  }).join(', ')
                }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-icon>
              <v-icon :color="item.active ? 'deep-purple accent-4' : 'grey'">
                mdi-message-text
              </v-icon>
            </v-list-item-icon>
          </v-list-item>
        </div>
        <div v-else>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                You don't have any open conversations.
              </v-list-item-title>
            </v-list-item-content>

          </v-list-item>
        </div>
        <div v-observe-visibility="visibilityChanged">&nbsp;</div>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ConversationsPane',
  props: {
    conversations: {
      type: Array,
      default: () => []
    },
    conversation_id: {
      type: Number,
      default: 0
    }
  },
  methods: {
    namesList (users) {
      let names = []
      users.forEach(user => {
        names.push(user.user.name)
      })
      return names.join(', ')
    },
    conversationSelected (conversation) {
      this.$store.dispatch('setCurrentConversation', conversation)
    },
    moment (timestamp) {
      return moment(timestamp).format('MMM Do')
    },
    visibilityChanged () {
      this.$store.dispatch('fetchConversations', true)
    }
  }
}
</script>

<style scoped>
.list-scroll {
  overflow-y: auto;
  overflow-x: hidden;
}

.crop-text-2 {
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.conversations-list {
  overflow-y: auto;
  overflow-x: hidden;
}

.active {
  background-color: #cfe2ff;
}

.conversation-image {
  float: left;
  width: 15%;
}

.v-card__text {
  padding: 0 !important;
}
</style>
