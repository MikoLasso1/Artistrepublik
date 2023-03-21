<template>
  <div class="profile-completion">
    <v-alert
      class="text-center"
      color="primary"
      icon="mdi-message"
      v-model="alert"
      border="left"
      dismissible
      prominent
      dark
    >
      Your account is only {{ Math.ceil(accountProgress) }}% complete.
      <br>
      <router-link to="/settings" class="profile-completion-link">Edit your settings&nbsp;<v-icon dark small>mdi-arrow-right</v-icon>
      </router-link>
    </v-alert>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProfileCompletion',
  data () {
    return {
      alert: false,
      accountProgressValues: [
        'general.username',
        'general.email',
        'general.fname',
        'general.lname',
        'general.birthday',
        'general.artist_name',
        'general.genre_id',
        'general.about',
        'address.city',
        'address.state',
        'address.country',
        'address.zipcode'
      ]
    }
  },
  computed: {
    ...mapGetters({
      settings: 'getSettings'
    }),
    accountProgress: function () {
      let completeCount = this.accountProgressValues.reduce((accum, key) => {
        if (this.hasValue(Object.byString(this.settings.account, key))) {
          accum++
        }
        return accum
      }, 0)
      return (completeCount / this.accountProgressValues.length) * 100
    }
  },
  created: function () {
    if (this.accountProgress !== 100) {
      this.alert = true
    }
  }
}
</script>
<style>
a.profile-completion-link {
  color: white;
}

a.profile-completion-link:hover {
  color: #5c1640;
}
</style>
