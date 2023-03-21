<template>
  <div>
    <loading-overlay :loading="loading" />
    <v-alert v-if="error" dark color="red">{{ error }}</v-alert>
    <v-row>
      <v-col cols="12" md="5">
        <h2 class="h2">Account</h2>
        <h3 class="h4">Placement Image</h3>
        <div class="text-center">
          <img :src="pictureHref" class="profile_img" @click="doSelectFile" loading="lazy" alt="user_instagram.instagram_username" />
          <input type="file" name="file" ref="uploader" accept="image/*" style="display:none" @input="onSelectFile" />
          <p class="caption mt-2">Typically your Instagram profile picture</p>
        </div>
        <h4 class="h4">Handle</h4>
        <p class="body-1">@{{ user_instagram.instagram_username }}</p>
      </v-col>
      <v-col cols="12" md="7">
        <h2 class="h2">Prices <span class="caption">(Leave blank if not applicable)</span></h2>
        <v-form class="mt-4" v-model="valid" @submit.prevent="onSubmit" ref="form">
          <v-text-field
            v-model="manager.story_price"
            :rules="rules.story_price"
            prepend-icon="mdi-currency-usd"
            label="Story Price"
            type="number"
            dense
          ></v-text-field>
          <v-text-field
            v-model="manager.feed_price"
            :rules="rules.feed_price"
            prepend-icon="mdi-currency-usd"
            label="Feed Price"
            type="number"
            dense
          ></v-text-field>
          <v-text-field
            v-model="manager.story_swipe_up_price"
            :rules="rules.story_swipe_up_price"
            prepend-icon="mdi-currency-usd"
            label="Story Swipe Up Price"
            type="number"
            dense
          ></v-text-field>
          <v-text-field
            v-model="manager.feed_story_price"
            :rules="rules.feed_story_price"
            prepend-icon="mdi-currency-usd"
            label="Feed + Story Price"
            type="number"
            dense
          ></v-text-field>
          <v-text-field
            v-model="manager.feed_story_swipe_up_price"
            :rules="rules.feed_story_swipe_up_price"
            prepend-icon="mdi-currency-usd"
            label="Feed + Story Swipe Up Price"
            type="number"
            dense
          ></v-text-field>
          <div class="text-right">
            <v-btn color="primary" type="submit">Save</v-btn>
          </div>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import LoadingOverlay from '@/components/LoadingOverlay'

export default {
  components: {
    LoadingOverlay
  },
  props: {
    managerId: [Number, String]
  },
  data: function () {
    return {
      loading: true,
      error: null,
      valid: false,
      tmp_img_url: null,
      manager: {
        id: null,
        picture: null,
        story_price: null,
        feed_price: null,
        story_swipe_up_price: null,
        feed_story_price: null,
        feed_story_swipe_up_price: null,
        suspended: null
      },
      rules: {
        story_price: [
          v => !isNaN(v) || 'A valid numeric value is required',
          v => (v === null || v > 0) || 'Please enter a positive numeric value'
        ],
        feed_price: [
          v => !isNaN(v) || 'A valid numeric value is required',
          v => (v === null || v > 0) || 'Please enter a positive numeric value'
        ],
        story_swipe_up_price: [
          v => !isNaN(v) || 'A valid numeric value is required',
          v => (v === null || v > 0) || 'Please enter a positive numeric value'
        ],
        feed_story_price: [
          v => !isNaN(v) || 'A valid numeric value is required',
          v => (v === null || v > 0) || 'Please enter a positive numeric value'
        ],
        feed_story_swipe_up_price: [
          v => !isNaN(v) || 'A valid numeric value is required',
          v => (v === null || v > 0) || 'Please enter a positive numeric value'
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      user_instagram: 'getInstagram'
    }),
    pictureHref: function () {
      if (this.tmp_img_url) {
        return this.tmp_img_url
      }
      return '/img/profile.jpg'
    }
  },
  methods: {
    ...mapActions([
      'fetchSettings'
    ]),
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
        this.manager.picture = files[0]
      }
    },
    onSubmit: async function () {
      this.error = null
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      if (!this.tmp_img_url) {
        this.error = 'You must upload a picture'
        return
      }
      this.loading = true
      let formData = new FormData()
      formData.append('_method', 'PUT')
      for (let key in this.manager) {
        let value = this.manager[key]
        if (value === '') {
          value = null
        }
        if (key !== 'id') {
          formData.append(key, value)
        }
      }
      try {
        let { data: { data } } = await Vue.$http({
          method: 'POST',
          url: `v1/instagram-placement/account/${this.managerId}`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        this.manager = data
        this.tmp_img_url = this.manager.picture_url
        delete this.manager['picture_url']
        this.fetchSettings()
        this.$emit('close-modal')
      } catch (err) {
        this.throwError(err)
      }
      this.loading = false
    }
  },
  mounted: async function () {
    this.loading = true
    let { data: { data } } = await Vue.$http.get(`v1/instagram-placement/account/${this.managerId}`)
    this.manager = data
    this.tmp_img_url = this.manager.picture_url
    delete this.manager['picture_url']
    this.loading = false
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
