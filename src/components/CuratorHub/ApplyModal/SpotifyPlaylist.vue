<template>
  <v-form
    class="playlist"
    ref="form"
  >
    <div class="row">
      <div class="col-md-1">
        <v-checkbox
          v-model="selected"
          @change="selectedChange"
        />
      </div>
      <div class="col-md-2">
        <img :src="playlist.image_url" :alt="playlist.name" loading="lazy">
      </div>
      <div class="col-md-3">
        <span class="playlist_name"> {{ playlist.name }}</span><br> {{ playlist.followers }} followers
      </div>
      <div class="col-md-3">
        <v-select
          ref="select"
          :rules="genreValidationRules"
          :hide-details="hideValidationMessage"
          v-model="genre_ids"
          :items="genres.map(g=>({value:g.id,text:g.name}))"
          :reduce="genre => genre.id"
          label="Genres"
          multiple
          @input="onGenreChange"
        ></v-select>
      </div>
      <div class="col-md-3">
        <v-select
          v-model="price"
          :items="priceSelections"
          :disabled="disabled"
          name="price"
          label="Price"
        />
        <span
          v-if="price !== null && defaultPrice !== price"
          class="price_note"
        >Artist Republik Fee: ${{ fee }}</span>
      </div>
    </div>
  </v-form>
</template>

<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'

const _ = require('lodash')

export default {
  props: {
    genres: Array,
    playlist: Object,
    isSelected: Boolean,
    currentPrice: [Number, String],
    defaultPrice: Number
  },

  data: function () {
    return {
      genre_ids: [],
      price: this.getPrice(),
      selected: this.isSelected,
      priceSelections: this.getPriceSelections(),
      isGenreError: false,
      disabled: !this.isSelected
    }
  },

  created: function () {
    if (this.playlist.genres.length > 0) {
      this.genre_ids = this.playlist.genres.map(v => v.id)
    }
  },

  computed: {
    ...mapGetters({
      subscriptions: 'getSubscriptions'
    }),
    fee () {
      if (this.subscriptions.curator) {
        return (this.price * 0.15).toFixed(2)
      } else {
        return this.price / 2
      }
    },
    genreValidationRules: function () {
      return [
        (this.selected
          ? !this.isGenreError
          : true)
        || 'required'
      ]
    },

    hideValidationMessage: function () {
      return !(this.isGenreError && this.selected)
    }
  },

  methods: {
    onGenreChange: _.debounce(function () {
      this.$refs.select.blur()

      if (this.genre_ids === []) {
        return
      }

      Vue.$http.put(`v1/spotify/playlist/${this.playlist.id}`, { genre_ids: this.genre_ids })
        .then(() => {
          this.isGenreError = false
          this.validate()
          let genres = this.genre_ids.map(v => {
            return { id: v }
          })
          this.$emit('genre-change', this.playlist.spotify_playlist_id, genres)
        })
        .catch(err => this.$sentry.captureException(err))
    }, 1000),

    getPriceSelections: function () {
      let currPrice = .50
      let priceArray = []

      while (currPrice <= this.defaultPrice) {
        priceArray.push(currPrice)
        currPrice += .50
      }

      return priceArray
    },

    onPriceChange: function () {
      this.$emit('price-change', this.playlist.spotify_playlist_id, this.price)
      this.validate()
    },

    getPrice: function () {
      return parseFloat(this.currentPrice) || this.defaultPrice
    },

    selectedChange: function () {
      let genres = this.genre_ids.map(v => {
        return { id: v }
      })
      this.$emit('toggle-playlist', this.playlist.spotify_playlist_id, { price: this.price, genres: genres })
      this.disabled = !this.disabled
      this.validate()
    },

    validate: function () {
      this.isGenreError = (this.genre_ids.length < 1)
      this.$refs.form.validate()
      this.$emit('toggle-save-button', this.playlist.spotify_playlist_id, this.hideValidationMessage)
    },

    validateField: function () {
      return (!this.isGenreError && this.selected) || 'required foo'
    }
  },

  watch: {
    price: function (newVal) {
      this.onPriceChange(newVal)
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  max-width: 100%;
}

.row {
  margin-bottom: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 15px;
  border-bottom: 1px solid gray;
}

.price_note {
  text-align: center;
  float: left;
  font-size: 13px;
  margin-top: 5px;
  margin-left: 10px;
}

.playlist_name {
  font-size: 18px;
  font-weight: bold;
}

.v-select.vs--single.vs--searchable {
  margin-top: 5px;
}
</style>
