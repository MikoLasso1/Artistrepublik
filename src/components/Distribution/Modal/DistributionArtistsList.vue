<template>
  <v-row
    v-if="artists && artists.length"
    class="artistlist-set"
    no-gutters
  >
    <v-col cols="12">
      <p class="artistlist-legend">Secondary Artists</p>
    </v-col>
    <v-col cols="12">
      <v-list
        v-if="artists && artists.length > 0"
        color="transparent"
        class="artistlist-items"
      >
        <v-list-item
          v-for="artist in artists"
          :key="artist.id"
          class="artistlist-item"
        >
          <v-list-item-title>
            <p class="artistlist-name text-truncate">
              {{ artist.artist_name }}
            </p>
          </v-list-item-title>
          <v-list-item-action class="artistlist-actions">
            <v-btn small icon class="mr-3" title="Edit Artist">
              <v-icon
                medium
                @click="$emit('edit-artist', artist)"
              >
                mdi-pencil
              </v-icon>
            </v-btn>
            <v-btn small icon class="mr-2">
              <v-icon
                medium
                @click="$emit('remove-artist', artist)"
              >
                mdi-close-circle-outline
              </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: {
    artists: {
      type: Array,
      default: () => null
    }
  },
  data () {
    return {}
  }
}
</script>
<style lang="scss">
.artistlist {
  &-legend {
    font-family: "system", sans-serif;
    text-transform: capitalize;
    font-weight: 400;
    font-size: 16px;
  }

  &-set {
    border: 1px dashed gray;
    padding: 10px;
  }

  &-actions {
    flex-direction: row;
    margin-left: 8px !important;
  }

  &-items {
    padding: 15px 0 0;
  }

  &-item {
    padding: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  }

  &-name {
    font-family: "system", sans-serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    margin: 0 !important;
  }
}
</style>
