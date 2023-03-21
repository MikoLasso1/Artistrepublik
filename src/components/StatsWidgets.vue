<template>
  <div>
    <v-row v-if="!loading">
      <v-spacer />
      <v-col cols="6" xl="2" v-for="column in columns" v-bind:key="column.name">
        <StatsCard
          :title="column.title"
          :color="column.color"
          :stat="getValueForName(column)"
          :icon="column.icon"
        />
      </v-col>
      <v-spacer />
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    columns: Array,
    loading: {
      type: Boolean,
      default: false
    },
    statData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {}
  },
  methods: {
    getValueForName: function (column) {
      if (this.statData[column.name] === undefined) {
        return
      }
      if ('filter' in column) {
        return column.filter(this.statData[column.name])
      }
      return this.statData[column.name]
    }
  }
}
</script>

<style>

</style>
