<template>
  <div>
    <v-autocomplete
      v-model="searchQuery"
      :loading="searchLoading"
      :search-input.sync="search"
      :filter="v => v"
      :items="searchItems"
      class="black-text autocomplete"
      placeholder="Search..."
      outlined
      :hide-details="true"
      dense
      background-color="white"
      color="black"
    >
      <template #item="{item}">
        <v-list-item class="cursor-pointer" @click="showItem(item.type.raw, item.id.raw)">
          <v-list-item-avatar class="square">
            <v-img :src="item.img_url.raw" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <span class="d-block subtitle-1 search-item-title">{{ item.name.raw }}</span>
              <span class="primary--text text-capitalize"> {{ item.type.raw | itemName }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      searchQuery: null,
      search: null
    }
  },
  computed: {
    ...mapGetters({
      searchLoading: 'SSSearch/GET_IS_LOADING',
      searchItems: 'SSSearch/GET_SEARCH_VALUE'
    })
  },
  watch: {
    search: function (val) {
      val && val !== this.searchQuery && this.doSearch(val)
    }
  },
  methods: {
    ...mapActions({
      doSearch: 'SSSearch/getNextSearchPage'
    }),
    showItem (type, uuid) {
      if (type === 'sample_pack') {
        type = 'sample-pack'
      }
      let path = `/features/sound-store/${type}/${uuid}`
      this.$router.push({ path: path })
    }
  },
  filters: {
    itemName: function (value) {
      if (!value) return ''
      return value.replace(/_/g, ' ')
    }
  }
}
</script>

<style lang="scss">
.autocomplete {
  z-index: 9999999;
}

.v-list-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.soundstore-nav {
  .black-text {
    input::placeholder, .v-label, input {
      color: black;
    }
  }
}

.v-avatar.square {
  border-radius: unset !important;
}

.search-item-title.subtitle-1 {
  line-height: unset;
}
</style>
