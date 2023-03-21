<template>
  <v-card tile flat class="text-center w-100">
    <v-alert v-if="error" dark dismissible type="error" transition="slide-y-reverse-transition" color="red">{{ error }}</v-alert>
    <h2>Reviewer Service Details</h2>
    <v-form class="mt-4" v-model="valid" ref="form">
      <v-row align="center">
        <v-col cols="12" md="12">
          <v-card outlined flat class="text-center w-100 my-2" style="padding: 1em;">
            <v-row align="center">
              <v-col cols="12" md="5">
                <h2 class="h2 required"><label>Profile Image</label></h2>
                <div class="text-center">
                  <v-img :src="pictureHref" class="profile_img m-auto" alt="reviewer upload" @click="doSelectFile" loading="lazy" />
                  <input type="file" :rules="rules.image" name="file" ref="uploader" accept="image/*" style="display:none" @input="onSelectFile" />
                  <p class="caption mt-2">Please use image as 1000x1000 jpg</p>
                </div>
              </v-col>
              <v-col cols="12" md="7">
                <v-row align="center">
                  <v-col cols="12" md="12" class="required">
                    <v-text-field
                      required v-model="form.profile.brand" :rules="rules.brand" placeholder="Brand Name" label="Brand Name" outlined hint="Your brand, company, or personal name"
                      type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" class="required">
                    <v-textarea
                      required auto-grow outlined :rules="rules.description" rows="14" row-height="15" label="Bio"
                      hint="Describe yourself, qualifications, and why people should choose you as their reviewer" v-model="form.profile.description"
                    />
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="4" class="required">
                <v-select
                  required multiple :loading="loaders.genre" clearable outlined style="padding: 0em" :rules="rules.genre" v-model="form.profile.genres" :items="genres"
                  hint="What genre are you most familiar with?" item-text="name" return-object label="Genres"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4" class="required">
                <v-text-field
                  required label="Orders Per Week" type="number" :rules="rules.orders_per_week" hint="What is the max orders your willing to take per week" outlined
                  v-model="form.profile.orders_per_week"
                />
              </v-col>
              <v-col cols="12" md="4" class="required">
                <v-text-field required label="Paypal Email" :rules="rules.paypal_email" hint="The email you will use for payouts" outlined v-model="form.profile.paypal_email" />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="12" md="12">
          <v-card outlined flat class="text-center w-100 my-2" style="padding: 1em;">
            <loading-overlay :loading="loaders.type" />
            <h2 style="text-align: left;" class="h2">Review Type Pricing</h2>
            <v-card outlined flat tile v-for="(type, k) in types" :key="k">
              <v-card-title>
                {{ type.name + ' Review' }}
              </v-card-title>
              <reviewer-service :service="form.pricing.services[k]" :type="type" />
            </v-card>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
import LoadingOverlay from '@/components/LoadingOverlay'
import ReviewerService from './ReviewerService'

import {
  mapGetters,
  mapActions
} from 'vuex'

const _ = require('lodash')

export default {
  props: {
    reviewer: Object
  },
  components: {
    ReviewerService,
    LoadingOverlay
  },
  data: function () {
    return {
      tmp_img_url: null,
      file: null,
      loading: false,
      loaders: {
        type: false,
        genre: false
      },
      error: null,
      valid: false,
      form: {
        profile: {
          brand: null,
          genres: [],
          img: null,
          img_url: null,
          description: null,
          orders_per_week: null,
          paypal_email: null
        },
        pricing: {
          services: []
        }
      },
      rules: {
        image: [
          v => !!v || 'An image is required'
        ],
        brand: [
          v => !!v || 'A brand name is required'
        ],
        description: [
          v => !!v || 'A bio is required'
        ],
        genre: [
          v => v.length > 0 || 'A genre is required'
        ],
        orders_per_week: [
          v => !!v || 'A number of orders per week is required'
        ],
        paypal_email: [
          v => !!v || 'An email is required'
        ]
      }
    }
  },
  watch: {
    'form.profile.img_url' (val) {
      if (val) {
        this.tmp_img_url = val
      }
    },
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
  },
  computed: {
    ...mapGetters({
      settings: 'getSettings',
      genres: 'getReviewGenres'
    }),
    pictureHref: function () {
      if (this.tmp_img_url) {
        return this.tmp_img_url
      }
      return '/img/profile.jpg'
    },
    types: function () {
      let reviewTypes = this.$store.getters.getReviewTypes
      if (reviewTypes.length > 0) {
        reviewTypes.forEach(() => {
          if (this.form.pricing.services.length !== reviewTypes.length) {
            this.form.pricing.services.push({
              type: null,
              price: null,
              turnaround: null,
              enabled: null
            })
          }
        })
        return reviewTypes
      }
      return []
    },
    submit: function () {
      let sServices = {}
      Object.keys(this.form.pricing.services).map((value) => {
        sServices[value] = this.form.pricing.services[value]
      })

      let sGenres = _.cloneDeep(this.form.profile.genres)
      sGenres = sGenres.map((value) => {
        return value.code
      })

      return {
        brand: this.form.profile.brand,
        description: this.form.profile.description,
        img_url: this.form.profile.img_url,
        img: this.form.profile.img,
        orders_per_week: this.form.profile.orders_per_week,
        paypal_email: this.form.profile.paypal_email,
        genres: sGenres,
        services: sServices
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
  created () {
    if (this.genres.length === 0) {
      this.loaders.genre = true
      this.fetchGenres()
      this.loader.genre = false
    }
    if (this.types.length === 0) {
      this.fetchTypes()
    }
  },
  methods: {
    ...mapActions({
      fetchTypes: 'fetchReviewTypes',
      fetchGenres: 'fetchReviewGenres'
    }),
    doSelectFile: function () {
      this.$refs.uploader.click()
    },
    onSelectFile: function () {
      const input = this.$refs.uploader
      const files = input.files
      if (files && files[0]) {
        this.file = files[0]
        const reader = new FileReader
        reader.onload = e => {
          this.tmp_img_url = e.target.result
          this.form.profile.img_url = this.tmp_img_url
        }
        this.form.profile.img = files[0]
        reader.readAsDataURL(files[0])
      }
    },
    removeErrors () {
      this.error = null
    },
    setFormFromReviewer () {
      this.$set(this.form.profile, 'brand', this.reviewer.brand)
      this.$set(this.form.profile, 'description', this.reviewer.description)
      this.$set(this.form.profile, 'img_url', this.reviewer.img_url)
      this.$set(this.form.profile, 'orders_per_week', this.reviewer.orders_per_week)
      this.$set(this.form.profile, 'paypal_email', this.reviewer.paypal_email)
      this.$set(this.form.profile, 'genres', _.cloneDeep(this.reviewer.genres))
      this.$set(this.form.pricing, 'services', _.cloneDeep(this.reviewer.services))
    },
    setFormFromSettings () {
      this.form.profile.brand = this.settings.account.general.artist_name
      this.form.profile.description = this.settings.account.general.about
      this.form.profile.paypal_email = this.settings.account.payments.paypal_email
    }
  }
}
</script>

<style>
.required label::after {
  content: "*";
  color: red;
}
</style>
