<template>
  <div>
    <v-form v-model="valid" @submit.prevent="onSubmit" ref="form">
      <v-select
        v-model="form.genre_id"
        :items="genres.map(g => {return {value: g.id, text: g.name}})"
        label="Genre"
        :rules="rules.genre_id"
        required
      ></v-select>
      <v-text-field
        v-model="form.location"
        label="City, State (if applicable), Country"
        :rules="rules.location"
        required
      ></v-text-field>
      <v-select
        v-model="form.post_type"
        :items="[{value: 'feed', text: 'Image'}, {value: 'video', text: 'Video'}]"
        label="Post Type"
        :rules="rules.post_type"
        required
      ></v-select>
      <v-checkbox
        v-if="swipeUp"
        v-model="form.swipe_up"
        label="Swipe up?"
      ></v-checkbox>
      <v-text-field
        v-if="form.swipe_up"
        v-model="form.swipe_up_link"
        label="Swipe up link"
        :rules="rules.swipe_up_link"
      ></v-text-field>
      <v-text-field
        v-model="form.instagram_handle"
        label="Instagram Handle"
        :rules="rules.instagram_handle"
        prefix="@"
        required
      ></v-text-field>
      <v-file-input
        v-model="form.media"
        accept="image/*,video/*"
        label="Media"
        :show-size="true"
      >
      </v-file-input>
      <div class="text-right">
        <a v-if="media_url" :href="media_url" target="_blank">Preview</a>
      </div>
      <v-textarea
        v-model="form.caption"
        label="Caption"
        :rules="rules.caption"
        required
      ></v-textarea>
      <div class="d-flex mt-4">
        <v-btn text color="primary" @click="$emit('back-step')">Back</v-btn>
        <v-spacer></v-spacer>
        <v-btn text color="primary" type="submit">Next</v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Vue from 'vue'

export default {
  props: {
    placement: Object
  },
  data: function () {
    return {
      loading: false,
      valid: true,
      form: {
        genre_id: this.placement ? parseInt(this.placement.genre_id) : null,
        location: this.placement ? this.placement.location : '',
        post_type: this.placement ? this.placement.post_type : '',
        swipe_up: this.placement ? (this.placement.swipe_up === 1 ? true : false) : false,
        swipe_up_link: this.placement ? this.placement.swipe_up_link : '',
        instagram_handle: this.placement ? this.placement.instagram_handle : '',
        media: null,
        caption: this.placement ? this.placement.caption : ''
      },
      rules: {
        genre_id: [
          v => !!v || 'You must select a genre'
        ],
        location: [
          v => !!v || 'You must enter a location'
        ],
        post_type: [
          v => !!v || 'You must select a post type'
        ],
        swipe_up_link: [
          v => {
            if (this.form.swipe_up && !v) {
              return 'You must enter a swipe up link'
            }
            return true
          }
        ],
        instagram_handle: [
          v => !!v || 'You must enter your Instagram handle'
        ],
        media: [
          v => !!v || 'You must upload a picture or video'
        ],
        caption: [
          v => !!v || 'You must provide a caption'
        ]
      },
      media_url: this.placement ? this.placement.media_url : null
    }
  },
  computed: {
    ...mapGetters({
      genres: 'getGenres',
      accounts: 'getIPOrderCart'
    }),
    swipeUp: function () {
      let swipeUp = false
      Object.keys(this.accounts).forEach((key) => {
        if (this.accounts[key].types.includes('feed-story-swipe-up') || this.accounts[key].types.includes('story-swipe-up')) {
          swipeUp = true
        }
      })
      return swipeUp
    }
  },
  methods: {
    ...mapActions({
      getGenres: 'getGenres'
    }),
    onSubmit: async function () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.loading = true
      this.$emit('toggle-loading', true)
      let formData = new FormData()
      for (let key in this.form) {
        let value = this.form[key]
        if (key === 'swipe_up') {
          value = value ? 1 : 0
        }
        if (value === null) {
          continue
        }
        formData.append(key, value)
      }
      let url = `v1/instagram-placement/`
      if (this.placement) {
        formData.append('_method', 'PUT')
        url += this.placement.id
      }
      try {
        let { data: { data } } = await Vue.$http({
          method: 'POST',
          url: url,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        this.$emit('toggle-loading', false)
        this.$emit('placement-created', data)
        this.$emit('next-step')
      } catch (err) {
        this.throwError(err)
      }
      this.loading = false
    }
  },
  mounted: function () {
    if (this.genres.length === 0) {
      this.getGenres()
    }
  }
}
</script>

<style>

</style>
