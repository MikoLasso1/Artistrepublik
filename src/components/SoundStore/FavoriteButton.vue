<template>
  <div>
    <v-btn v-if="!isFavorited" color="primary" @click="doAddFavorite">Favorite</v-btn>
    <v-btn v-else color="red" @click="removeFavorite(id)">Remove Favorite</v-btn>
    <register-modal v-if="!loggedIn" ref="registerModal" />
  </div>
</template>

<script>
import RegisterModal from '@/components/Public/RegisterModal'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    RegisterModal
  },
  props: {
    type: {
      type: String,
      default: 'beat'
    },
    uuid: String
  },
  data: function () {
    return {
      isFavorited: false,
      id: null
    }
  },
  computed: {
    ...mapGetters({
      favorites: 'SSFavorites/getFavorites',
      loggedIn: 'isAuthenticated'
    })
  },
  watch: {
    favorites: {
      handler: function () {
        this.determineIfFavorited()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      addFavorite: 'SSFavorites/addFavorite',
      removeFavorite: 'SSFavorites/removeFavorite'
    }),
    determineIfFavorited: function () {
      this.isFavorited = this.favorites.filter(v => v.uuid === this.uuid).length > 0 ? true : false
      if (this.isFavorited) {
        this.id = this.favorites.filter(v => v.uuid === this.uuid)[0].id
      }
    },
    doAddFavorite: function () {
      if (!this.loggedIn) {
        this.$refs.registerModal.openModal()
      } else {
        this.addFavorite({ type: this.type, uuid: this.uuid })
      }
    }
  },
  created: function () {
    this.determineIfFavorited()
  }
}
</script>

<style>

</style>
