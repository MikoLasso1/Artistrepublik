<template>
  <v-dialog v-model="modal" max-width="350">
    <v-card>
      <v-card-title class="headline">
        Filters
        <v-spacer></v-spacer>
        <v-icon @click="modal = false">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="filters.handle" label="Instagram Handle" prefix="@" />
        <v-range-slider
          v-model="filters.priceRange"
          :min="0"
          :max="500"
          hide-details
          class="align-center"
        >
          <template v-slot:prepend>
            <v-text-field
              :value="filters.priceRange[0]"
              class="mt-0 pt-0"
              hide-details
              single-line
              prefix="$"
              type="number"
              style="width: 60px"
              @change="$set(filters.priceRange, 0, $event)"
            ></v-text-field>
          </template>
          <template v-slot:append>
            <v-text-field
              :value="filters.priceRange[1]"
              class="mt-0 pt-0"
              hide-details
              single-line
              prefix="$"
              type="number"
              style="width: 60px"
              @change="$set(filters.priceRange, 1, $event)"
            ></v-text-field>
          </template>
        </v-range-slider>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="doFilter">Filter</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: function () {
    return {
      modal: false,
      filters: {
        handle: '',
        priceRange: [1, 500]
      }
    }
  },
  methods: {
    openModal: function () {
      this.modal = true
    },
    generateQueryString: function () {
      let queryString = ''
      for (const key in this.filters) {
        if (Array.isArray(this.filters[key])) {
          if (key === 'priceRange') {
            queryString += `${key}Min=${this.filters[key][0]}&${key}Max=${this.filters[key][1]}&`
          }
        } else if (this.filters[key] !== '' && this.filters[key] !== null) {
          queryString += `${key}=${this.filters[key]}&`
        }
      }
      queryString = queryString.substring(0, queryString.length - 1)
      return queryString
    },
    doFilter: function () {
      this.$emit('filtered', this.generateQueryString())
      this.modal = false
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  padding: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
}

.items {
  border-top: 1px solid rgba(0, 0, 0, 0.3);
}

.profile_img {
  width: 100px;
  margin-bottom: 4px;
}
</style>
