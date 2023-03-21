<template>
  <div>
    <div class="text-center">
      <v-icon color="primary" size="100">checkbox-marked-circle</v-icon>
      <h4 class="h4">Successfully Funded</h4>
      <p>You have successfully funded this campaign!</p>
    </div>

    <Feedback :from="'gwu'" />

    <div class="mt-6 d-flex justify-space-between">
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="$emit('close')">Close</v-btn>
    </div>

  </div>
</template>

<script>
import Feedback from '@/components/Feedback'

export default {
  components: {
    Feedback
  }
}
</script>

<style>

</style>
