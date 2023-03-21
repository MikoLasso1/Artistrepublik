<template>
  <v-form class="searchinput" ref="form" @submit.prevent="submitSearch" transition="slide-x-reverse-transition">
    <v-text-field
      background-color="#2A2932"
      color="white"
      clearable
      flat
      solo-inverted
      hide-details
      label="Search"
      v-model="searchQuery"
      @keyup.enter.stop="submitSearch"
      @click:clear="clearSearch"
      @keyup.13="submitSearch"
      @blur="clearSearch"
    >
      <v-icon
        slot="prepend-inner"
        dark
        @click="submitSearch"
      >
        mdi-magnify
      </v-icon>
    </v-text-field>
  </v-form>
</template>
<script>
export default {
  data () {
    return {
      searchQuery: ''
    }
  },
  methods: {
    clearSearch () {
      this.searchQuery = ''
    },
    submitSearch () {
      this.$emit('searchStart', this.searchQuery)
    }
  }
}
</script>
<style lang="scss" scoped>
.searchinput {
  @media screen and (min-width: 960px) {
    width: 60%;
    max-width: 660px;
  }
}
</style>
<style lang="scss">
.searchinput {
  .v-text-field__slot label.theme--light.v-label {
    color: white;
    font-family: "system", sans-serif;
    font-size: 14px;
    margin: 0;
  }

  .v-text-field.v-text-field--solo .v-input__control {
    min-height: 44px;
  }
}
</style>
