<template>
  <div>
    <header
      class="header pb-9 pt-5 pt-lg-8 d-flex align-items-center text-center search-header"
    >
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-12">
            <h1 class="display-2 text-white">
              <i class="mdi mdi-account-search" aria-hidden="true" />
              {{ $route.meta.display }}
            </h1>
          </div>
        </div>
      </div>
    </header>
    <v-container class="mt--9" style="z-index: 999;">
      <v-row class="search-results">
        <v-col md="12">
          <v-card>
            <div class="search-result" v-for="result in searchResults" :key="result.id.raw" @click="goToUser(result)">
              <span class="search-avatar"><img :src="result.profile_photo.raw" alt="user" loading="lazy"></span>
              <div class="inline-block">
                <p class="h3 my-1 text-uppercase"> {{ result.firstname.raw }} {{ result.lastname.raw }} </p>
                <p class="my-1 search-username"> Username: {{ result.username.raw }} </p>
                <p class="my-1 search-genre" v-if="result.genre && result.genre.raw"> Genre: {{ result.genre.raw }} </p>
              </div>
              <hr>
            </div>
            <div class="search-result search-next text-center mb-4">
              <span class="h5" @click="getNextPage" v-if="isNotLastPage">View More</span>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  name: 'Search',
  components: {},
  metaInfo () {
    return {
      title: 'Search',
      meta: [
        {
          vmid: 'og:url',
          property: 'og:url',
          content: 'https://app.artistrepublik.com' + this.$route.fullPath
        }
      ]
    }
  },
  data () {
    return {
      username: this.$route.params.username,
      hover: [],
      show: false,
      friends: [],
      data: {
        page: 1,
        username: this.$route.params.username
      }
    }
  },
  computed: {
    profileInfo () {
      return this.$store.getters.sendProfileInfo
    },
    currentUser () {
      return this.$store.getters.getUser.username === this.username
    },
    searchResults () {
      return this.$store.getters.getSearchValue
    },
    isNotLastPage () {
      return this.$store.getters.isNotLastPage
    }
  },
  methods: {
    getNextPage () {
      this.$store.dispatch('getNextSearchPage')
    },
    goToUser (result) {
      this.$router.push(result.username.raw)
    }
  },
  created () {
    if (this.$route.query && this.$route.query.query) {
      this.$store.dispatch('getNextSearchPage', this.$route.query.query)
    }
  }
}
</script>
<style>
.search-header {
  min-height: 400px;
  background-image: url(/img/bg/settingsBG.png);
  background-size: cover;
  background-position: center top;
}

.webp .search-header {
  background-image: url(/img/bg/settingsBG.webp);
}

.search-avatar {
  padding: 14px;
}

.search-result {
  padding: 12px;
}

.inline-block {
  display: inline-block;
}

.search-avatar img {
  height: 80px;
  width: auto;
  vertical-align: top;
}

.search-next span:hover {
  font-size: 0.9rem;
}

.search-result:hover {
  background-color: #fff;
}

hr {
  margin: 0.5rem 0
}
</style>
