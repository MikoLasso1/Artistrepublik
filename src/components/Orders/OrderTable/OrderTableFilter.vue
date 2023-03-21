<template>
  <div
    id="filters"
    v-click-outside="onClickOutside"
  >
    <v-icon
      :class="{opened: isOpened}"
      @click="toggleOpen"
    >
      mdi-filter
    </v-icon>
    <div
      id="filter-wrap"
      :class="{opened: isOpened}"
    >
      <div class="form-group">
        <label for="genre">Status</label>
        <select
          v-model="filters.status"
          name="genre"
          class="form-control"
          placeholder="Select a status"
        >
          <option value="" />
          <option value="placed">
            Placed
          </option>
          <option value="processing">
            Processing
          </option>
          <option value="shipped">
            Shipped
          </option>
          <option value="completed">
            Completed
          </option>
          <option value="refunded">
            Refunded
          </option>
        </select>
      </div>
      <div class="row">
        <div class="col text-center">
          <v-btn
            color="primary"
            @click="toggleOpen"
          >
            Filter
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      isOpened: false,
      filters: {
        status: null,
      },
    }
  },
  methods: {
    generateQueryString: function () {
      let queryString = ''
      for (const key in this.filters) {
        if (Array.isArray(this.filters[key])) {
          queryString += `${key}Min=${this.filters[key][0]}&${key}Max=${this.filters[key][1]}&`
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
    onClickOutside: function () {
      if (this.isOpened) {
        this.toggleOpen()
      }
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
    }
  }
}

.form-group {
  margin-bottom: 5px;
}
</style>
