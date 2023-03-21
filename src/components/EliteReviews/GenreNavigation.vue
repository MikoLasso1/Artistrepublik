<template>
  <nav class="elitereviews-nav">
    <NavSkeleton v-show="loading && $vuetify.breakpoint.mdAndUp" />
    <div v-show="!loading && $vuetify.breakpoint.mdAndUp" class="elitereviews-nav-dynamic">
      <v-btn dark text @click="navigateTo('')">All</v-btn>

      <v-btn dark text v-for="(genre, index) in genres" :key="index" @click="navigateTo(genre.code)">{{ genre.name }}</v-btn>
    </div>
  </nav>
</template>
<script>
import NavSkeleton from '@/components/EliteReviews/NavSkeleton'

export default {
  props: {
    genres: {
      default: null,
      type: Array
    },
    loading: {
      default: false,
      type: Boolean
    }
  },
  components: {
    NavSkeleton
  },
  data () {
    return {
      choice: null
    }
  },
  methods: {
    navigateTo (genre) {
      this.choice = genre
      this.$emit('choice', this.choice)
    }
  }
}
</script>
<style lang="scss">
.elitereviews {
  &-nav {
    position: relative;
    background-color: #172b4d;

    &-dynamic,
    &-static {
      .v-btn {
        &:not(.v-btn--round).v-size--default {
          padding: 0 8px;
        }

        .v-btn__content {
          font-size: 0.5rem;
        }
      }
    }

    &-search {
      .v-btn {
        &:not(.v-btn--round).v-size--default {
          padding: 0;
        }
      }
    }

    &-searchopen {
      position: absolute;
      top: 100%;
      right: 0;
      z-index: 5000;
    }

    &-img {
      filter: invert(99%) sepia(31%) saturate(0%) hue-rotate(63deg) brightness(112%) contrast(100%);
    }
  }

  @media screen and (min-width: 1140px) {
    &-nav {
      &-dynamic,
      &-static {
        .v-btn {
          .v-btn__content {
            font-size: 0.7rem;
          }
        }
      }
    }
  }
  @media screen and (min-width: 1270px) {
    &-nav {
      &-dynamic,
      &-static {
        .v-btn {
          &:not(.v-btn--round).v-size--default {
            padding: 0 16px;
          }

          .v-btn__content {
            font-size: 0.875rem;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
a {
  text-decoration: none;

  span {
    font-weight: 700;
    color: #A80E20;
  }
}

.elitereviews {
  &-logo {
    text-align: left;
    padding: 0 8px 0 0;
  }

  &-nav {
    padding: 0 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;

    &-static {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
    }

    &-dynamic {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-evenly;
      overflow: hidden;
      width: 100%;
    }
  }

  @media screen and (min-width: 960px) {
    padding: 0 80px;
  }
  @media screen and (min-width: 1024px) {
    &-logo {
      padding: 0 20px 0 0;
    }
  }
}
</style>
