<template>
  <v-dialog v-model="dialog" width="300">
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-card-text>
        {{ body }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="cancel" text color="red" @click="$emit(`cancel`)">Cancel</v-btn>
        <v-btn text color="primary" @click="$emit(`continue`); dialog = false;">{{ continueText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: String,
    body: String,
    cancel: {
      default: false,
      type: Boolean
    },
    continueText: String
  },
  data: function () {
    return {
      dialog: false
    }
  },
  methods: {
    openModal: function () {
      this.dialog = true
    }
  }
}
</script>

<style>

</style>
