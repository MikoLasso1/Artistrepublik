<template>
  <div>
    <v-dialog
      v-model="dialog"
      id="alert-modal"
      :max-width="size"
    >
      <v-container color="white" class="p-3">
        <h2>{{ title }}</h2>
      </v-container>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    size: {
      type: Number,
      default: 300
    }
  },
  data () {
    return {
      dialog: false
    }
  },
  methods: {
    openModal () {
      this.dialog = !this.dialog
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
