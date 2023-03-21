<template>
  <div id="filters" v-click-outside="onClickOutside">
    <div class="form-group filter">
      <v-range-slider v-model="filters.followers" :min="100" :max="300000" />
      <p>
        <span class="float-left"><span class="text-muted">Min Followers: </span>{{ filters.followers[0] }}</span>
        <span class="float-right"><span class="text-muted">Max Followers: </span>{{ filters.followers[1] }}</span>
      </p>
    </div>
    <div class="form-group filter money">
      <v-range-slider v-model="filters.price" :min="1" :max="25" />
      <p>
        <span class="float-left"><span class="text-muted">Min Price: </span>{{ filters.price[0] }}</span>
        <span class="float-right"><span class="text-muted">Max Price: </span>{{ filters.price[1] }}</span>
      </p>
    </div>
    <div class="form-group filter">
      <vue-select v-model="filters.genres" :options="genres" label="name" multiple :reduce="f=>f.id" placeholder="Genre" class="filter-genre" />
    </div>
    <div class="form-group filter">
      <v-text-field label="Playlist Name" v-model="filters.name" />
    </div>
    <div class="form-group filter">
      <v-text-field label="Username" v-model="filters.username" />
    </div>
    <div class="col text-center py-2">
      <v-btn dark color="primary" class="filter-btn m-1" @click="toggleOpen">
        Filter
      </v-btn>
      <v-btn dark color="success" class="m-1" @click="doCheckout">
        Checkout
      </v-btn>
      <cart @checkout="doCheckout" @removeSelect="removeItem" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import vClickOutside from 'v-click-outside'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import Cart from '@/components/Public/Cart'

export default {
  components: {
    vClickOutside,
    'vue-select': vSelect,
    Cart,
  },
  data: function () {
    return {
      isOpened: false,
      filters: {
        genres: [],
        name: '',
        username: '',
        followers: [100, 3000000],
        price: [1, 25],
      },
    }
  },
  computed: {
    ...mapGetters({
      genres: 'getGenres',
    }),
  },
  created: function () {
    if (this.genres.length === 0) {
      this.$store.dispatch('getGenres')
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
      this.$emit('filtered', this.generateQueryString())
    },
    doCheckout: function () {
      this.$emit('openCuratorModal')
    },
    onClickOutside () {
      if (this.isOpened)
        this.toggleOpen()
    },
    removeItem: function (playlist) {
      this.$emit('removeSelect', playlist.id)
    },
  },
}
</script>

<style lang="scss" scoped>
.filter-genre > div.vs__dropdown-toggle > div.vs__selected-options > input[type="search"].vs__search::placeholder {
  color: rgba(0, 0, 0, 0.6);
}

#filters {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;

  .icon {
    font-size: 16px;
    width: 16px;
    height: 16px;
    cursor: pointer;

    &:hover, &.opened {
      color: #5e72e4;
    }
  }

  .money .text-muted:after {
    content: '$';
    color: #000;
  }

  .form-group {
    width: 21%;
    margin: 1.8%;
    display: inline-block;
  }

  .filter {
    flex: 0 1 100%;

    &-btn {
      margin: 0.5rem;
    }

    @media screen and (min-width: 600px) {
      flex: 0 1 45%;
    }
    @media screen and (min-width: 1200px) {
      flex: 0 1 12%;
    }
  }

  span {
    font-size: 11px;
  }

  ul {
    padding: 0px;
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
    }
  }
}

.v-application v-select ul {
  padding: 0px;
}

.form-group {
  margin-bottom: 5px;
}
</style>
