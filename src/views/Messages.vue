<template>
  <div class="h-100">
    <div class="col-12">
      <v-row class="">
        <div class="fancy-bg">
          <header class="header">
            <picture>
              <source
                media="(max-width: 1199px)"
                srcset="/img/msg/header_sm.webp 1x,
                              /img/msg/header_sm.webp 2x,
                              /img/msg/header_sm.webp 3x"
                type="image/webp"
              >
              <source
                media="(max-width: 1199px)"
                srcset="/img/msg/header_sm.jpg 1x,
                              /img/msg/header_sm.jpg 2x,
                              /img/msg/header_sm.jpg 3x"
                type="image/jpg"
              >
              <source
                media="(min-width: 1200px)"
                srcset="/img/msg/header_sm.webp 532w,
                              /img/msg/header_md.webp 1600w,
                              /img/msg/header.webp 2460w"
                type="image/webp" sizes="100vw"
              >
              <source
                media="(min-width: 1200px)"
                srcset="/img/msg/header_sm.jpg 532w,
                              /img/msg/header_md.jpg 1600w,
                              /img/msg/header.jpg 2460w"
                type="image/jpg" sizes="100vw"
              >
              <img src="/img/msg/header.jpg" class="w-100 h-auto" alt="Messages" loading="lazy">
            </picture>
          </header>
        </div>
      </v-row>
      <v-row class="">
        <v-col cols="12" md="3" class="messages-top">
          <v-card elevation="1" rounded="0">
            <v-card-text class="ma-0 pa-0">
              <v-toolbar class="indigo lighten-3" flat>
                <v-text-field
                  v-model="friendSearch"
                  solo
                  label="Name"
                  prepend-inner-icon="mdi-magnify"
                  full-width
                  hide-details
                  dense
                  class="pa-0"
                  @keydown="onFriendSearch"
                />
                <v-btn icon>
                  <v-icon @click="onNewOrCancelCreate()" color="white">mdi-account-multiple-plus-outline</v-icon>
                </v-btn>
              </v-toolbar>
            </v-card-text>
          </v-card>
          <v-card class="">
            <conversations-pane :conversation_id="conversation_id" :conversations="conversations" />
          </v-card>
        </v-col>
        <v-col cols="12" md="9" class="">

          <v-card elevation="1" rounded="0">
            <v-toolbar class="indigo lighten-3" width="100%" dark flat>
              <v-toolbar-title v-if="!messagesLoading" class="flex-grow-1 flex-shrink-0 text-subtitle-1">
                {{
                  (conversation.participants || []).map(function (participant) {
                    return participant.name
                  }).join(', ')
                }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <div v-if="!conversationsLoading" class="flex-shrink-1 flex-grow-0">
                <v-menu bottom left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon color="white">mdi-dots-horizontal</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="onDeleteConversation()">
                      <v-list-item-title>
                        Delete Conversation
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </v-toolbar>
          </v-card>
          <v-card elevation="1" rounded="0" class="">
            <chat-pane :messages="messages" :conversation_id="conversation_id"></chat-pane>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <create-conversation
      :active="creatingConversation"
      @onSubmit="createConversation"
      @onCancel="cancelConversation"
    />
  </div>
</template>
<script>
import ConversationsPane from '@/components/Message/ConversationsPane'
import ChatPane from '@/components/Message/ChatPane'
import { mapGetters } from 'vuex'
import CreateConversation from '@/components/Message/CreateConversation'

export default {
  name: 'Messages',
  components: {
    ConversationsPane,
    ChatPane,
    CreateConversation
  },
  metaInfo () {
    return {
      title: 'Messaging',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content:
            'Artist Republik is a 360 degree platform offering social messaging to help launch your career! We offer reviews, mastering, distribution, playlisting, and more!'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content:
            'Messaging | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content:
            'Artist Republik is a 360 degree platform offering social messaging to help launch your career! We offer reviews, mastering, distribution, playlisting, and more!'
        },
        {
          vmid: 'og:url',
          property: 'og:url',
          content: 'https://app.artistrepublik.com' + this.$route.fullPath
        },
        {
          vmid: 'twitter:title',
          property: 'twitter:title',
          content:
            'Messaging | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Artist Republik is a 360 degree platform offering social messaging to help launch your career! We offer reviews, mastering, distribution, playlisting, and more!'
        }
      ]
    }
  },
  data: () => ({
    friendSearch: '',
    chatMessage: '',
    creatingConversation: false,
    conversationMenu: false
  }),
  computed: {
    ...mapGetters({
      friends: 'getFriends',
      user: 'getUser',
      conversation_id: 'getCurrentConversationId',
      conversations: 'getConversations',
      conversation: 'getCurrentConversation',
      messages: 'getMessages',
      conversationsLoading: 'conversationsLoading',
      messagesLoading: 'messagesLoading'
    })
  },
  beforeMount () {
    this.$store.dispatch('setConversationsLoading')
    this.$store.dispatch('setMessagesLoading')
    this.$store.dispatch('fetchConversations')
  },
  methods: {
    onConversationMenuToggle () {
      this.conversationMenu = !this.conversationMenu
    },
    onDeleteConversation () {
      this.$store.dispatch('deleteConversation')
    },
    onFriendSearch () {
      if (this.friendSearch.length > 1) {
        this.$store.dispatch('fetchConversations', { q: this.friendSearch })
      }
    },
    onNewOrCancelCreate () {
      if (this.creatingConversation) {
        this.cancelConversation()
      } else {
        this.newConversation()
      }
    },
    newConversation () {
      this.creatingConversation = true
      this.$bvModal.show('new-conversation')
      this.$store.dispatch('fetchFriends')
    },
    cancelConversation () {
      this.creatingConversation = false
    },
    createConversation (params) {
      this.$store.dispatch('createConversation', params)
      this.cancelConversation()
    }
  },
  mounted () {
    window.Echo.private(`conversations.${this.user.id}`)
      .listen('.ConversationWasCreated', (e) => {
        this.$store.commit('PUSH_CONVERSATION', e.conversation)
      })
  },
  beforeDestroy () {
    window.Echo.leave(`conversations.${this.user.id}`)
  }
}
</script>
<style scoped>
.fancy-bg {
  width: 100% !important;
}

/*
  .fancy-bg {
    background: -webkit-linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5);
    background: linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5);
    width: 100% !important;
  }
  .messages-container {
    width: 100vw;
    height: 100vh;
  }
  .messages-top {
    width: 100vw;
  }
  .messages-wrapper {
    width: 100vw;
  }
  */
</style>
