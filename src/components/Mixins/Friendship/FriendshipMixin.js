import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      friendIds: 'friendIds',
      pendingFriendIds: 'pendingFriendIds',
      incomingFriendsIds: 'incomingFriendIds'
    })
  },
  methods: {
    ...mapActions({
      addFriend: 'initiateRelationship',
      removeFriend: 'removeRelationship',
      acceptFriend: 'acceptRequest'
    })
  }
}
