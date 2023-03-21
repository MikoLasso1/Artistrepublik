<template>
  <div>
    <div class="text-center">
      <v-btn :color="btnColor" dark @click="$refs.loginModal.openModal()">Login</v-btn>
    </div>
    <br />
    <h3 :class="{'darktheme-register-form': darkForm}" class="h3 text-center">Or<br />Create an account</h3>
    <v-form v-model="valid" ref="form" @submit.prevent="onSubmit">
      <div>
        <validation-errors :errors="validationErrors" />
      </div>
      <v-text-field
        v-model="form.fname"
        :rules="rules.fname"
        label="First Name"
        tabindex="1"
        required
        :class="{'darktheme-register-form': darkForm}"
      ></v-text-field>
      <v-text-field
        v-model="form.lname"
        :rules="rules.lname"
        label="Last Name"
        tabindex="2"
        required
        :class="{'darktheme-register-form': darkForm}"
      ></v-text-field>
      <v-text-field
        v-model="form.email"
        :rules="rules.email"
        label="E-mail"
        tabindex="3"
        required
        :class="{'darktheme-register-form': darkForm}"
      ></v-text-field>
      <v-checkbox
        v-model="form.policy"
        :rules="rules.policy"
        value="1"
        type="checkbox"
        required
        :class="{'darktheme-register-form': darkForm}"
      >
        <div
          slot="label"
          :class="{'darktheme-register-form': darkForm}"
        >
          I agree with the
          <router-link to="/privacy">Privacy Policy</router-link>
          and
          <router-link to="/tos">Terms of Service</router-link>
        </div>
      </v-checkbox>
      <div class="text-center">
        <v-btn :color="btnColor" dark id="public-tool-register-button" type="submit">
          <span v-if="loading">
            <v-progress-circular
              indeterminate
              color="white"
            ></v-progress-circular> Processing...
          </span>
          <span v-else>
            {{ btnText }}
          </span>
        </v-btn>
      </div>
    </v-form>
    <login-modal ref="loginModal" @logged-in="$emit('logged-in')" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LoginModal from '@/components/Public/LoginModal.vue'
import validationErrorsMixin from '@/shared/mixins/ValidationErrorsMixin'

export default {
  props: {
    btnText: {
      type: String,
      default: 'Register'
    },
    btnColor: {
      type: String,
      default: 'primary'
    },
    darkForm: {
      type: Boolean,
      default: false
    }
  },
  mixins: [validationErrorsMixin],
  components: {
    LoginModal
  },
  data: function () {
    return {
      valid: true,
      form: {
        fname: null,
        lname: null,
        email: null,
        policy: false,
        refer: this.$route.query.ref ? this.$route.query.ref : '',
        register_source_page: window.localStorage.getItem('register_source_page') ? window.localStorage.getItem('register_source_page') : 'direct',
        cart_key: this.getCartKey
      },
      loading: false,
      rules: {
        fname: [
          v => !!v || 'First name is required'
        ],
        lname: [
          v => !!v || 'Last name is required'
        ],
        email: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
        ],
        policy: [
          v => !!v || 'Acceptance of Privacy Policy and Terms required'
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: 'isAuthenticated',
      cartKey: 'SSCart/getCartKey'
    })
  },
  methods: {
    ...mapActions({
      doRegister: 'register'
    }),
    onSubmit: async function () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.loading = true
      this.$emit('loading', true)
      try {
        let { success } = await this.doRegister(this.form)
        this.loading = false
        this.$emit('loading', false)
        this.$emit('next-step')
      } catch (error) {
        console.error(error)
        let items
        if (error.response.status === 400) {
          items = Object.values(error.response.data.data.message)
        } else if (error.response.status === 422) {
          items = Object.values(error.response.data.errors)
        }
        this.validationErrors = this.formatErrors(items)
      }
      this.GAEvent(['send', 'event', 'form', 'submit', 'signup'])
      this.$emit('loading', false)
    }
  },
  watch: {
    loggedIn: function () {
      if (this.loggedIn) {
        this.$emit('next-step')
      }
    }
  },
  mounted: function () {
    if (this.loggedIn) {
      this.$emit('next-step')
    }
    this.form.cart_key = this.cartKey
  }
}
</script>
<style>
.darktheme-register-form {
  color: white;
}

.darktheme-register-form.theme--light.v-text-field
> .v-input__control
> .v-input__slot:before {
  border-color: white;
}

.darktheme-register-form.theme--light.v-input input,
.darktheme-register-form.theme--light.v-input label,
.darktheme-register-form.theme--light.v-input i.v-icon,
p.darkthemepage-register-form,
.darktheme-register-form.theme--light button.v-icon,
.darktheme-register-form.theme--light.v-icon,
p.darktheme-register-form {
  color: white;
}

.darktheme-register-form a {
  display: inline;
}
</style>
