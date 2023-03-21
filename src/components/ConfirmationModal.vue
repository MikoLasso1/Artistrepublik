<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-card-text>
        <slot></slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn text color="primary" @click="doContinue">Continue</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: String,
    onContinue: Function
  },
  data: function () {
    return {
      dialog: false
    }
  },
  methods: {
    openModal: function () {
      this.dialog = true
    },
    doContinue: function () {
      this.onContinue()
      this.dialog = false
    }
  }
}
</script>

<style>

</style>
