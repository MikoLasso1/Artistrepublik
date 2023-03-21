<template>
  <v-card flat class="text-center">
    <v-alert v-if="error" dark color="red">{{ error }}</v-alert>
    <h2>
      Details
    </h2>
    <v-form class="mt-4" v-model="valid" ref="form">
      <v-row class="w-100 m-0">
        <v-col cols="12" md="5">
          <h2 class="h2">Account</h2>
          <h3 class="h4">Image</h3>
          <div class="text-center">
            <v-img :src="pictureHref" alt="an image uploaded" class="profile_img m-auto" @click="doSelectFile" />
            <input type="file" name="file" ref="uploader" accept="image/*" style="display:none" @input="onSelectFile" />
            <p class="caption mt-2">Typically your profile picture, brand or company logo!</p>
          </div>
        </v-col>
        <v-col cols="12" md="7">
          <h2 class="h2">Details</h2>
          <v-text-field v-model="details.name" :rules="rules.name" placeholder="Name" outlined hint="Your brand, company, or personal name" type="text"></v-text-field>
          <v-select
            :loading="loading" clearable outlined style="padding: 0em" :rules="rules.genre" v-model="details.genre" :items="genres" hint="What genre are you most familiar with?"
            item-text="name" item-value="id" label="Genre"
          ></v-select>
          <v-textarea v-model="details.description" placeholder="About yourself" auto-grow outlined rows="1" row-height="15" hint="Describe yourself to your clients"></v-textarea>
          <v-textarea v-model="details.catalog_description" placeholder="About your work" auto-grow outlined rows="2" row-height="15" hint="Describe your work to your clients"></v-textarea>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    engineer: [Object]
  },
  data: function () {
    return {
      loading: false,
      error: null,
      valid: false,
      tmp_img_url: null,
      img: null,
      details: {
        id: null,
        img_url: null,
        name: null,
        genre: null,
        description: null,
        catalog_description: null
      },
      services: [],
      rules: {
        name: [
          v => !!v || 'A name is required'
        ],
        genre: [
          v => !!v || 'A genre is required'
        ]
      }
    }
  },
  created () {
    if (this.genres.length === 0) {
      this.loading = true
      this.$store.dispatch('getGenres').then(() => {
        this.genres = this.$store.getters.getGenres
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$sentry.captureException(err)
      })
    }
  },
  mounted () {
    if (this.engineer && this.engineer.id) {
      this.setDetails()
    }
  },
  computed: {
    ...mapGetters({
      genres: 'getGenres'
    }),
    pictureHref: function () {
      if (this.tmp_img_url) {
        return this.tmp_img_url
      }
      return '/img/profile.jpg'
    }
  },
  watch: {
    details: {
      handler (details) {
        if (!details.img_url) {
          if (!this.tmp_img_url) {
            this.error = 'You must upload a picture'
            this.$emit('prevent')
          } else {
            this.error = null
            this.details.img_url = this.tmp_img_url
          }
        }

        const isDone = details.name && details.genre && details.img_url
        if (isDone) {
          this.error = null
          this.$emit('updated-details', details)
          this.$emit('proceed')
        } else {
          this.$emit('prevent')
        }
      },
      deep: true
    }
  },
  methods: {
    setDetails: function () {
      this.details = {
        id: this.engineer.catalog.id,
        img_url: this.engineer.catalog.img_url,
        name: this.engineer.catalog.name,
        genre: this.engineer.genre.id,
        description: this.engineer.description,
        catalog_description: this.engineer.catalog.description
      }
      this.tmp_img_url = this.engineer.catalog.url
    },
    doSelectFile: function () {
      this.$refs.uploader.click()
    },
    onSelectFile: function () {
      const input = this.$refs.uploader
      const files = input.files
      if (files && files[0]) {
        const reader = new FileReader
        reader.onload = e => {
          this.tmp_img_url = e.target.result
        }
        reader.readAsDataURL(files[0])
        this.details.img_url = files[0]
      }
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
</style>
