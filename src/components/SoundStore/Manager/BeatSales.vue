<template>
  <div>
    <beat-sale-field v-for="(field, index) in fields" v-bind:key="index" v-model="fields[index]" @remove="remove(index)" />
    <beat-sale-field v-model="newField" @add="add" :is-new="true" />
  </div>
</template>

<script>
import BeatSaleField from '@/components/SoundStore/Manager/BeatSaleField'

export default {
  components: {
    BeatSaleField
  },
  props: {
    value: null
  },
  data: function () {
    return {
      fields: [],
      newField: this.getNewField()
    }
  },
  watch: {
    value: function (v) {
      this.fields = v ? v : []
    },
    fields: {
      handler: function (fields) {
        this.$emit('input', fields)
      },
      deep: true
    }
  },
  methods: {
    getNewField: function () {
      return {
        start_date: null,
        end_date: null,
        amount: null
      }
    },
    remove: function (index) {
      this.fields.splice(index, 1)
      this.$emit('input', this.fields)
    },
    add: function (newField) {
      this.fields.push(newField)
      this.newField = this.getNewField()
      this.$emit('input', this.fields)
    }
  },
  mounted: function () {
    this.fields = this.value ? this.value : []
  }
}
</script>

<style>

</style>
