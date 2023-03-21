<template>
  <v-card flat class="text-center">
    <v-alert v-if="error" dark color="red">{{ error }}</v-alert>
    <v-form class="mt-4" v-model="valid" ref="form">
      <v-row class="w-100 m-0">
        <v-col cols="12" md="12">
          <v-card class="w-100" tile flat>
            <h2 class="h2" style="text-align:left;">Verify Information</h2>
            <h3 style="text-align:left;" class="subtitle-1 h4">Review your account details</h3>
            <v-row>
              <v-col lg="6" cols="12" class="required">
                <v-text-field required v-model="form.info.name" :rules="rules.name" placeholder="Name" outlined label="Full name" type="text"></v-text-field>
              </v-col>
              <v-col lg="6" cols="12" class="required">
                <v-text-field required v-model="form.info.email" :rules="rules.email" placeholder="Email" outlined label="Email" type="text"></v-text-field>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12" md="12">
          <v-card class="w-100" tile flat :loading="loaders.social">
            <h2 class="h2" style="text-align:left; font-weight: 500;">Social Links</h2>
            <h3 style="text-align: left;" class="subtitle-1 h4">Your social links will be shown on your official Artist Republik profile</h3>
            <v-row>
              <v-col :class="[(() => socialMedia.required ? 'required' : '')()]" md="6" v-for="(socialMedia, k) in socialMedia" :key="k">
                <v-text-field
                  :class="[(() => socialMedia.required ? 'required' : '')()]"
                  v-bind:required="(() => socialMedia.required ? 'required' : '')()"
                  v-model="form.links[socialMedia.code]" label="Username"
                  v-bind:rules="(() => socialMedia.required ? rules.social : [])()"
                  :prepend-icon="socialMedia.icon"
                  :prefix="socialMedia.prefix"
                />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

const _ = require('lodash')

export default {
  props: {
    reviewer: [Object]
  },
  data: function () {
    return {
      error: null,
      valid: false,
      form: {
        info: {
          name: null,
          email: null
        },
        links: {
          FACE: null,
          TWTR: null,
          SPOT: null,
          SCLD: null,
          INST: null,
          SNAP: null
        }
      },
      loaders: {
        social: false
      },
      rules: {
        name: [
          v => !!v || 'A name is required'
        ],
        social: [
          v => !!v || 'This social link is required'
        ],
        email: [
          v => !!v || 'An email address is required',
          v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ]
      }
    }
  },
  mounted () {
    if (this.settings.elite_reviewer.is_reviewer) {
      this.setFormFromReviewer()
    } else {
      this.setFormFromSettings()
    }
  },
  computed: {
    ...mapGetters({
      settings: 'getSettings',
      socialMedia: 'getReviewSocialMedia'
    }),
    submit () {
      let sLinks = {}
      Object.keys(this.form.links).map((value, label) => {
        sLinks[label] = {
          social_media: value,
          url: this.form.links[value]
        }
      })
      return {
        name: this.form.info.name,
        email: this.form.info.email,
        links: sLinks
      }
    }
  },
  methods: {
    ...mapActions({
      fetchSocialMedia: 'fetchReviewSocialMedia'
    }),
    setFormFromReviewer: function () {
      this.form.info.name = this.reviewer.name
      this.form.info.email = this.reviewer.email
      let iLinks = {}
      _.forEach(this.reviewer.links, function (value) {
        iLinks[value.social_media] = value.url
      })
      this.form.links = iLinks
    },
    setFormFromSettings: function () {
      this.form.info = {
        name: this.settings.account.general.fname + ' ' + this.settings.account.general.lname,
        email: this.settings.account.general.email
      }
      this.form.links = {
        FACE: this.settings.account.links.facebook,
        TWTR: this.settings.account.links.twitter,
        SPOT: this.settings.account.links.spotify,
        SCLD: this.settings.account.links.soundcloud,
        INST: this.settings.account.links.instagram,
        SNAP: this.settings.account.links.snapchat
      }
    }
  },
  created () {
    if (!this.socialMedia || this.socialMedia.length === 0) {
      this.loaders.social = true
      this.fetchSocialMedia().finally(() => {
        this.loaders.social = false
      })
    }
  },
  watch: {
    valid: {
      handler () {
        if (this.valid === false) {
          this.$emit('prevent')
        } else if (this.valid === true) {
          this.$emit('updated-form', this.submit)
          this.$emit('proceed')
        }
      },
      deep: true
    },
    form: {
      handler () {
        if (this.valid === true) {
          this.$emit('updated-form', this.submit)
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.profile_img {
  width: 100px;
  border-radius: 50%;
  cursor: pointer;
}

.required label::after {
  content: "*";
  color: red;
}
</style>
