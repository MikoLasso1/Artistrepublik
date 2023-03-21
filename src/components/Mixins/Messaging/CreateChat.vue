<template>
  <div>
    <v-btn color="primary" @click="createConversation">Chat</v-btn>
  </div>
</template>
<script>
export default {
  props: {
    participants: {
      type: [Number, Array],
      required: false,
      default: () => []
    },
    subject: {
      type: String,
      required: false,
      default: ''
    }
  },
  data: () => ({
    dataParticipants: [],
    dataSubject: ''
  }),
  methods: {
    createConversation (participants = this.participants, subject = this.dataSubject) {
      this.$store.dispatch('createConversation', { participants: participants, subject: subject })
        .then(() => {
          this.$router.push({ name: 'messages' })
        })
    }
  }
}
</script>
