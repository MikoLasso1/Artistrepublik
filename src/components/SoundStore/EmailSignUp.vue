<template>
  <v-dialog v-model="dialog" max-width="400" class="email-signup">
    <v-card class="email-signup-card">
      <v-btn text class="email-signup-close" @click="closeModal">
        <v-icon color="#121d3b">
          mdi-close
        </v-icon>
      </v-btn>
      <v-card-title class="email-signup-title">
        <h2 class="email-signup-heading">
          Take Your Sound to the<br />Next Level!
        </h2>
      </v-card-title>
      <v-card-text class="text-center">
        <p class="email-signup-text" v-if="!complete">
          Unlock exclusive rewards, beats, and more!
        </p>
        <v-form v-if="!complete" ref="form" @submit.prevent v-model="valid">
          <v-text-field
            v-model="userEmail"
            :rules="emailRules"
            label="Email"
            placeholder="Tell us where to send your offers"
            class="required"
          ></v-text-field>
        </v-form>
        <v-alert
          dark color="success" v-if="complete && !error"
        >Thank you for signing up!
        </v-alert
        >
        <v-alert
          dark color="error" v-if="error"
        >There was a problem, please refresh the page and try again.
        </v-alert
        >
        <v-btn color="#EE3B8D" @click="submitEmail" v-if="!complete" dark>
          <span v-if="!loading">Join the Future</span>
          <span v-if="loading">
            <v-progress-circular
              indeterminate
              color="#EE3B8D"
            ></v-progress-circular>
            Processing...
          </span>
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import Vue from 'vue'

export default {
  data () {
    return {
      dialog: false,
      valid: true,
      userEmail: null,
      complete: false,
      error: false,
      loading: false,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ]
    }
  },
  methods: {
    openModal () {
      this.dialog = true
    },
    closeModal () {
      this.userEmail = null
      this.dialog = false
    },
    async submitEmail () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.loading = true
      this.error = false
      let {
        data: { data }
      } = await Vue.$http.post('/v1/mailing-list', { email: this.userEmail })
      if (data.success) {
        this.loading = false
        this.complete = true
      } else {
        this.loading = false
        this.complete = false
        this.error = true
      }
    }
  }
}
</script>
<style scoped>
h2 {
  margin: 10px 0;
  text-transform: uppercase;
  text-align: center;
  word-break: break-word;
}

p {
  color: #121d3b;
}

.email-signup {
  position: relative;
}

.email-signup-title {
  justify-content: center;
}

.email-signup-card {
  border: 8px solid #ee3b8d;
}

.email-signup-close {
  position: absolute;
  top: 15px;
  right: 10px;
  z-index: 203;
}
</style>
