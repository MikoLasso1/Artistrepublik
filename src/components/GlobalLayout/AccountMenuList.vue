<template>
  <v-card dark color="#1E1A24" class="accountmenulist">
    <v-btn
      class="accountmenulist-close" icon color="white"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title class="text-center">
      <v-avatar v-if="user !== undefined && user !== null" class="accountmenulist-image" size="70">
        <img :src="user.profile_photo" width="70" height="70" alt="artist profile image" />
      </v-avatar>
      <h2 class="accountmenulist-name" v-if="user !== null && user.fname !== '' && user.fname !== null && user.lname !== '' && user.lname !== null">{{ user.fname }} {{ user.lname }}</h2>
      <h2 class="accountmenulist-name" v-else-if="user !== null && user.name !== '' && user.name !== null">{{ user.name }}</h2>
      <h2 class="accountmenulist-name" v-else>Artist</h2>
    </v-card-title>
    <v-card-subtitle class="text-center" v-if="user !== null && user.email !== '' && user.email !== null">
      {{ user.email }}
    </v-card-subtitle>
    <v-list dense color="#2B2833">
      <v-list-item :to="`/${user ? user.username : ''}`" link>
        <v-list-item-content>
          <v-list-item-title>
            <v-list-item-avatar size="16" min-width="16px" min-height="16px">
              <v-icon small>
                mdi-eye
              </v-icon>
            </v-list-item-avatar>
            View Your Profile
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        to="/features/fans"
        link
      >
        <v-list-item-content>
          <v-list-item-title>
            <v-list-item-avatar class="ml-0" size="16" min-width="16px" min-height="16px">
              <v-icon small>
                mdi-account-multiple
              </v-icon>
            </v-list-item-avatar>
            Your Fans
            <v-chip class="ml-2" light x-small color="#5CE1E6">
              {{ numberWithCommas(fanCount) }}
            </v-chip>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        to="/settings"
        link
      >
        <v-list-item-content>
          <v-list-item-title>
            <v-list-item-avatar size="16" min-width="16px" min-height="16px">
              <v-icon small>
                mdi-pencil
              </v-icon>
            </v-list-item-avatar>
            Edit Settings
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="my-2" light />
      <v-list-item
        to="/payment-methods"
        link
      >
        <v-list-item-content>
          <v-list-item-title>
            <v-list-item-avatar size="16" min-width="16px" min-height="16px">
              <v-icon small>
                mdi-currency-usd
              </v-icon>
            </v-list-item-avatar>
            Payment Methods
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        to="/subscriptions"
        link
      >
        <v-list-item-content>
          <v-list-item-title>
            <v-list-item-avatar size="16" min-width="16px" min-height="16px">
              <v-icon small>
                mdi-credit-card-outline
              </v-icon>
            </v-list-item-avatar>
            Subscriptions
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        to="/orders"
        link
      >
        <v-list-item-content>
          <v-list-item-title>
            <v-list-item-avatar size="16" min-width="16px" min-height="16px">
              <v-icon small>
                mdi-folder
              </v-icon>
            </v-list-item-avatar>
            Orders
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="my-2" light />
      <v-list-item to="/logout" link>
        <v-list-item-content>
          <v-list-item-title>
            <v-list-item-avatar size="16" min-width="16px" min-height="16px">
              <v-icon small>
                mdi-logout
              </v-icon>
            </v-list-item-avatar>
            Sign Out
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AccountMenuList',
  props: {
    user: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      fanCount: 'getFanCount',
    }),
  },
  methods: {
    numberWithCommas(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
  },
}
</script>
<style lang="scss" scoped>
.accountmenulist {
  padding-top: 75px;
  border: 2px solid #8D8D91 !important;

  &-name {
    font-size: 18px;
    margin: 0;
    color: white;
    padding-top: 25px;
    font-family: "Poppins-Bold", sans-serif;
    font-weight: 600;
    text-transform: capitalize;
  }

  &-close {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 5000;
  }
}
</style>
<style lang="scss">
.accountmenulist {
  .v-avatar.accountmenulist-image {
    border: 2px solid #8D8D91;
    margin: 0 auto;
    position: absolute;
    z-index: 1;
    top: -35px;
  }

  .v-list-item {
    background-color: #2B2833;
  }

  .v-list-item__content .v-list-item__title {
    font-size: 16px !important;
    font-family: "system", sans-serif;
    font-weight: 400 !important;
  }

  div.v-card__title {
    background-color: #2B2833;
    position: relative;
    justify-content: center;
  }

  div.v-card__subtitle {
    background-color: #2B2833;
    z-index: 1;
    position: relative;
    border-bottom: 1px solid #1E1A24;
  }

  .v-divider {
    border-color: #1E1A24;
  }
}
</style>
