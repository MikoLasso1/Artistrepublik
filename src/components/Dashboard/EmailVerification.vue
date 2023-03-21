<template>
  <div
    v-if="userInfo.active === 0"
    class="email-verification"
  >
    <v-row>
      <v-col cols="12">
        <v-alert
          v-model="alert"
          border="left"
          type="warning"
          color="#e00404"
          dark
          prominent
          icon="mdi-exclamation-thick"
          dismissible
          class="text-center email-verification-alert"
        >
          Welcome to Artist Republik! It appears that you haven't activated your account. Please follow the instructions sent to your email!
          <a
            @click="resend"
            class="email-verification-link"
          >Resend&nbsp;Email</a>
        </v-alert>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'EmailVerification',
  props: {
    userInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      beenClicked: false,
      alert: true
    }
  },
  computed: {
    resent () {
      return this.$store.getters.isResent
    }
  },
  methods: {
    resend () {
      if (this.beenClicked) {
        return
      }
      this.beenClicked = true
      this.$store.dispatch('resend')
    }
  }
}
</script>
<style>
.email-verification-alert .v-alert__content {
  line-height: 1.7;
}

a:not([href]).email-verification-link {
  background-color: #ffc107;
  color: white;
  padding: 5px;
  margin: 0 10px;
  border-radius: 4px;
}

a:not([href]).email-verification-link:hover {
  background-color: white;
  color: #e00404;
}
</style>
