<template>
  <div>
    <v-row class="align-center">
      <v-col v-if="$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs" cols="12">
        <SearchAutoComplete />
      </v-col>
      <v-col md="3" cols="12">
        <v-select
          v-model="form.genre_ids"
          multiple
          outlined
          hide-details
          label="Genre"
          :items="genres.map(v=>({value:v.id,text:v.name}))"
          :reduce="genre => genre.id"
        ></v-select>
      </v-col>
      <v-col md="3" cols="12" v-if="showStyles">
        <v-select
          v-model="form.style_ids"
          multiple
          outlined
          hide-details
          label="Styles"
          :items="styles.map(v=>({value:v.id,text:v.name}))"
          :reduce="style => style.id"
        ></v-select>
      </v-col>
      <v-col md="3" cols="12">
        <v-select
          v-model="form.mood_ids"
          multiple
          outlined
          hide-details
          label="Moods"
          :items="moods.map(v=>({value:v.id,text:v.name}))"
          :reduce="mood => mood.id"
        ></v-select>
      </v-col>
      <v-col md="3" cols="12" v-if="showBpm">
        <v-range-slider
          v-model="form.bpm"
          label="BPM"
          hide-details
          max="400"
        >
          <template v-slot:prepend>
            <v-text-field
              :value="form.bpm[0]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(form.bpm, 0, $event)"
            ></v-text-field>
          </template>
          <template v-slot:append>
            <v-text-field
              :value="form.bpm[1]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(form.bpm, 1, $event)"
            ></v-text-field>
          </template>
        </v-range-slider>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SearchAutoComplete from '@/components/SoundStore/SearchAutoComplete'

export default {
  components: {
    SearchAutoComplete
  },
  props: {
    showStyles: {
      type: Boolean,
      default: true
    },
    showBpm: {
      type: Boolean,
      default: true
    }
  },
  data: function () {
    return {
      form: {
        genre_ids: [],
        style_ids: [],
        mood_ids: [],
        bpm: [1, 400]
      }
    }
  },
  computed: {
    ...mapGetters({
      genres: 'SSListings/getGenres',
      styles: 'SSListings/getStyles',
      moods: 'SSListings/getMoods'
    })
  },
  methods: {
    ...mapActions({
      fetchListings: 'SSListings/fetchListings',
      fetchGenres: 'SSListings/fetchGenres',
      fetchStyles: 'SSListings/fetchStyles',
      fetchMoods: 'SSListings/fetchMoods'
    })
  },
  mounted: function () {
    if (this.genres.length === 0) {
      this.fetchGenres()
    }
    if (this.styles.length === 0) {
      this.fetchStyles()
    }
    if (this.moods.length === 0) {
      this.fetchMoods()
    }
  },
  watch: {
    form: {
      handler: function (val) {
        this.$emit('filterUpdated', val)
      },
      deep: true
    }
  }
}
</script>

<style>

</style>
