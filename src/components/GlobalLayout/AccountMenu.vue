<template>
  <v-menu
    bottom
    left
    attach="#default-app-bar"
    min-width="300px"
    class="accountmenu"
  >
    <template v-slot:activator="{ on, attrs }">
      <!-- Account Menu Button -->
      <v-btn
        :outlined="$vuetify.breakpoint.mdAndUp"
        color="white"
        dark
        v-bind="attrs"
        v-on="on"
        text
        class="accountmenu-button mr-2"
        close-on-content-click
        :large="$vuetify.breakpoint.mdAndUp"
      >
        <v-avatar v-if="user !== undefined && user !== null" class="accountmenu-image ml-3 mr-3" :size="avatarSize">
          <img :src="user.profile_photo" :width="avatarSize" :height="avatarSize" alt="artist profile image" />
        </v-avatar>
        <span v-if="$vuetify.breakpoint.mdAndUp">
          <span v-if="user !== null && user.fname !== '' && user.fname !== null">{{ user.fname }}</span>
          <span v-else-if="user !== null && user.name !== '' && user.name !== null">{{ user.name }}</span>
          <span v-else>Artist</span>
          <v-icon right class="accountmenu-icon">
            mdi-chevron-down
          </v-icon>
          &nbsp;
        </span>
      </v-btn>
    </template>
    <!-- Account Menu List -->
    <AccountMenuList :user="user" />
  </v-menu>
</template>
<script>
import AccountMenuList from '@/components/GlobalLayout/AccountMenuList.vue'

export default {
  name: 'AccountMenu',
  components: {
    AccountMenuList
  },
  props: {
    user: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {}
  },
  computed: {
    avatarSize () {
      if (this.$vuetify.breakpoint.smAndDown) {
        return '24'
      } else {
        return '36'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.accountmenu {
  &-button {
    padding: 0 !important;
    min-width: 44px !important;
  }

  @media screen and (min-width: 960px) {
    &-button {
      border-color: rgba(255, 255, 255, 0.3) !important;

      span {
        letter-spacing: 0;
        font-family: "system", sans-serif;
        font-weight: 400;
        text-transform: none;
      }
    }
  }
}
</style>
<style lang="scss">
.accountmenu {
  &-button {
    .v-avatar.accountmenu-image {
      border: 1px solid #8D8D91;
    }
  }

  &-icon.v-icon {
    font-size: 18px;
  }

  @media screen and (min-width: 960px) {
    &-button {
      .v-avatar.accountmenu-image {
        border: none;
      }
    }
  }
}
</style>
