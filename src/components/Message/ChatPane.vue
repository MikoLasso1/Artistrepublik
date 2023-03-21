<template>
  <div class=" d-flex flex-column align-self-end">
    <div
      id="messages"
      class="pa-0 py-0 m-0 ma-0 overflow-y-auto  d-flex flex-column-reverse"
      width="100%"
    >
      <div v-for="(message, index) in messages" :key="index" class="mb-5 ">
        <div
          v-if="isSender(message.user_id)"
          class="d-flex justify-content-end align-content-center"
        >
            <span class="text-muted text--lighten-3 align-self-center">{{
                moment(message.created_at)
              }}
            </span>
          <a
            href="#"
            class="text--darken-4 font-weight-bold h3 my-0 mx-2 align-self-center"
            :to="{ path: `/${message.sender_name}` }"
          >
            {{ message.sender }}
          </a>
          <v-avatar size="50" class="mx-2">
            <img :src="message.profile_photo" class="rounded-circle" :alt="message.sender_name" loading="lazy" />
          </v-avatar>
        </div>
        <div v-else class="d-flex justify-content-start align-content-center">
          <v-avatar size="50" class="mx-2">
            <img :src="message.profile_photo" class="rounded-circle" :alt="message.sender_name" loading="lazy" />
          </v-avatar>
          <a
            href="#"
            class="text--darken-4 font-weight-bold h3 my-0 mx-2 align-self-center"
            :to="{ path: `/${message.sender_name}` }"
          >{{ message.sender }}</a
          >
          <span class="text-muted text--lighten-3 align-self-center">
              {{ moment(message.created_at) }}
            </span>
        </div>
        <div
          :class="[
              isSender(message.user_id)
                ? 'justify-content-end'
                : 'justify-content-start'
            ]"
          class="d-flex flex-fill my-1 mx-3"
        >
          <div
            class="message-body bg-light-success rounded"
            :class="[isSender(message.user_id) ? 'sent' : 'received']"
          >
            {{ message.body }}
          </div>
        </div>
      </div>
    </div>
    <v-row
      dense
      no-gutters
    >
      <v-col
        cols="12"
      >

      </v-col>
      <v-textarea
        v-model="chatMessage"
        label="New Message"
        rows="4"
        filled
        no-resize
        @keydown.enter="onSendMessage()"
      />
    </v-row>
    <v-btn class="bg-success rounded-0 ma-0 pa-0" block @click="onSendMessage()" height="35px">
      Send
    </v-btn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'ChatPane',
  data: () => ({
    chatMessage: ''
  }),
  computed: {
    ...mapGetters({
      user: 'getUser'
    })
  },
  props: {
    messages: {
      type: Array,
      default: () => []
    },
    conversation_id: {
      type: Number,
      default: 0
    }
  },
  watch: {
    conversation_id (newId, oldId) {
      if (oldId !== 0) {
        window.Echo.leave(`chat.${oldId}`)
      }
      this.updateSocketRoom()
    }
  },
  mounted () {
    this.$store.dispatch('setMessagesLoading')
    if (this.conversation_id > 0) {
      this.updateSocketRoom()
    }
  },
  beforeDestroy () {
    window.Echo.leave(`chat.${this.conversation_id}`)
  },
  methods: {
    isSender (sender_id) {
      return sender_id === this.user.id
    },
    scroll () {
      this.$store.dispatch('fetchMessages')
    },
    moment (timestamp) {
      return moment(timestamp).format('MMM Do')
    },
    onSendMessage () {
      this.$store.dispatch('sendMessage', this.chatMessage)
      this.chatMessage = ''
    },
    updateSocketRoom () {
      window.Echo.join(`chat.${this.conversation_id}`).listen(
        '.MessageWasCreated',
        e => {
          this.$store.commit('PUSH_MESSAGE', e.message)
        }
      )
    }
  }
}
</script>

<style scoped>
.message-body {
  padding: 15px;
  max-width: 80%;
}

.v-input__contros {
  margin: -14px !important;
  padding: 0 !important;
}

.v-messages theme--light {
  height: 0 !important;
  min-height: 0 !important;
}

.v-messages v-text-field__details {
  height: 0 !important;
  min-height: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
}

.sent {
  background-color: #e1f0ff !important;
  color: #464e5f !important;
  text-align: right;
}

.received {
  background-color: #c9f7f5 !important;
  color: #222222;
  text-align: left;
}

.messages-list {
  overflow-y: auto !important;
  overflow-x: hidden;
  padding: 0;
}

.chat-container {
  overflow-y: hidden;
}

.text-dark-50 {
  color: #80808f !important;
}
</style>
