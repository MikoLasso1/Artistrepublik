<template>
  <v-dialog v-model="dialog" max-width="400" :persistent="persistent" ref="loginModal">
    <v-card :loading="loading">
      <v-card-title class="headline">Login</v-card-title>
      <v-card-text>
        <v-alert
          type="success"
          v-if="success"
        >Logged In successfully.
        </v-alert>
        <v-alert
          type="error"
          v-if="error"
        >Invalid Login details.
        </v-alert>
        <v-form v-model="valid" ref="form">
          <v-text-field
            v-model="form.email"
            :rules="rules.email"
            label="Email"
            tabindex="1"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.password"
            :rules="rules.password"
            label="Password"
            tabindex="2"
            type="password"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="red" @click="dialog = false;">Cancel</v-btn>
        <v-btn text color="primary" @click="doLogin">Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    persistent: {
      default: false,
      type: Boolean
    }
  },
  data: function () {
    return {
      dialog: false,
      valid: true,
      loading: false,
      success: false,
      error: false,
      form: {
        email: null,
        password: null,
        cart_key: this.cartKey
      },
      rules: {
        email: [
          v => !!v || 'Email is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
        ],
        password: [
          v => !!v || 'Password is required'
        ]
      }
    }
  },
  methods: {
    ...mapActions({
      login: 'login'
    }),
    openModal: function () {
      this.dialog = true
    },
    doLogin: async function () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }

      this.loading = true
      this.success = false
      this.error = false
      try {
        await this.login(this.form)
        this.$emit('logged-in')
        this.success = true
        this.dialog = false
      } catch (err) {
        this.error = true
        this.throwError(err)
      }
      this.loading = false
    }
  },
  computed: {
    ...mapGetters({
      cartKey: 'SSCart/getCartKey'
    })
  },
  mounted: function () {
    this.form.cart_key = this.cartKey
  }
}
</script>

<style>

</style>
