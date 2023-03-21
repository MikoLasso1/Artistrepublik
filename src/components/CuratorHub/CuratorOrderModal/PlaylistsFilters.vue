<template>
  <div
    id="filters"
    v-click-outside="onClickOutside"
  >
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon :class="{opened: isOpened}" color="primary" v-bind="attrs" v-on="on" @click="toggleOpen">
          <v-icon>mdi-filter</v-icon>
        </v-btn>
      </template>
      <span>Use the filter to find more playlists within your track’s genre</span>
    </v-tooltip>
    <div id="filter-wrap" :class="{opened: isOpened}">
      <div class="form-group">
        <label for="genre">Genre</label>
        <vue-select v-model="filters.genres" :options="genres" multiple :reduce="f=>f.id" label="name" />
      </div>
      <div class="form-group">
        <label for="name">Playlist Name</label>
        <input v-model="filters.name" type="text" class="form-control" name="name" placeholder="Playlist name">
      </div>
      <div class="form-group">
        <label for="username">Username</label>
        <input v-model="filters.username" type="text" class="form-control" name="username" placeholder="Artist Republik or Spotify Username">
      </div>
      <div class="form-group">
        <label for="followers">Followers</label>
        <br>

        <base-slider v-model="filters.followers" :range="{min: 100, max: 300000}" />
        <div class="row">
          <span class="col-md-6"><span class="text-muted">Min: </span>{{ filters.followers[0] }}</span>
          <span class="col-md-6 text-right"><span class="text-muted">Max: </span>{{ filters.followers[1] }}</span>
        </div>
      </div>
      <div class="form-group money">
        <label for="followers">Price</label>
        <br>
        <base-slider v-model="filters.price" :range="{min: 1, max: 25}" />
        <div class="row">
          <span class="col-md-6"><span class="text-muted">Min: </span>{{ filters.price[0] }}</span>
          <span class="col-md-6 text-right"><span class="text-muted">Max: </span>{{ filters.price[1] }}</span>
        </div>
      </div>
      <div class="row">
        <div class="col text-center">
          <v-btn dark color="primary" @click="toggleOpen">
            Filter
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

export default {
  components: {
    'vue-select': vSelect,
  },
  props: {
    track: Object,
  },
  data: function () {
    return {
      isOpened: false,
      filters: {
        genres: [this.track.genre],
        name: '',
        username: '',
        followers: [100, 3000000],
        price: [1, 25],
      },
    }
  },
  computed: {
    ...mapGetters({
      genres: 'CuratorGenres/getGenres',
    }),
  },
  created: function () {
    if (this.genres.length === 0) {
      this.$store.dispatch('CuratorGenres/getGenres')
    }
  },
  methods: {
    generateQueryString: function () {
      let queryString = ''
      for (const key in this.filters) {
        if (Array.isArray(this.filters[key])) {
          if (key === 'followers') {
            queryString += `${key}Min=${this.filters[key][0]}&${key}Max=${this.filters[key][1]}&`
          } else if (key === 'price') {
            queryString += `${key}Min=${this.filters[key][0]}&${key}Max=${this.filters[key][1]}&`
          } else if (key === 'genres') {
            queryString += `${key}=${this.filters[key]}&`
          }
        } else if (this.filters[key] !== '' && this.filters[key] !== null) {
          queryString += `${key}=${this.filters[key]}&`
        }
      }
      queryString = queryString.substring(0, queryString.length - 1)
      return queryString
    },
    toggleOpen: function () {
      if (this.isOpened) {
        this.$emit('filtered', this.generateQueryString())
      }
      this.isOpened = !this.isOpened
    },
    onClickOutside () {
      if (this.isOpened)
        this.toggleOpen()
    },
  },
}
</script>

<style lang="scss" scoped>
#filters {
  position: relative;
  z-index: 2;

  .icon {
    font-size: 16px;
    width: 16px;
    height: 16px;
    cursor: pointer;

    &:hover, &.opened {
      color: #5e72e4;
    }
  }

  #filter-wrap {
    position: absolute;
    display: none;
    padding: 15px;
    background: #fff;

    &.opened {
      display: block;
      box-shadow: 0 15px 35px rgba(50, 50, 93, 0.2), 0 5px 15px rgba(0, 0, 0, 0.17);
      width: 300px;
      margin-bottom: 20px;
      // height: 400px;
    }
  }
}

.form-group {
  margin-bottom: 5px;
}

.money .text-muted:after {
  content: '$';
  color: #000;
}
</style>
