<template>
  <div class="refer-friend">
    <v-btn
      @click="openModal"
      dark
      color="purple darken-4"
      small
    >
      Refer a Friend
    </v-btn>
    <v-dialog
      v-model="modal"
      width="500"
    >
      <v-card>
        <v-card-title>
          <h2>Invite a friend to explore Artist Republik!</h2>
        </v-card-title>
        <v-card-text>
          <v-alert
            v-show="success"
            border="left"
            color="success"
          >
            Your invite has been sent!
          </v-alert>
          <v-alert
            v-if="error"
            border="left"
            color="danger"
          >
            {{ message }}
          </v-alert>
          <v-form @submit.prevent="submitForm">
            <v-text-field
              v-model="email"
              :rules="emailRule"
              label="E-mail"
              tabindex="1"
              required
            ></v-text-field>
            <v-btn
              color="purple darken-4"
              type="submit"
              dark
              :disabled="loading"
            >Send an Invitation
            </v-btn>
          </v-form>
        </v-card-text>
        <v-card-actions>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  data () {
    return {
      email: '',
      loading: false,
      success: false,
      error: false,
      modal: false,
      emailRule: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ]
    }
  },
  computed: {
    stateEmail () {
      return this.regEmail.test(this.email)
    },
    invalidFeedback () {
      // const validEmail = this.regEmail.test(this.email)

      if (this.email.length > 0) {
        if (this.regEmail.test(this.email)) {
          return ''
        } else {
          return 'Please enter valid email address'
        }
      } else {
        return 'Please enter email address'
      }
    }
  },
  methods: {
    openModal () {
      this.modal = true
    },
    submitForm (evt) {
      evt.preventDefault()
      this.loading = true
      this.success = false
      this.error = false

      Vue.$http.post(`v1/user/friend/invite`, {
        email: this.email
      })
        .then(() => {
          this.success = true
        })
        .catch(error => {
          if (error.response.status === 403) {
            this.error = true
            this.message = error.response.data
          } else if (error.response.status === 400) {
            this.error = true
            this.message = error.response.data
          }

        })
        .then(() => (
          this.loading = false
        ))
    }
  }
}
</script>
<style>
.refer-friend {
  text-align: right;
}

.btn-message {
  background-color: transparent;
}
</style>
