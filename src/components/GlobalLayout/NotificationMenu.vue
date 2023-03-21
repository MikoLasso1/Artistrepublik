<template>
  <div id="notificationmenu" class="pr-7 notificationmenu">
    <!-- Notification Menu Button -->
    <v-badge
      color="primary"
      dot
      overlap
      :value="notifications !== null && notifications.messages > 0 || notifications !== null && notifications.feed > 0 || notifications !== null && notifications.friendRequests > 0"
    >
      <v-icon
        color="white"
        dark
        class="notificationmenu-button"
        medium
        @click="showNotification = !showNotification"
      >
        mdi-bell
      </v-icon>
    </v-badge>
    <!-- Notification Menu -->
    <v-menu
      v-model="showNotification"
      attach="#notificationmenu"
      min-width="280px"
      class="notificationmenu-menu"
      offset-y
      absolute
      bottom
    >
      <!-- Notification Menu List -->
      <v-card dark color="#1E1A24" class="accountmenulist">
        <v-list color="#2B2833">
          <v-list-item
            v-if="notifications !== null && notifications.messages > 0"
            to="/messages"
            link
          >
            <v-list-item-content>
              <v-list-item-title>
                You Have {{ notifications.messages }} messages
                <v-icon
                  color="white"
                  small
                >
                  mdi-arrow-right
                </v-icon>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-if="notifications !== null && notifications.feed > 0"
            to="/feed"
            link
          >
            <v-list-item-content>
              <v-list-item-title>
                You Have {{ notifications.feed }} Feed Interactions
                <v-icon
                  color="white"
                  small
                >
                  mdi-arrow-right
                </v-icon>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            to="/dashboard"
            link
            v-if="notifications !== null && notifications.friendRequests > 0"
          >
            <v-list-item-content>
              <v-list-item-title>
                You Have {{ notifications.friendRequests }} Friend Requests
                <v-icon
                  color="white"
                  small
                >
                  mdi-arrow-right
                </v-icon>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-if="notifications === null"
          >
            <v-list-item-content>
              <v-list-item-title>
                You Have No Notifications
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>
<script>
export default {
  name: 'NotificationMenu',
  props: {
    user: {
      type: Object,
      default: () => null
    },
    notifications: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      showNotification: false
    }
  }
}
</script>
<style lang="scss" scoped>
.notificationmenu {
  position: relative;

  .v-menu__content {
    top: 44px !important;
    left: -239px !important;
  }
}
</style>
